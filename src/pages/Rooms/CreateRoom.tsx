import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "../../components/Modal";
import RoomFormModule from "./RoomFormModule";
import { handleFileUpload } from "../../utils/handleImageUpload";
import { createRoom } from "../../api/services/RoomService"; 

const CreateRoom: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    occupancy: 0,
    imageUrl: null as File | null,
    imagePreview: "",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;

    if (name === "image" && files && files.length > 0) {
      const file = files[0];
      const imagePreview = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, imageUrl: file, imagePreview }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: name === "occupancy" ? Number(value) : value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setUploading(true);
      let imageUrl = "";
      if (formData.imageUrl) {
        imageUrl = await handleFileUpload(formData.imageUrl);
      }

      const dataToSubmit = {
        name: formData.name,
        description: formData.description,
        occupancy: formData.occupancy,
        imageUrl,
      };

      await createRoom(dataToSubmit);
      setIsModalOpen(true);
      setFormData({ name: "", description: "", occupancy: 0, imageUrl: null, imagePreview: "" });
      setTimeout(() => navigate("/admin/rooms"), 2000);
    } catch (error) {
      console.error("Failed to create room:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="panel mt-6 p-6">
      <h2 className="text-2xl font-bold mb-4">Add Room Category</h2>
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow">
        <RoomFormModule formData={formData} handleChange={handleChange} />
        <div className="flex justify-center mt-6">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "Submit"}
          </button>
          <button
            type="button"
            className="ml-4 bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700"
            onClick={() => navigate("/admin/rooms")}
          >
            Cancel
          </button>
        </div>
      </form>
      <Modal
        isOpen={isModalOpen}
        onClose={() => navigate("/admin/rooms")}
        title="Success"
        message="Room category created successfully!"
      />
    </div>
  );
};

export default CreateRoom;