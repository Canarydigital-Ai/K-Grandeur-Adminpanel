import React from "react";

interface RoomFormModuleProps {
  formData: {
    name: string;
    description: string;
    price: number;
    roomcount: number;
    occupancy: number;
    imageUrl: File | null;
    imagePreview: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const RoomFormModule: React.FC<RoomFormModuleProps> = ({ formData, handleChange }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-3">
      {/* Name */}
      <div>
        <label htmlFor="name" className="block mb-1 font-medium text-gray-700">
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="form-input w-full border border-gray-300 rounded px-4 py-2"
          placeholder="Enter room name"
          required
        />
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block mb-1 font-medium text-gray-700">
          Description
        </label>
        <input
          type="text"
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="form-input w-full border border-gray-300 rounded px-4 py-2"
          placeholder="Enter description"
          required
        />
      </div>

      {/* Price */}
      <div>
        <label htmlFor="price" className="block mb-1 font-medium text-gray-700">
          Price
        </label>
        <input
          type="number"
          id="price"
          name="price"
          value={formData.price}
          onChange={handleChange}
          className="form-input w-full border border-gray-300 rounded px-4 py-2"
          placeholder="Enter price"
          required
        />
      </div>


       {/* RoomCount */}
       <div>
        <label htmlFor="roomcount" className="block mb-1 font-medium text-gray-700">
        RoomCount
        </label>
        <input
          type="number"
          id="roomcount"
          name="roomcount"
          value={formData.roomcount}
          onChange={handleChange}
          className="form-input w-full border border-gray-300 rounded px-4 py-2"
          placeholder="Enter roomcount"
          required
        />
      </div>

      {/* Occupancy */}
      <div>
        <label htmlFor="occupancy" className="block mb-1 font-medium text-gray-700">
          Occupancy
        </label>
        <input
          type="number"
          id="occupancy"
          name="occupancy"
          value={formData.occupancy}
          onChange={handleChange}
          className="form-input w-full border border-gray-300 rounded px-4 py-2"
          placeholder="Enter occupancy"
          required
        />
      </div>

      {/* Image Upload */}
      <div>
        <label htmlFor="image" className="block mb-1 font-medium text-gray-700">
          Image
        </label>
        <input
          type="file"
          id="image"
          name="image"
          accept="image/*"
          onChange={handleChange}
          className="form-input w-full border border-gray-300 rounded px-4 py-2"
        />
        {formData.imagePreview && (
          <img
            src={formData.imagePreview}
            alt="Preview"
            className="mt-2 w-32 h-32 object-cover rounded"
          />
        )}
      </div>
    </div>
  );
};

export default RoomFormModule;
