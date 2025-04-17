import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "../../components/Modal"; 
import ProductFormModule from "./RoomFormModule";
// import { createRoom } from "../../../api/services/admin/ProductService";
// import { getCategories } from "../../../api/services/admin/CategoryService";
import { handleFileUpload } from "../../utils/handleImageUpload"; 

const CreateRoom: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    imageUrl: null as File | null,
    imagePreview: "",
    category: "",
    stock: 0,
    isActive: false,
    newArrival: false,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [categories, setCategories] = useState<{ _id: string; name: string }[]>(
    []
  );

  // useEffect(() => {
  //   const fetchCategories = async () => {
  //     try {
  //       const response = await getCategories();
  //       if (response && response.categories) {
  //         setCategories(response.categories);
  //       }
  //     } catch (error) {
  //       console.error("Failed to fetch categories:", error);
  //     }
  //   };
  //   fetchCategories();
  // }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;

    if (name === "image" && files && files.length > 0) {
      // For file input
      const file = files[0];
      const imagePreview = URL.createObjectURL(file);

      setFormData((prevData) => ({
        ...prevData,
        imageUrl: file, 
        imagePreview, 
      }));
    } else {
      // For other inputs
      setFormData((prevData) => ({
        ...prevData,
        [name]: name === "price" || name === "stock" ? Number(value) : value,
      }));
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData((prevData) => ({
      ...prevData,
      category: e.target.value,
    }));
  };

  const handleNewArrivalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prevData) => ({
      ...prevData,
      newArrival: e.target.checked,
    }));
  };

  const handleIsActiveChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prevData) => ({
      ...prevData,
      isActive: e.target.checked,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setUploading(true);
      // Upload image if we have one
      let imageUrl = "";
      if (formData.imageUrl) {
        // console.log("Attempting to upload image:", formData.imageUrl.name);
        imageUrl = await handleFileUpload(formData.imageUrl);
        // console.log("Image uploaded successfully, URL:", imageUrl);
      }

      const dataToSubmit = {
        name: formData.name,
        description: formData.description,
        price: formData.price,
        category: formData.category,
        stock: formData.stock,
        imageUrl: imageUrl,
        isActive: formData.isActive,
      };
      // await createRoom(dataToSubmit);

      setIsModalOpen(true);
      setFormData({
        name: "",
        description: "",
        price: 0,
        category: "",
        stock: 0,
        imageUrl: null,
        imagePreview: "",
        isActive: false,
        newArrival: false,
      });

      setTimeout(() => navigate("/admin/products"), 2000);
    } catch (error) {
      console.error("Failed to add product:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    navigate("/admin/products");
  };

  const handleCancel = () => {
    navigate("/admin/products");
  };

  return (
    <div className="panel mt-6 p-6">
      <h2 className="text-2xl font-bold mb-4">Add Product</h2>
      <form
        onSubmit={handleSubmit}
        className="w-full bg-white p-4 rounded-lg shadow-md"
      >
        <ProductFormModule
          formData={formData}
          handleChange={handleChange}
          handleCategoryChange={handleCategoryChange}
          handleIsActiveChange={handleIsActiveChange}
          handleNewArrivalChange={handleNewArrivalChange}
          categories={categories}
        />
        <div className="flex justify-center mt-6">
          <button
            type="submit"
            className="text-slate-100 bg-blue-600 px-8 py-3 rounded-lg text-lg font-semibold mr-4 hover:bg-blue-700"
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "Submit"}
          </button>
          <button
            type="button"
            className="text-slate-100 bg-red-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-red-700"
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>
      </form>
      <Modal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        title="Success"
        message="Product added successfully!"
      />
    </div>
  );
};

export default CreateRoom;
