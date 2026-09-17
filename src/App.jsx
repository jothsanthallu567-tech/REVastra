import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { LanguageProvider } from './context/LanguageContext';

// Layouts
import { MainLayout } from './layouts/MainLayout';
import { AuthLayout } from './layouts/AuthLayout';

// Global Chatbot
import { Chatbot } from './components/common/Chatbot';

// Public pages
import { SplashPage } from './pages/SplashPage';
import { LandingPage } from './pages/LandingPage';
import { RoleSelection } from './pages/RoleSelection';
import { LoginPage } from './pages/auth/LoginPage';
import { SignupPage } from './pages/auth/SignupPage';
import { VerifySourcePage } from './pages/public/VerifySourcePage';

// Waste Giver Pages
import { WasteGiverDashboard } from './pages/wasteGiver/Dashboard';
import { DonateFoodPage } from './pages/wasteGiver/DonateFoodPage';
import { RequestCollection } from './pages/wasteGiver/RequestCollection';
import { MyCollections } from './pages/wasteGiver/MyCollections';
import { MyQRPage } from './pages/wasteGiver/MyQRPage';
import { WalletPage } from './pages/wasteGiver/WalletPage';
import { GroceryRewardsPage } from './pages/wasteGiver/GroceryRewardsPage';
import { LandfillImpactPage } from './pages/wasteGiver/LandfillImpactPage';
import { WasteGiverProfile } from './pages/wasteGiver/ProfilePage';

// Collector Pages
import { CollectorDashboard } from './pages/collector/Dashboard';
import { ScanQRPage } from './pages/collector/ScanQR';
import { CollectionRequests } from './pages/collector/CollectionRequests';
import { CollectorRoutes } from './pages/collector/Routes';
import { CollectorProfile } from './pages/collector/ProfilePage';

// Buyer Pages
import { BuyerDashboard } from './pages/buyer/Dashboard';
import { Marketplace } from './pages/buyer/Marketplace';
import { BuyerMatching } from './pages/buyer/Matching';
import { BuyerOrders } from './pages/buyer/Orders';
import { BuyerProfile } from './pages/buyer/BuyerProfile';

// NGO Pages
import { NGODashboard } from './pages/ngo/Dashboard';
import { NGOFoodDonations } from './pages/ngo/FoodDonations';
import { NGOAcceptedPickups } from './pages/ngo/AcceptedPickups';
import { NGOImpact } from './pages/ngo/Impact';
import { NGOProfile } from './pages/ngo/ProfilePage';

// Admin Pages
import { AdminOverview } from './pages/admin/Overview';
import { AdminUserManagement } from './pages/admin/UserManagement';
import { AdminCollectorHistory } from './pages/admin/CollectorHistory';
import { AdminRecoveryCentres } from './pages/admin/RecoveryCentres';
import { SegregationWeighing } from './pages/recoveryCentre/SegregationWeighing';
import { AdminInventoryMgmt } from './pages/admin/InventoryMgmt';
import { AdminMarketplaceOrders } from './pages/admin/MarketplaceOrders';
import { AdminCoinRules } from './pages/admin/CoinRules';
import { AdminFoodOversight } from './pages/admin/FoodOversight';
import { RevenueDashboard } from './pages/admin/RevenueDashboard';
import { AdminImpactAnalytics } from './pages/admin/ImpactAnalytics';
import { BatchTraceabilityPage } from './pages/admin/BatchTraceabilityPage';
import { AISuitePage } from './pages/admin/AISuitePage';
import { AdminSystemSettings } from './pages/admin/SystemSettings';

