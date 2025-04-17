import { toast } from "react-toastify";
import api from "../interceptors/axiosInterceptors";

export const loginAdmin = async (formdata: any) => {
  try {
    const response = await api.post("auth/login", formdata);
    if (response.status === 200) {
      localStorage.setItem("token", response.data.token);
      toast.success(response.data.messages);
      return response.data;
    }
  } catch (error: any) {
    toast.error(error.response.data.message);
  }
};
