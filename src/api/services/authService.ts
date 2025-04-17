import api from "../interceptors/axiosInterceptors";

export const loginAdmin = async (formdata: any) => {
  try {
    const response = await api.post("auth/login", formdata);
    console.log("🔥 Raw API response:", response);

    if (response.status === 201 || response.status === 200) {
      const { token } = response.data.data;
      localStorage.setItem("token", token);
      return response.data;
    }
  } catch (error: any) {
    console.log("❌ API error:", error.response);
    return null;
  }
};



