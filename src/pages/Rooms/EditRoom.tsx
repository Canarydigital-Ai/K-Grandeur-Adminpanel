import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Modal from "../../components/Modal";
import RoomFormModule from "./RoomFormModule";
import { getById, updateRoom } from "../../api/services/RoomService"; 

const EditRoom: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    occupancy: 0,
    imageUrl: null as File | null,
    imagePreview: "",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        setLoading(true);
        const response = await getById(id as string);
        const room = response.data || response;

        setFormData({
          name: room.name || "",
          description: room.description || "",
          occupancy: room.occupancy || 0,
          price: room.price || 0,
          imageUrl: null,
          imagePreview: room.imageUrl || "",
        });
      } catch (error) {
        console.error("Failed to fetch room data:", error);
        Swal.fire({ icon: "error", title: "Error", text: "Failed to fetch room data." });
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchRoom();
  }, [id]);

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

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This will update the room category.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Update",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        let dataToSubmit;

        if (formData.imageUrl) {
          dataToSubmit = new FormData();
          dataToSubmit.append("name", formData.name);
          dataToSubmit.append("description", formData.description);
          dataToSubmit.append("occupancy", formData.occupancy.toString());
          dataToSubmit.append("image", formData.imageUrl);
        } else {
          dataToSubmit = {
            name: formData.name,
            description: formData.description,
            price: formData.price,
            occupancy: formData.occupancy,
          };
        }

        await updateRoom(id as string, dataToSubmit);
        setIsModalOpen(true);
        setTimeout(() => navigate("/admin/rooms"), 2000);
      } catch (error) {
        console.error("Failed to update room:", error);
        Swal.fire({ icon: "error", title: "Error", text: "Failed to update room." });
      }
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    navigate("/admin/rooms");
  };

  if (loading) {
    return (
      <div className="panel mt-6 p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="panel mt-6 p-6">
      <h2 className="text-2xl font-bold mb-4">Edit Room Category</h2>
      <form
        onSubmit={handleFormSubmit}
        className="w-full bg-white p-4 rounded-lg shadow-md"
      >
        <RoomFormModule formData={formData} handleChange={handleChange} />
        <div className="flex justify-center mt-6">
          <button
            type="submit"
            className="text-slate-100 bg-blue-600 px-8 py-3 rounded-lg text-lg font-semibold mr-4 hover:bg-blue-700"
          >
            Update
          </button>
          <button
            type="button"
            className="text-slate-100 bg-red-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-red-700"
            onClick={() => navigate("/admin/rooms")}
          >
            Cancel
          </button>
        </div>
      </form>
      <Modal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        title="Success"
        message="Room category updated successfully!"
      />
    </div>
  );
};

export default EditRoom;