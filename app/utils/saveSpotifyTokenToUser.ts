import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const db = getFirestore();
const auth = getAuth();

export async function storeSpotifyTokenToUser(accessToken: string) {
  const user = auth.currentUser;

  if (!user) {
    console.error('Utilisateur non connecté à Firebase');
    return;
  }

  const userRef = doc(db, 'users', user.uid);
  await setDoc(userRef, {
    spotifyAccessToken: accessToken,
  }, { merge: true });
}
