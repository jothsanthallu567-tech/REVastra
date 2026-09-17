import { useState, useCallback } from 'react';

export function useLiveLocation() {
  const [coordinates, setCoordinates] = useState(null);
  const [address, setAddress] = useState('');
  const [municipality, setMunicipality] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAddressFromCoords = async (lat, lon) => {
    try {
      // Free reverse geocoding via OpenStreetMap Nominatim
      // Note: In a production app, use Google Maps API or Mapbox due to rate limits
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`,
        {
          headers: {
            'Accept-Language': 'en-US,en;q=0.9',
          }
        }
      );
      if (!res.ok) throw new Error('Failed to fetch address');
      const data = await res.json();
      
      const addr = data.address;
      // Construct a clean, readable address
      const building = addr.building || addr.house_number || '';
      const road = addr.road || addr.pedestrian || '';
      const neighborhood = addr.neighbourhood || addr.suburb || addr.village || '';
      const city = addr.city || addr.town || addr.county || '';
      const state = addr.state || '';
      const postcode = addr.postcode || '';

      const parts = [building, road, neighborhood, city, state, postcode].filter(Boolean);
      const fullAddress = parts.join(', ');
      
      // Extract municipality/city specifically for Admin dashboard scoping
      const localMunicipality = addr.city || addr.town || addr.county || 'Local Area';

      return { fullAddress, localMunicipality };
    } catch (err) {
      console.error("Geocoding error:", err);
      return { fullAddress: 'Location Found (Address Unresolved)', localMunicipality: 'Unknown' };
    }
  };

  const getLocation = useCallback(async () => {
    setLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setLoading(false);
      return;
    }

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          setCoordinates({ lat, lon });

          const { fullAddress, localMunicipality } = await fetchAddressFromCoords(lat, lon);
          setAddress(fullAddress);
          setMunicipality(localMunicipality);
          setLoading(false);
          
          resolve({ lat, lon, address: fullAddress, municipality: localMunicipality });
        },
        (err) => {
          setError(err.message || 'Failed to get location');
          setLoading(false);
          reject(err);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
      );
    });
  }, []);

  return { coordinates, address, municipality, loading, error, getLocation };
}
