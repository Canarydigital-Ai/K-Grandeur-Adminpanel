import axios from "axios";

let cloudinaryId = import.meta.env.VITE_APP_CLOUDINARY_ID;

export const handleFileUpload = async (file: File) => {
  if (!file) {
    return "";
  }

  const formData = new FormData();
  formData.append("file", file);
  const uploadPreset = "story-Board";
  formData.append("upload_preset", uploadPreset);

  try {
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${cloudinaryId}/image/upload`,
      formData
    );
    return response.data.secure_url;
  } catch (error: any) {
    console.error(
      "Error uploading file:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};
