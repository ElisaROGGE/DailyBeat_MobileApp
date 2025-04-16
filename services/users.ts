import { fetchData } from "@/app/utils/fetch";

export interface IUser {
    id: number;
    username: string;
    email: string;
    
  }

const API_URL = process.env.EXPO_API_URL;

export const getUsers = () => fetchData(`${API_URL}/users`)
export const addUser = (data: IUser) => fetchData(`${API_URL}/users`, 'POST', data)