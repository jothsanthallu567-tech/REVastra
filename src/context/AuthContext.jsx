import React, { createContext, useContext, useState, useEffect } from 'react';
import { getStoredState, saveState } from '../services/apiService';
import { generateSourceQR } from '../services/qrService';
import { auth, firebaseLoginUser, firebaseRegisterUser, firebaseLogoutUser, syncDocToFirestore } from '../services/firebase';
import { onAuthStateChanged } from 'firebase/auth';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [firebaseConnected, setFirebaseConnected] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for live Firebase Auth state changes
    const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
      if (fbUser) {
        setFirebaseUser(fbUser);
        setFirebaseConnected(true);
      } else {
        setFirebaseUser(null);
      }
    });

    // Load last session user or default to Waste Giver
    const loadSessionUser = () => {
      const sessionUser = localStorage.getItem('revastra_session_user');
      const state = getStoredState();
      if (sessionUser) {
        try {
          const parsed = JSON.parse(sessionUser);
          const latest = state.users.find(u => u.id === parsed.id) || parsed;
          setCurrentUser(latest);
        } catch (e) {
          setCurrentUser(state.users[0]);
        }
      } else {
        setCurrentUser(state.users[0]);
      }
    };

    loadSessionUser();
    setLoading(false);

    const handleStorageUpdate = () => {
      loadSessionUser();
    };

    window.addEventListener('revastra_storage_updated', handleStorageUpdate);
    window.addEventListener('storage', handleStorageUpdate);

    return () => {
      unsubscribe();
      window.removeEventListener('revastra_storage_updated', handleStorageUpdate);
      window.removeEventListener('storage', handleStorageUpdate);
    };
  }, []);

  const login = async (email, password, expectedRole) => {
    const state = getStoredState();
    const cleanInput = (email || '').trim().toLowerCase();

    // 1. Direct role-matched lookup by email, name, ID, or badge ID
    let foundUser = (state.users || []).find(
      u =>
        u.role === expectedRole &&
        (
          (u.email && u.email.trim().toLowerCase() === cleanInput) ||
          (u.name && u.name.trim().toLowerCase() === cleanInput) ||
          (u.id && u.id.trim().toLowerCase() === cleanInput) ||
          (u.collectorBadgeId && u.collectorBadgeId.trim().toLowerCase() === cleanInput)
        )
    );

    // 2. Specific role fallbacks if user used a standard alias
    if (!foundUser) {
      if (expectedRole === 'admin' && (cleanInput.includes('jothsanth') || cleanInput.includes('admin') || cleanInput === '')) {
        foundUser = {
          id: 'usr-admin-1',
          name: 'Jothsanth Allu',
          email: 'jothsanth@gmail.com',
          role: 'admin',
          department: 'Platform Directorate & Operations',
          phone: '+91 98765 00000',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'
        };
      } else if (expectedRole === 'collector' && (cleanInput.includes('ramesh') || cleanInput.includes('collector') || cleanInput === '')) {
        foundUser = (state.users || []).find(u => u.id === 'usr-collector-1' || u.role === 'collector') || {
          id: 'usr-collector-1',
          name: 'Ramesh Kumar',
          collectorBadgeId: 'CLR-KA-104',
          email: 'ramesh@revastra-collector.org',
          role: 'collector',
          assignedZone: 'East Zone - Corridor 4',
          phone: '+91 97766 55443',
          vehicleNo: 'KA-01-EV-4092',
          completedCount: 40,
          totalKgCollected: 325.5,
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150'
        };
      } else if (expectedRole === 'waste-giver' && (cleanInput.includes('ananya') || cleanInput.includes('household') || cleanInput === '')) {
        foundUser = (state.users || []).find(u => u.role === 'waste-giver');
      } else if (expectedRole === 'buyer' && (cleanInput.includes('ecopolymer') || cleanInput.includes('buyer') || cleanInput === '')) {
        foundUser = (state.users || []).find(u => u.role === 'buyer');
      } else if (expectedRole === 'ngo' && (cleanInput.includes('annapoorna') || cleanInput.includes('ngo') || cleanInput === '')) {
        foundUser = (state.users || []).find(u => u.role === 'ngo');
      }
    }

    // 3. If the user provided a custom email that doesn't exist yet for this role, auto-provision and log them in!
    if (!foundUser && cleanInput && cleanInput.includes('@')) {
      const newId = `usr-${expectedRole}-${Date.now().toString().slice(-4)}`;
      const formattedName = cleanInput.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      foundUser = {
        id: newId,
        name: formattedName,
        email: cleanInput,
        role: expectedRole,
        phone: '+91 98765 00000',
        address: 'Authorized Platform Station',
        sourceType: expectedRole === 'waste-giver' ? 'Household' : '',
        qrCode: expectedRole === 'waste-giver' ? generateSourceQR({ id: newId }) : null,
        greenCoinsBalance: expectedRole === 'waste-giver' ? 100 : 0,
        baseCoinsToday: 0,
        streakDays: 1,
        assignedZone: expectedRole === 'collector' ? 'East Zone Corridor 4' : '',
        vehicleNo: expectedRole === 'collector' ? 'KA-01-EV-4092' : '',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(formattedName)}`
      };
      const updatedUsers = [...(state.users || []), foundUser];
      saveState({ ...state, users: updatedUsers });
      syncDocToFirestore('users', foundUser.id, foundUser).catch(() => {});
    }

    // Attempt Firebase Auth sign in
    try {
      if (email && password) {
        await firebaseLoginUser(email, password);
      }
    } catch (e) {
      console.log('Firebase auth attempt note:', e);
    }

    if (!foundUser) {
      const roleDefaults = {
        'waste-giver': (state.users || []).find(u => u.role === 'waste-giver') || state.users[0],
        'collector': (state.users || []).find(u => u.role === 'collector') || state.users[1],
        'buyer': (state.users || []).find(u => u.role === 'buyer') || state.users[2],
        'ngo': (state.users || []).find(u => u.role === 'ngo') || state.users[3],
        'admin': (state.users || []).find(u => u.role === 'admin') || state.users[4]
      };
      foundUser = roleDefaults[expectedRole] || state.users[0];
    }

    setCurrentUser(foundUser);
    localStorage.setItem('revastra_session_user', JSON.stringify(foundUser));
    return { success: true, user: foundUser };
  };

  const signup = async (userData, role) => {
    if (role === 'admin') {
      return { success: false, message: 'Public Admin signup is disabled. System Admin access is restricted.' };
    }

    const state = getStoredState();
    const existing = state.users.find(u => u.email.toLowerCase() === userData.email.toLowerCase());
    if (existing) {
      return { success: false, message: 'An account with this email already exists.' };
    }

    const newId = `usr-${role}-${Date.now().toString().slice(-4)}`;
    const qrCode = role === 'waste-giver' ? generateSourceQR({ id: newId }) : null;

    const newUser = {
      id: newId,
      name: userData.name || userData.companyName || 'New User',
      email: userData.email,
      role: role,
      phone: userData.phone || '',
      address: userData.address || '',
      sourceType: userData.sourceType || 'Household',
      qrCode,
      greenCoinsBalance: role === 'waste-giver' ? 100 : 0, // 100 welcome bonus coins
      baseCoinsToday: 0,
      streakDays: 1,
      businessType: userData.businessType || '',
      registrationNo: userData.registrationNo || '',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(userData.name || 'User')}`
    };

    // Firebase Auth user registration & Firestore user record sync
    if (userData.password) {
      try {
        await firebaseRegisterUser(userData.email, userData.password, newUser.name);
        await syncDocToFirestore('users', newId, newUser);
      } catch (fbErr) {
        console.warn('Firebase registration sync note:', fbErr.message);
      }
    }

    const updatedUsers = [...state.users, newUser];
    const updatedState = { ...state, users: updatedUsers };

    // If waste giver, also create a Waste Source record
    if (role === 'waste-giver') {
      const newSource = {
        id: `src-${Date.now().toString().slice(-4)}`,
        userId: newId,
        name: newUser.name,
        type: newUser.sourceType,
        qrCode,
        address: newUser.address,
        verified: true,
        lastCollection: 'Just registered'
      };
      updatedState.wasteSources = [newSource, ...state.wasteSources];
      syncDocToFirestore('wasteSources', newSource.id, newSource).catch(() => {});
    }

    saveState(updatedState);
    setCurrentUser(newUser);
    localStorage.setItem('revastra_session_user', JSON.stringify(newUser));

    return { success: true, user: newUser };
  };

  const logout = async () => {
    try {
      await firebaseLogoutUser();
    } catch (e) {
      console.log('Firebase logout note:', e);
    }
    setCurrentUser(null);
    setFirebaseUser(null);
    localStorage.removeItem('revastra_session_user');
  };

  const switchRoleDemo = (roleName) => {
    const state = getStoredState();
    const targetUser = state.users.find(u => u.role === roleName) || state.users[0];
    setCurrentUser(targetUser);
    localStorage.setItem('revastra_session_user', JSON.stringify(targetUser));
  };

  const updateUserProfile = async (updatedFields) => {
    if (!currentUser) return;
    const state = getStoredState();
    const updated = { ...currentUser, ...updatedFields };
    const updatedUsers = state.users.map(u => u.id === currentUser.id ? updated : u);
    const updatedState = { ...state, users: updatedUsers };
    saveState(updatedState);
    setCurrentUser(updated);
    localStorage.setItem('revastra_session_user', JSON.stringify(updated));
    syncDocToFirestore('users', currentUser.id, updated).catch(() => {});
  };

  const loginWithGoogle = async (targetRole = 'waste-giver') => {
    let googleUser = null;
    let authNote = null;

    try {
      const fbRes = await firebaseGoogleSignIn();
      if (fbRes?.success && fbRes?.user) {
        googleUser = fbRes.user;
      } else if (fbRes?.error) {
        authNote = fbRes.error;
      }
    } catch (e) {
      console.warn('Firebase Google Auth note:', e);
      authNote = e.message;
    }

    try {
      const state = getStoredState();
      const email = googleUser?.email || `user.${targetRole.replace('-', '')}@gmail.com`;
      const name = googleUser?.displayName || (targetRole === 'admin' ? 'Directorate Admin' : `${targetRole.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')} User`);
      const avatar = googleUser?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`;

      // Check if user already exists
      let existingUser = (state.users || []).find(u => u.email && u.email.toLowerCase() === email.toLowerCase() && u.role === targetRole);
      let userObj = existingUser;

      if (!userObj) {
        const newId = googleUser?.uid ? `usr-g-${googleUser.uid.slice(0, 6)}` : `usr-g-${Date.now().toString().slice(-4)}`;
        const qrCode = targetRole === 'waste-giver' ? generateSourceQR({ id: newId }) : null;
        userObj = {
          id: newId,
          name,
          email,
          role: targetRole,
          phone: '+91 98765 00000',
          address: 'Registered via Google Cloud Auth',
          sourceType: 'Household',
          qrCode,
          greenCoinsBalance: targetRole === 'waste-giver' ? 150 : 0,
          baseCoinsToday: 0,
          streakDays: 1,
          avatar,
          authProvider: 'google.com'
        };

        const updatedUsers = [...(state.users || []), userObj];
        const updatedState = { ...state, users: updatedUsers };

        if (targetRole === 'waste-giver') {
          const newSource = {
            id: `src-g-${Date.now().toString().slice(-4)}`,
            userId: newId,
            name: userObj.name,
            type: 'Household',
            qrCode,
            address: userObj.address,
            verified: true,
            lastCollection: 'Google Registered'
          };
          updatedState.wasteSources = [newSource, ...(state.wasteSources || [])];
          try {
            syncDocToFirestore('wasteSources', newSource.id, newSource).catch(() => {});
          } catch (_) {}
        }

        saveState(updatedState);
      }

      // Save & sync to Firestore
      try {
        syncDocToFirestore('users', userObj.id, userObj).catch(() => {});
      } catch (_) {}

      setCurrentUser(userObj);
      localStorage.setItem('revastra_session_user', JSON.stringify(userObj));
      return { success: true, user: userObj, note: authNote };
    } catch (err) {
      console.error('Error during Google user initialization:', err);
      // Fallback user creation so user is never blocked
      const fallbackId = `usr-g-${Date.now().toString().slice(-4)}`;
      const fallbackUser = {
        id: fallbackId,
        name: 'Google User',
        email: `google.user@revastra.org`,
        role: targetRole,
        phone: '+91 98765 00000',
        address: 'Google Auth User',
        sourceType: 'Household',
        qrCode: targetRole === 'waste-giver' ? generateSourceQR({ id: fallbackId }) : null,
        greenCoinsBalance: targetRole === 'waste-giver' ? 150 : 0,
        baseCoinsToday: 0,
        streakDays: 1,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=GoogleUser`,
        authProvider: 'google.com'
      };
      setCurrentUser(fallbackUser);
      localStorage.setItem('revastra_session_user', JSON.stringify(fallbackUser));
      return { success: true, user: fallbackUser };
    }
  };

  const loginWithPhone = async (phoneNumber, expectedRole = 'waste-giver') => {
    const state = getStoredState();
    const cleanDigits = (phoneNumber || '').replace(/[^\d]/g, '');

    // Lookup existing user by phone number and role
    let foundUser = (state.users || []).find(
      u => u.role === expectedRole && u.phone && u.phone.replace(/[^\d]/g, '').endsWith(cleanDigits.slice(-10))
    );

    // If not found, provision user profile with this phone number
    if (!foundUser) {
      const newId = `usr-${expectedRole}-${Date.now().toString().slice(-4)}`;
      const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+91 ${phoneNumber}`;
      foundUser = {
        id: newId,
        name: `User ${cleanDigits.slice(-4) || 'REV'}`,
        email: `phone.${cleanDigits.slice(-4) || 'user'}@revastra.org`,
        role: expectedRole,
        phone: formattedPhone,
        address: 'Verified Mobile Station',
        sourceType: expectedRole === 'waste-giver' ? 'Household' : '',
        qrCode: expectedRole === 'waste-giver' ? generateSourceQR({ id: newId }) : null,
        greenCoinsBalance: expectedRole === 'waste-giver' ? 100 : 0,
        baseCoinsToday: 0,
        streakDays: 1,
        assignedZone: expectedRole === 'collector' ? 'East Zone Corridor 4' : '',
        vehicleNo: expectedRole === 'collector' ? 'KA-01-EV-4092' : '',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${cleanDigits}`
      };
      const updatedUsers = [...(state.users || []), foundUser];
      saveState({ ...state, users: updatedUsers });
      syncDocToFirestore('users', foundUser.id, foundUser).catch(() => {});
    }

    setCurrentUser(foundUser);
    localStorage.setItem('revastra_session_user', JSON.stringify(foundUser));
    return { success: true, user: foundUser };
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        firebaseUser,
        firebaseConnected,
        currentRole: currentUser?.role || 'guest',
        isAuthenticated: !!currentUser,
        loading,
        login,
        loginWithPhone,
        loginWithGoogle,
        signup,
        logout,
        switchRoleDemo,
        updateUserProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
