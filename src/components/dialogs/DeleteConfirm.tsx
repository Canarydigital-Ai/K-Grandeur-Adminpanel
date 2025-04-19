import React from 'react';
import Swal from 'sweetalert2';

const DeleteConfirm: React.FC = () => {
  const showAlert = async () => {
    const result = await Swal.fire({
      icon: 'warning',
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      showCancelButton: true,
      confirmButtonText: 'Delete',
      padding: '2em',
      customClass: {
        confirmButton: 'bg-red-600 text-white hover:bg-red-700 rounded px-4 py-2',
        cancelButton: 'bg-gray-300 text-gray-700 hover:bg-gray-400 rounded px-4 py-2',
      },
    });

    if (result.isConfirmed) {
      Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
    }
  };

  return (
    <button
      type="button"
      className="btn btn-success bg-green-600 text-white hover:bg-green-700 rounded px-4 py-2"
      onClick={showAlert}
    >
      Confirm
    </button>
  );
};

export default DeleteConfirm;
