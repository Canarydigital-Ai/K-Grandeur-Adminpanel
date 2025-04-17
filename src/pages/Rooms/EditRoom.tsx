import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Modal from "../../../components/Modal";
import ProductFormModule from "./RoomFormModule";
import {
  getById,
  updateProduct,
} from "../../../api/services/admin/ProductService";
import { getCategories } from "../../../api/services/admin/CategoryService";

const EditProduct: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // State to hold the form data
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

  // State to hold categories data - initialize with empty array to prevent map errors
  const [categories, setCategories] = useState<{ _id: string; name: string }[]>(
    []
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        try {
          setLoading(true);

          // Fetch categories first
          const categoriesResponse = await getCategories();

          // Check if categoriesResponse has the expected structure and extract categories
          if (categoriesResponse && categoriesResponse.categories) {
            setCategories(categoriesResponse.categories);
          } else {
            // If categoriesResponse is directly the array
            setCategories(
              Array.isArray(categoriesResponse) ? categoriesResponse : []
            );
          }

          // Then fetch product data
          const productResponse = await getById(id);

          // Handle different API response structures
          let product;
          if (productResponse.product) {
            product = productResponse.product;
          } else {
            product = productResponse;
          }

          // Handle different formats of category data
          let categoryId = "";
          if (product.category) {
            // If category is an object with _id property
            if (typeof product.category === "object" && product.category._id) {
              categoryId = product.category._id;
            }
            // If category is directly the ID string
            else if (typeof product.category === "string") {
              categoryId = product.category;
            }
          }

          setFormData({
            name: product.name,
            description: product.description,
            price: product.price,
            category: categoryId,
            stock: product.stock,
            isActive: product.isActive,
            imageUrl: null,
            imagePreview: product.imageUrl || "",
            newArrival: product.newArrival || false,
          });
        } catch (error) {
          console.error("Failed to fetch data:", error);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Failed to fetch data. Please try again.",
          });
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, value, files, checked } = e.target;

    if (name === "image" && files && files.length > 0) {
      // Handle file upload
      const file = files[0];
      const imagePreview = URL.createObjectURL(file);

      setFormData((prevData) => ({
        ...prevData,
        imageUrl: file,
        imagePreview: imagePreview,
      }));
    } else {
      // Handle other input changes
      setFormData((prevData) => ({
        ...prevData,
        [name]:
          type === "checkbox"
            ? checked
            : type === "number"
            ? Number(value)
            : value,
      }));
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData((prevData) => ({
      ...prevData,
      category: e.target.value,
    }));
  };

  const handleIsActiveChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prevData) => ({
      ...prevData,
      isActive: e.target.checked,
    }));
  };

  const handleNewArrivalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prevData) => ({
      ...prevData,
      newArrival: e.target.checked,
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Update",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    try {
      if (!formData.imageUrl) {
        const productData = {
          name: formData.name,
          description: formData.description,
          price: Number(formData.price),
          category: formData.category,
          stock: Number(formData.stock),
          isActive: formData.isActive,
          newArrival: formData.newArrival,
        };
        await updateProduct(id as string, productData);

        setIsModalOpen(true);
        setTimeout(() => navigate("/admin/products"), 2000);
        return;
      }

      // If we have a new image, use FormData
      const formDataToSubmit = new FormData();
      formDataToSubmit.append("name", formData.name);
      formDataToSubmit.append("description", formData.description);
      formDataToSubmit.append("price", formData.price.toString());
      formDataToSubmit.append("category", formData.category);
      formDataToSubmit.append("stock", formData.stock.toString());
      formDataToSubmit.append("isActive", formData.isActive ? "true" : "false");
      formDataToSubmit.append(
        "newArrival",
        formData.newArrival ? "true" : "false"
      );

      formDataToSubmit.append("image", formData.imageUrl);

      for (let pair of formDataToSubmit.entries()) {
        console.log(pair[0] + ": " + pair[1]);
      }

      await updateProduct(id as string, formDataToSubmit);
      setIsModalOpen(true);
      setTimeout(() => navigate("/admin/products"), 2000);
    } catch (error) {
      console.error("Failed to update product:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update product. Please try again.",
      });
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    navigate("/admin/products");
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
      <h2 className="text-2xl font-bold mb-4">Edit Product</h2>
      <form
        onSubmit={handleFormSubmit}
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
          >
            Update
          </button>
          <button
            type="button"
            className="text-slate-100 bg-red-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-red-700"
            onClick={() => navigate("/admin/products")}
          >
            Cancel
          </button>
        </div>
      </form>

      <Modal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        title="Success"
        message="Product updated successfully!"
      />
    </div>
  );
};

export default EditProduct;
