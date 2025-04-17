import api from "../interceptors/axiosInterceptors"; 

export const getRoom = async () => {
  try {
    const response = await api.get("/products");
    if (response.status === 200) {
      return response.data.products;
    }
    return [];
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const createRoom = async (data: any) => {
  try {
    const response = await api.post("/products", data);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const uploadRoom = async (data: any) => {
  try {
    const response = await api.post("/products/upload", data);
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

export const getById = async (id: string) => {
  try {
    const response = await api.get(`/products/${id}`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const updateRoom = async (id: string, data: any) => {
  try {
    const isFormData = data instanceof FormData;
    const config = isFormData
      ? { headers: { "Content-Type": "multipart/form-data" } }
      : {};

    const response = await api.put(`/products/${id}`, data, config);
    return response.data;
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
};

export const deleteRoom = async (id: string) => {
  try {
    // Change the DELETE request to use the request body instead of params
    const response = await api.delete(`/products/delete`, {
      data: { id }  // Sending `id` in the body instead of URL
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error; // Propagate the error so the calling function can handle it
  }
};


export const updateStatus = async (id: string, status: boolean) => {
  try {
    // Sending the status update to the server
    const response = await api.put(`/products/status/${id}`, {
      isActive: status,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating product status:", error);
    throw new Error("Failed to update product status.");
  }
};

export const updateNewArrival = async (id: string, status: boolean) => {
  try {
    // Sending the status update to the server
    const response = await api.put(`/products/new-arrival/${id}`, {
      newArrival: status,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating product status:", error);
    throw new Error("Failed to update product status.");
  }
};
