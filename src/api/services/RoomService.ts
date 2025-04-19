import api from "../interceptors/axiosInterceptors"; 

// ✅ GET all room categories
export const getRoom = async () => {
  try {
    const response = await api.get("/room-category");
    
    if (response.status === 200) {
      return response.data.data; // will be [] if no room categories
    }

    return [];
  } catch (error) {
    console.log("Error fetching rooms:", error); // Logs error like 500s
    return []; // prevents crash in UI
  }
};

// ✅ CREATE a new room category
export const createRoom = async (data: any) => {
  try {
    const response = await api.post("/room-category", data);
    return response.data;
  } catch (error) {
    console.log("Error creating room:", error);
  }
};

// ✅ GET room category by ID
export const getById = async (id: string) => {
  try {
    const response = await api.get(`/room-category/${id}`);
    return response.data.data;
  } catch (error) {
    console.log("Error fetching room by ID:", error);
  }
};

// ✅ UPDATE room category
export const updateRoom = async (id: string, data: any) => {
  try {
    const response = await api.patch(`/room-category/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Error updating room:", error);
    throw error;
  }
};

// ✅ DELETE room category
export const deleteRoom = async (id: string) => {
  try {
    const response = await api.delete(`/room-category/${id}`);
    return response.data;
  } catch (error) {
    console.log("Error deleting room:", error);
    throw error;
  }
};
