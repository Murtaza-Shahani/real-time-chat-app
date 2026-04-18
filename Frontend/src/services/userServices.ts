import axios from "axios";

//const API_URL = "http://localhost:3000";
const API_URL = import.meta.env.VITE_API_URL;
export const getUsers = async () =>{
  try{
    const response = await axios.get(`${API_URL}/users`);
    return response.data;

  }
  catch(error){
    console.error("Error fetching users:", error);
    throw error;
  }
}