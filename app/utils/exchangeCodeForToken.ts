import { getFirestore, doc, updateDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth'; 

const exchangeCodeForTokenAndUpdateFirestore = async (code: string, codeVerifier: string) => {
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

  const auth = getAuth();
  const user = auth.currentUser;

  if (user) {
    const db = getFirestore();
    const userRef = doc(db, 'users', user.uid);

    try {
      await updateDoc(userRef, {
        access_token: json.access_token,
        refresh_token: json.refresh_token,
        expires_in: json.expires_in,
        expires_at: new Date().getTime() + json.expires_in * 1000,
      });

      console.log('User tokens updated successfully!');
    } catch (error) {
      console.error('Error updating Firestore:', error);
    }
  } else {
    console.log('User is not authenticated');
  }
};

export default exchangeCodeForTokenAndUpdateFirestore;