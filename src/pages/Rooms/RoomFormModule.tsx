import React from "react";

interface ProductFormModuleProps {
  formData: {
    name: string;
    description: string;
    price: number;
    category: string;
    stock: number;
    isActive: boolean;
    newArrival: boolean;
    imageUrl: File | null;
    imagePreview: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCategoryChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handleIsActiveChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleNewArrivalChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  categories: { _id: string; name: string }[];
}

const ProductFormModule: React.FC<ProductFormModuleProps> = ({
  formData,
  handleChange,
  handleCategoryChange,
  handleIsActiveChange,
  handleNewArrivalChange,
  categories = [],
}) => {
  // Ensure categories is always an array
  const safeCategories = Array.isArray(categories) ? categories : [];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-3">
      {/* Name */}
      <div>
        <label htmlFor="name" className="block mb-1 text-gray-800 font-bold">
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="form-input w-full border border-gray-500 rounded px-4 py-2 focus:border-blue-500"
          placeholder="Enter Name"
          required
        />
      </div>

      {/* Description */}
      <div>
        <label
          htmlFor="description"
          className="block mb-1 text-gray-800 font-bold"
        >
          Description
        </label>
        <input
          type="text"
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="form-input w-full border border-gray-500 rounded px-4 py-2 focus:border-blue-500"
          placeholder="Enter Description"
          required
        />
      </div>

      {/* Price */}
      <div>
        <label htmlFor="price" className="block mb-1 text-gray-800 font-bold">
          Price
        </label>
        <input
          type="number"
          id="price"
          name="price"
          value={formData.price}
          onChange={handleChange}
          className="form-input w-full border border-gray-500 rounded px-4 py-2 focus:border-blue-500"
          placeholder="Enter Price"
          required
        />
      </div>

      {/* Category */}
      <div>
        <label
          htmlFor="category"
          className="block mb-1 text-gray-800 font-bold"
        >
          Category
        </label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleCategoryChange}
          className="form-select w-full border border-gray-500 rounded px-4 py-2 focus:border-blue-500"
          required
        >
          <option value="">Select Category</option>
          {/* Safely map over categories with a defensive check */}
          {safeCategories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* Stock */}
      <div>
        <label htmlFor="stock" className="block mb-1 text-gray-800 font-bold">
          Stock
        </label>
        <input
          type="number"
          id="stock"
          name="stock"
          value={formData.stock}
          onChange={handleChange}
          className="form-input w-full border border-gray-500 rounded px-4 py-2 focus:border-blue-500"
          placeholder="Enter Stock Quantity"
          required
        />
      </div>

      <div>
        <label htmlFor="image" className="block mb-1 text-gray-800 font-bold">
          Image
        </label>
        <input
          type="file"
          id="image"
          name="image"
          onChange={handleChange}
          className="form-input w-full border border-gray-500 rounded px-4 py-2 focus:border-blue-500"
          accept="image/*"
        />
        {formData.imagePreview && (
          <img
            src={formData.imagePreview}
            alt="Preview"
            className="mt-2 w-32 h-32 object-cover rounded-lg"
          />
        )}
      </div>

      {/* Is Active */}
      <div className="col-span-full">
        <label className="block mb-1 text-gray-800 font-bold">Active</label>
        <input
          type="checkbox"
          id="isActive"
          name="isActive"
          checked={formData.isActive}
          onChange={handleIsActiveChange}
          className="form-checkbox h-5 w-5 text-blue-500"
        />
        <span className="ml-2">Is Active</span>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="newArrival"
          name="newArrival"
          checked={formData.newArrival}
          onChange={handleNewArrivalChange}
          className="form-checkbox h-5 w-5 text-blue-500"
        />
        <label htmlFor="newArrival" className="ml-2 text-gray-800">
          New Arrival
        </label>
      </div>
    </div>
  );
};

export default ProductFormModule;
