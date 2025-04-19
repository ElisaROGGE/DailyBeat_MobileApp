import fetchData from "@/app/utils/fetch";
import { getAuth } from "firebase/auth";

const API_URL = process.env.EXPO_API_URL;
const auth = getAuth();
const user = auth.currentUser;
console.log("Utilisateur connecté :", user);

export const addMusicOfTheDay = (data) => fetchData(`${API_URL}//music-of-the-day`, 'POST', data)