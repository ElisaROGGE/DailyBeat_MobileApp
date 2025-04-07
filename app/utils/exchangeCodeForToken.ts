export const exchangeCodeForToken = async (code: string, codeVerifier: string) => {
  const creds = `${process.env.EXPO_PUBLIC_TEST_SPOTIFY_CLIENT_ID}:${process.env.EXPO_PUBLIC_TEST_SPOTIFY_CLIENT_SECRET}`;
  const encodedCreds = btoa(creds);

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${encodedCreds}`, 
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: process.env.EXPO_PUBLIC_TEST_SPOTIFY_REDIRECT_URI || '',
      code_verifier: codeVerifier,
    }).toString(),
  });

  const json = await response.json();
  console.log('Token response:', json);
};
