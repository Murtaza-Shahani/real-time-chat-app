import { useQuery } from "@tanstack/react-query";
//import { getUsers } from "@/services/userServices";
import { getUsers } from "../services/userServices";

export const useUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });
};