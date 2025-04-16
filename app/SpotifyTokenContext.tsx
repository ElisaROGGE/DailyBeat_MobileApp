import React, { createContext, useState, useContext, useEffect } from 'react';
import { getAuth } from 'firebase/auth';

const SpotifyTokenContext = createContext({
  accessToken: null,
  expiresAt: null,
  setAccessToken: () => {},
});

export const SpotifyTokenProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [expiresAt, setExpiresAt] = useState(null);

  const fetchSpotifyToken = async (userId: string) => {
    try {
      const response = await fetch(`${process.env.EXPO_API_URL}/spotify/token/${userId}`);
      const data = await response.json();
      setAccessToken(data.access_token);
      setExpiresAt(data.expires_at);
    } catch (error) {
      console.error("Erreur lors de la récupération du token:", error);
    }
  };

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const userId = user.uid;
      fetchSpotifyToken(userId);
    } else {
      console.log('Aucun utilisateur connecté');
    }
  }, []);

  return (
    <SpotifyTokenContext.Provider value={{ accessToken, expiresAt, setAccessToken }}>
      {children}
    </SpotifyTokenContext.Provider>
  );
};

// Hook pour accéder facilement au token
export const useSpotifyToken = () => {
  return useContext(SpotifyTokenContext);
};