import { NotFoundPage } from './pages/common/NotFoundPage';

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <DataProvider>
            <Router>
              <Routes>
                {/* Minimalist Splash Entrance Screen (Opening shows ONLY REVastra symbol and name) */}
                <Route path="/" element={<SplashPage />} />

                {/* Role Selection & Login Entry Screen */}
                <Route path="/role-selection" element={<RoleSelection />} />

                {/* Full Platform Story Landing Page */}
                <Route path="/home" element={<LandingPage />} />
                <Route path="/about" element={<LandingPage />} />

                {/* Real-Time QR Verification & Doorstep Pickup Route (Public & Mobile Accessible) */}
                <Route path="/verify-source" element={<VerifySourcePage />} />
                <Route path="/source/:code" element={<VerifySourcePage />} />

                {/* Auth Layout Routes */}
                <Route element={<AuthLayout />}>
                  <Route path="/login/:role" element={<LoginPage />} />
                  <Route path="/signup/:role" element={<SignupPage />} />
                </Route>

                {/* Main Application Layout Routes */}
                <Route element={<MainLayout />}>
                  {/* Waste Giver Module */}
                  <Route path="/waste-giver/dashboard" element={<WasteGiverDashboard />} />
                  <Route path="/waste-giver/donate-food" element={<DonateFoodPage />} />
                  <Route path="/waste-giver/my-qr" element={<MyQRPage />} />
                  <Route path="/waste-giver/request-collection" element={<RequestCollection />} />
                  <Route path="/waste-giver/collections" element={<MyCollections />} />
                  <Route path="/waste-giver/wallet" element={<WalletPage />} />
                  <Route path="/waste-giver/grocery-rewards" element={<GroceryRewardsPage />} />
                  <Route path="/waste-giver/impact" element={<LandfillImpactPage />} />
                  <Route path="/waste-giver/profile" element={<WasteGiverProfile />} />

                  {/* Collector Module */}
                  <Route path="/collector/dashboard" element={<CollectorDashboard />} />
                  <Route path="/collector/scan-qr" element={<ScanQRPage />} />
                  <Route path="/collector/requests" element={<CollectionRequests />} />
                  <Route path="/collector/my-collections" element={<MyCollections />} />
                  <Route path="/collector/routes" element={<CollectorRoutes />} />
                  <Route path="/collector/profile" element={<CollectorProfile />} />

                  {/* Recovery Centre Direct Shortcuts */}
                  <Route path="/recovery-centre/dashboard" element={<AdminRecoveryCentres />} />
                  <Route path="/recovery-centre/segregation" element={<SegregationWeighing />} />
                  <Route path="/recovery-centre/inventory" element={<AdminInventoryMgmt />} />

                  {/* Buyer Module */}
                  <Route path="/buyer/dashboard" element={<BuyerDashboard />} />
                  <Route path="/buyer/marketplace" element={<Marketplace />} />
                  <Route path="/buyer/matching" element={<BuyerMatching />} />
                  <Route path="/buyer/orders" element={<BuyerOrders />} />
                  <Route path="/buyer/history" element={<BuyerOrders />} />
                  <Route path="/buyer/profile" element={<BuyerProfile />} />

                  {/* NGO Module */}
                  <Route path="/ngo/dashboard" element={<NGODashboard />} />
                  <Route path="/ngo/food-donations" element={<NGOFoodDonations />} />
                  <Route path="/ngo/accepted-pickups" element={<NGOAcceptedPickups />} />
                  <Route path="/ngo/impact" element={<NGOImpact />} />
                  <Route path="/ngo/profile" element={<NGOProfile />} />

                  {/* System Admin Module */}
                  <Route path="/admin/dashboard" element={<AdminOverview />} />
                  <Route path="/admin/users" element={<AdminUserManagement />} />
                  <Route path="/admin/collectors" element={<AdminCollectorHistory />} />
                  <Route path="/admin/collections" element={<MyCollections />} />
                  <Route path="/admin/recovery-centres" element={<AdminRecoveryCentres />} />
                  <Route path="/admin/recovery-centres/segregation" element={<SegregationWeighing />} />
                  <Route path="/admin/inventory" element={<AdminInventoryMgmt />} />
                  <Route path="/admin/marketplace-orders" element={<AdminMarketplaceOrders />} />
                  <Route path="/admin/coin-rules" element={<AdminCoinRules />} />
                  <Route path="/admin/food-rescue" element={<AdminFoodOversight />} />
                  <Route path="/admin/revenue" element={<RevenueDashboard />} />
                  <Route path="/admin/impact-analytics" element={<AdminImpactAnalytics />} />
                  <Route path="/admin/traceability" element={<BatchTraceabilityPage />} />
                  <Route path="/admin/ai-suite" element={<AISuitePage />} />
                  <Route path="/admin/settings" element={<AdminSystemSettings />} />

                  {/* Direct Batch Traceability Shortcut */}
                  <Route path="/traceability" element={<BatchTraceabilityPage />} />
                </Route>

                {/* Fallback 404 */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>

              {/* Global Floating REVASTRA Assistant Chatbot */}
              <Chatbot />
            </Router>
          </DataProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
