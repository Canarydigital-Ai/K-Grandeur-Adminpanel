import React, { useEffect, useState } from "react";
import { ActionIcon, TextInput } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { IconSearch, IconX } from "@tabler/icons-react";
import { ToastContainer, toast } from "react-toastify";
import ConfirmDialog from "../../dialogs/ConfirmDialog";
import { useNavigate } from "react-router-dom";
import {
  DataTable,
  DataTableColumn,
  DataTableSortStatus,
} from "mantine-datatable";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FiEdit } from "react-icons/fi";
import Dropdown from "../../../Layouts/Dropdown";
import "@mantine/core/styles.css";
import "mantine-datatable/styles.css";
import "react-toastify/dist/ReactToastify.css";
import { IoIosArrowDown } from "react-icons/io";
import Swal from "sweetalert2";
import { downloadExcel } from "../../../utils/Excel";
import { FaPlus } from "react-icons/fa";
import {
  getProducts,
  deleteProduct,
  updateStatus,
  updateNewArrival,
} from "../../../api/services/admin/ProductService";

interface Products {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  isActive: boolean;
  newArrival: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProductList: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Products[]>([]);
  const [page, setPage] = useState(1);
  const PAGE_SIZES = [10, 20, 30, 50, 100, 500];
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [records, setRecords] = useState<Products[]>([]);
  const [query, setQuery] = useState("");
  const [debouncedQuery] = useDebouncedValue(query, 200);
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus<Products>>({
    columnAccessor: "name",
    direction: "asc",
  });
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [hiddenColumns, setHiddenColumns] = useState<string[]>([
    "stock",
    "createdAt",
    "updatedAt",
  ]);
  const [selectedRecords, setSelectedRecords] = useState<string[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const products = await getProducts();
        setProducts(products);
      } catch (error) {
        toast.error("Failed to fetch Products");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const filteredData = products.filter(({ name }) =>
      name.toLowerCase().includes(debouncedQuery.toLowerCase())
    );

    const sortedData = filteredData.sort((a, b) => {
      const accessor = sortStatus.columnAccessor as keyof Products;
      return sortStatus.direction === "asc"
        ? a[accessor] > b[accessor]
          ? 1
          : -1
        : a[accessor] < b[accessor]
        ? 1
        : -1;
    });

    setRecords(sortedData.slice((page - 1) * pageSize, page * pageSize));
  }, [products, debouncedQuery, sortStatus, page, pageSize]);

  const handleEdit = (id: string) => {
    navigate(`/admin/edit-Product/${id}`);
  };

  const handleDelete = async () => {
    if (!selectedProductId) return;
  
    try {
      await deleteProduct(selectedProductId); // Service call with body payload
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product._id !== selectedProductId)
      );
      toast.success("Product deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete Product. Please try again.");
    } finally {
      setIsDialogOpen(false);
      setSelectedProductId(null);
    }
  };
  

  const handleToggleStatus = async (productId: string, newStatus: boolean) => {
    try {
      await updateStatus(productId, newStatus);
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product._id === productId
            ? { ...product, isActive: newStatus }
            : product
        )
      );
      toast.success(`Product is now ${newStatus ? "Active" : "Inactive"}`);
    } catch (error) {
      toast.error("Failed to update product status");
    }
  };

  // New function to handle new arrival toggle
  const handleToggleNewArrival = async (
    productId: string,
    newArrivalStatus: boolean
  ) => {
    try {
      await updateNewArrival(productId, newArrivalStatus);
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product._id === productId
            ? { ...product, newArrival: newArrivalStatus }
            : product
        )
      );
      toast.success(
        `Product ${newArrivalStatus ? "added to" : "removed from"} New Arrivals`
      );
    } catch (error) {
      toast.error("Failed to update new arrival status");
    }
  };

  const toggleColumnVisibility = (columnAccessor: string) => {
    setHiddenColumns((prevHiddenColumns) => {
      if (prevHiddenColumns.includes(columnAccessor)) {
        return prevHiddenColumns.filter((col) => col !== columnAccessor);
      } else {
        return [...prevHiddenColumns, columnAccessor];
      }
    });
  };

  // const handleSelectChange = async (selectedOption: string) => {
  //   if (selectedOption === "delete" && selectedRecords.length > 0) {
  //     const confirmation = await Swal.fire({
  //       icon: "warning",
  //       title: "Are you sure?",
  //       text: "You won't be able to revert these changes!",
  //       showCancelButton: true,
  //       confirmButtonText: "Delete",
  //       cancelButtonText: "Cancel",
  //       padding: "2em",
  //     });
  //     if (confirmation.isConfirmed) {
  //       for (const recordId of selectedRecords) {
  //         try {
  //           // await ProductService.delete(recordId);
  //           setProducts((prev) =>
  //             prev.filter((product) => product._id !== recordId)
  //           );
  //           toast.success("Records deleted successfully!");
  //         } catch {
  //           toast.error("Failed to delete some records. Please try again.");
  //         }
  //       }
  //     }
  //   } else if (selectedOption === "edit" && selectedRecords.length === 1) {
  //     navigate(`/admin/edit-Product/${selectedRecords[0]}`);
  //   } else if (selectedOption === "exportExcel" && selectedRecords.length > 0) {
  //     const categoriesToExport = products.filter((product) =>
  //       selectedRecords.includes(product._id)
  //     );

  //     const formattedData = categoriesToExport.map(
  //       ({ _id, name, description, isActive, newArrival }) => ({
  //         _id,
  //         ProductName: name,
  //         isActive: isActive ? "Active" : "Inactive",
  //         newArrival: newArrival ? "Yes" : "No",
  //         Description: description,
  //       })
  //     );

  //     downloadExcel(formattedData, "Products");
  //   }
  // };


  const handleSelectChange = async (selectedOption: string) => {
    if (selectedOption === "delete" && selectedRecords.length > 0) {
      const confirmation = await Swal.fire({
        icon: "warning",
        title: "Are you sure?",
        text: "You won't be able to revert these changes!",
        showCancelButton: true,
        confirmButtonText: "Delete",
        cancelButtonText: "Cancel",
        padding: "2em",
      });
      if (confirmation.isConfirmed) {
        for (const recordId of selectedRecords) {
          try {
            await deleteProduct(recordId); 
            setProducts((prev) => prev.filter((product) => product._id !== recordId)); 
            toast.success("Records deleted successfully!");
          } catch {
            toast.error("Failed to delete some records. Please try again.");
          }
        }
      }
    } else if (selectedOption === "edit" && selectedRecords.length === 1) {
      navigate(`/admin/edit-Product/${selectedRecords[0]}`);
    } else if (selectedOption === "exportExcel" && selectedRecords.length > 0) {
      const categoriesToExport = products.filter((product) =>
        selectedRecords.includes(product._id)
      );
  
      const formattedData = categoriesToExport.map(
        ({ _id, name, description, isActive, newArrival }) => ({
          _id,
          ProductName: name,
          isActive: isActive ? "Active" : "Inactive",
          newArrival: newArrival ? "Yes" : "No",
          Description: description,
        })
      );
  
      downloadExcel(formattedData, "Products");
    }
  };
  
  const openDialog = (id: string) => {
    console.log("Open Dialog for Product ID:", id); 
    setSelectedProductId(id);
    setIsDialogOpen(true);
  };


  const handleSelectRecord = (id: string) => {
    setSelectedRecords((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((recordId) => recordId !== id)
        : [...prevSelected, id]
    );
  };

  const handleSelectAllRecords = () => {
    if (selectedRecords.length === records.length) {
      setSelectedRecords([]);
    } else {
      setSelectedRecords(records.map((record) => record._id));
    }
  };

  const handleCreate = () => {
    navigate("/admin/Create-Product");
  };

  const handleUplaodCreate = () => {
    navigate("/admin/Create-Upload");
  };

  const columns: DataTableColumn<Products>[] = [
    {
      accessor: "select",
      title: (
        <input
          type="checkbox"
          checked={
            selectedRecords.length === records.length && records.length > 0
          }
          onChange={handleSelectAllRecords}
          className="w-5 h-5"
        />
      ),
      render: ({ _id }) => (
        <input
          type="checkbox"
          checked={selectedRecords.includes(_id)}
          onChange={() => handleSelectRecord(_id)}
          className="w-5 h-5"
        />
      ),
    },
    {
      accessor: "actions",
      title: "Actions",
      render: ({ _id }) => (
        <div className="flex items-center space-x-1">
          <ActionIcon
            onClick={() => handleEdit(_id)}
            title="Edit"
            className="text-blue-500"
            variant="transparent"
          >
            <FiEdit />
          </ActionIcon>
          <ActionIcon
            onClick={() => openDialog(_id)}
            title="Delete"
            className="text-red-500"
            variant="transparent"
          >
            <RiDeleteBin6Line />
          </ActionIcon>
        </div>
      ),
    },
    { accessor: "name", title: "Name" },
    { accessor: "description", title: "Description" },
    { accessor: "price", title: "Price" },
    { accessor: "stock", title: "Stock" },
    {
      accessor: "imageUrl",
      title: "Image",
      render: ({ imageUrl }) =>
        imageUrl ? (
          <img
            src={imageUrl}
            alt="Product"
            className="w-10 h-10 object-cover rounded"
          />
        ) : (
          <div className="w-10 h-10 bg-gray-200 flex items-center justify-center text-xs">
            No image
          </div>
        ),
    },
    {
      accessor: "newArrival",
      title: "New Arrival",
      render: ({ _id, newArrival }) => (
        <button
          className={`${
            newArrival ? "bg-purple-500" : "bg-gray-400"
          } text-white py-1 px-3 rounded-md`}
          onClick={() => handleToggleNewArrival(_id, !newArrival)}
        >
          {newArrival ? "New Arrival" : "Standard"}
        </button>
      ),
    },
    {
      accessor: "isActive",
      title: "Status",
      render: ({ _id, isActive }) => (
        <button
          className={`${
            isActive ? "bg-green-500" : "bg-red-500"
          } text-white py-1 px-3 rounded-md`}
          onClick={() => handleToggleStatus(_id, !isActive)}
        >
          {isActive ? "Active" : "Inactive"}
        </button>
      ),
    },
    {
      accessor: "createdAt",
      title: "Created At",
      render: ({ createdAt }) => {
        const date = new Date(createdAt);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const day = date.getDate().toString().padStart(2, "0");
        return `${year}-${month}-${day}`;
      },
    },
    {
      accessor: "updatedAt",
      title: "Updated At",
      render: ({ updatedAt }) => {
        const date = new Date(updatedAt);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const day = date.getDate().toString().padStart(2, "0");
        return `${year}-${month}-${day}`;
      },
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-b-4"></div>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen">
      <ToastContainer />
      <h2 className="text-2xl font-bold mb-4">Products List</h2>

      <div className="flex flex-wrap justify-between gap-4">
        <button
          className="flex-1 h-11 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition flex items-center justify-center"
          onClick={handleCreate}
        >
          <FaPlus className="mr-2" /> Create Products
        </button>
        <button
          className="flex-1 h-11 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition flex items-center justify-center"
         onClick={handleUplaodCreate} 
        >
          <FaPlus className="mr-2" /> Create  Upload Products
        </button>

        <div className="flex-1">
          <Dropdown
            btnClassName="w-full flex items-center border border-gray-300 rounded-md px-4 py-2 text-sm bg-white shadow-sm hover:bg-gray-100"
            button={
              <>
                <span className="mr-1">Columns</span>
                <IoIosArrowDown />
              </>
            }
          >
            <div className="absolute z-10 bg-white bg-opacity-80 rounded-md shadow-md p-4">
              <ul className="min-w-[300px] max-h-60 overflow-y-auto">
                {columns
                  .filter((col) => col.accessor !== "select")
                  .map((col, index) => (
                    <li key={index} className="flex flex-col">
                      <div className="flex items-center px-4 py-1">
                        <label className="cursor-pointer mb-0">
                          <input
                            type="checkbox"
                            checked={
                              !hiddenColumns.includes(col.accessor as string)
                            }
                            className="mr-2"
                            onChange={() =>
                              toggleColumnVisibility(col.accessor as string)
                            }
                          />
                          {col.title}
                        </label>
                      </div>
                    </li>
                  ))}
              </ul>
            </div>
          </Dropdown>
        </div>
        <TextInput
          placeholder="Search by full name..."
          value={query}
          onChange={(e) => setQuery(e.currentTarget.value)}
          leftSection={<IconSearch size={16} />}
          rightSection={
            <ActionIcon
              size="sm"
              variant="transparent"
              onClick={() => setQuery("")}
            >
              <IconX size={14} />
            </ActionIcon>
          }
          className="flex-1"
        />
        <div className="flex-1">
          <select
            id="ctnSelect1"
            className="form-select border border-gray-300 rounded-md px-4 py-2 text-sm bg-white shadow-sm hover:bg-gray-100 w-full"
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              handleSelectChange(e.target.value)
            }
          >
            <option value="">Action Dropdown</option>
            <option value="edit">Edit</option>
            <option value="exportExcel">Export Excel</option>
            <option value="delete">Delete</option>
          </select>
        </div>
      </div>
      <DataTable<Products>
        className="whitespace-nowrap mt-4"
        records={records}
        columns={columns.filter(
          (col) => !hiddenColumns.includes(col.accessor as string)
        )}
        highlightOnHover
        totalRecords={products.length}
        recordsPerPage={pageSize}
        page={page}
        onPageChange={setPage}
        recordsPerPageOptions={PAGE_SIZES}
        onRecordsPerPageChange={setPageSize}
        sortStatus={sortStatus}
        onSortStatusChange={setSortStatus}
        minHeight={200}
        paginationText={({ from, to, totalRecords }) =>
          `Showing ${from} to ${to} of ${totalRecords} entries`
        }
      />
      <ConfirmDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onConfirm={handleDelete}
        title="Delete Product"
        message="Are you sure you want to delete this Product? This action cannot be undone."
      />
    </div>
  );
};

export default ProductList;
