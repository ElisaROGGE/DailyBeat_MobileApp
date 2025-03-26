export const exchangeCodeForToken = async (code: string) => {
    try {
      const clientId = process.env.EXPO_PUBLIC_CLIENT_ID;
      const clientSecret = process.env.EXPO_PUBLIC_CLIENT_SECRET;
      const redirectUri = process.env.EXPO_PUBLIC_REDIRECT_URI;

      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code,
          redirect_uri: redirectUri,
          client_id: clientId,
          client_secret: clientSecret,
        }).toString(),
      });

      const data = await response.json();
      if (response.ok) {
        setAccessToken(data.access_token);
        return data.access_token;
      } else {
        console.error('Erreur lors de l’échange du token:', data);
        return null;
      }
    } catch (error) {
      console.error('Erreur réseau:', error);
      return null;
    }
  };