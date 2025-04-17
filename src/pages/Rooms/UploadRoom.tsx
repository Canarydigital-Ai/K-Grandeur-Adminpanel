import React, { useState } from "react";
// import { FaFileUpload } from "react-icons/fa";
import { uploadRoom } from "../../api/services/RoomService"; 
import Modal from "../../components/Modal"; 

const UploadRoom: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      setMessage("Please select a file.");
      setIsModalOpen(true);
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setIsUploading(true);

    try {
      const response = await uploadRoom(formData); 
      if (response?.status === 201) {
        setMessage("Products uploaded successfully.");
      } else {
        setMessage("Error uploading products.");
      }
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error uploading file:", error);
      setMessage("Error uploading products.");
      setIsModalOpen(true);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="panel mt-6 p-6">
      <h2 className="text-2xl font-bold mb-4">Upload Products</h2>
      <form onSubmit={handleSubmit} className="w-full bg-white p-4 rounded-lg shadow-md">
        <div>
          <label htmlFor="file" className="block mb-2 text-gray-800 font-semibold">
            Choose CSV/Excel File
          </label>
          <input
            type="file"
            id="file"
            name="file"
            accept=".csv, .xlsx, .xls"
            onChange={handleFileChange}
            className="form-input w-full border border-gray-500 rounded px-4 py-2"
            required
          />
        </div>
        <div className="mt-4 flex justify-center">
          <button
            type="submit"
            className="text-white bg-blue-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700"
            disabled={isUploading}
          >
            {isUploading ? "Uploading..." : "Upload Products"}
          </button>
        </div>
      </form>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Upload Status" message={message} />
    </div>
  );
};

export default UploadRoom;
