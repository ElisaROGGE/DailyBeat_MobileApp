import { fetchData } from "@/app/utils/fetch";
import { getAuth } from "firebase/auth";

export interface IUser {
    id: number;
    username: string;
    email: string;
    
  }

const API_URL = process.env.EXPO_API_URL;
const auth = getAuth();
const user = auth.currentUser;
console.log("Utilisateur connecté :", user);

export const refreshToken = (userId: string) => fetchData(`${API_URL}/spotify/token/${userId}`, 'POST', )