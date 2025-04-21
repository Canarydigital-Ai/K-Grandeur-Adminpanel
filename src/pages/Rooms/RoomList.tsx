import React, { useEffect, useState } from "react";
import { ActionIcon, TextInput } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { IconSearch, IconX } from "@tabler/icons-react";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  DataTable,
  DataTableColumn,
  DataTableSortStatus,
} from "mantine-datatable";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FiEdit } from "react-icons/fi";
import Dropdown from "../../layout/Dropdown";
import "@mantine/core/styles.css";
import "mantine-datatable/styles.css";
import "react-toastify/dist/ReactToastify.css";
import { IoIosArrowDown } from "react-icons/io";
import { FaPlus } from "react-icons/fa";
import ConfirmDialog from "../../components/dialogs/ConfirmDialog";
import { deleteRoom, getRoom } from "../../api/services/RoomService";

interface RoomCategory {
  _id: string;
  name: string;
  description: string;
  price: number;
  occupancy: number;
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

const RoomList: React.FC = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<RoomCategory[]>([]);
  const [page, setPage] = useState(1);
  const PAGE_SIZES = [10, 20, 30, 50, 100, 500];
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [records, setRecords] = useState<RoomCategory[]>([]);
  const [query, setQuery] = useState("");
  const [debouncedQuery] = useDebouncedValue(query, 200);
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus<RoomCategory>>({
    columnAccessor: "name",
    direction: "asc",
  });
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [hiddenColumns, setHiddenColumns] = useState<string[]>(["createdAt", "updatedAt"]);
  const [selectedRecords, setSelectedRecords] = useState<string[]>([]);

  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);
      try {
        const data = await getRoom();
        setRooms(data);
      } catch (error) {
        toast.error("Failed to fetch room categories");
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  useEffect(() => {
    const filteredData = rooms.filter(({ name }) =>
      name.toLowerCase().includes(debouncedQuery.toLowerCase())
    );

    const sortedData = filteredData.sort((a, b) => {
      const accessor = sortStatus.columnAccessor as keyof RoomCategory;
      return sortStatus.direction === "asc"
        ? a[accessor] > b[accessor]
          ? 1
          : -1
        : a[accessor] < b[accessor]
        ? 1
        : -1;
    });

    setRecords(sortedData.slice((page - 1) * pageSize, page * pageSize));
  }, [rooms, debouncedQuery, sortStatus, page, pageSize]);

  const handleEdit = (id: string) => navigate(`/admin/edit-room/${id}`);

  const handleDelete = async () => {
    if (!selectedRoomId) return;
  
    try {
      await deleteRoom(selectedRoomId); // 🔥 call the backend delete API
      setRooms((prev) => prev.filter((room) => room._id !== selectedRoomId));
      toast.success("Room deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete room.");
      console.error("Delete error:", error);
    } finally {
      setIsDialogOpen(false);
      setSelectedRoomId(null);
    }
  };
  

  const openDialog = (id: string) => {
    setSelectedRoomId(id);
    setIsDialogOpen(true);
  };

  const handleSelectRecord = (id: string) => {
    setSelectedRecords((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  const handleSelectAllRecords = () => {
    setSelectedRecords(
      selectedRecords.length === records.length ? [] : records.map((r) => r._id)
    );
  };

  const handleCreate = () => navigate("/admin/create-room");

  const columns: DataTableColumn<RoomCategory>[] = [
    {
      accessor: "select",
      title: (
        <input
          type="checkbox"
          checked={selectedRecords.length === records.length && records.length > 0}
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
          <ActionIcon onClick={() => handleEdit(_id)} title="Edit" className="text-blue-500" variant="transparent">
            <FiEdit />
          </ActionIcon>
          <ActionIcon onClick={() => openDialog(_id)} title="Delete" className="text-red-500" variant="transparent">
            <RiDeleteBin6Line />
          </ActionIcon>
        </div>
      ),
    },
    { accessor: "name", title: "Name" },
    { accessor: "description", title: "Description" },
    { accessor: "price", title: "Price" },
    { accessor: "occupancy", title: "Occupancy" },
    {
      accessor: "imageUrl",
      title: "Image",
      render: ({ imageUrl }) =>
        imageUrl ? (
          <img src={imageUrl} alt="Room" className="w-10 h-10 object-cover rounded" />
        ) : (
          <div className="w-10 h-10 bg-gray-200 flex items-center justify-center text-xs">No image</div>
        ),
    },
    {
      accessor: "createdAt",
      title: "Created At",
      render: ({ createdAt }) => new Date(createdAt).toLocaleDateString(),
    },
    {
      accessor: "updatedAt",
      title: "Updated At",
      render: ({ updatedAt }) => new Date(updatedAt).toLocaleDateString(),
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
    <div className="p-4 sm:p-6 min-h-screen bg-gray-50">
      <ToastContainer />
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Room Categories</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <button
          className="bg-blue-600 text-white h-11 rounded-md hover:bg-blue-700 transition flex items-center justify-center w-full"
          onClick={handleCreate}
        >
          <FaPlus className="mr-2" /> Create Room
        </button>

        <div>
          <Dropdown
            btnClassName="w-full flex items-center border border-gray-300 rounded-md px-4 py-2 text-sm bg-white shadow-sm hover:bg-gray-100"
            button={<><span className="mr-1">Columns</span><IoIosArrowDown /></>}
          >
            <div className="absolute z-10 bg-white bg-opacity-90 rounded-md shadow-md p-4">
              <ul className="min-w-[250px] max-h-60 overflow-y-auto">
                {columns.filter((col) => col.accessor !== "select").map((col, index) => (
                  <li key={index} className="flex items-center px-4 py-1">
                    <label className="cursor-pointer">
                      <input
                        type="checkbox"
                        checked={!hiddenColumns.includes(col.accessor as string)}
                        className="mr-2"
                        onChange={() =>
                          setHiddenColumns((prev) =>
                            prev.includes(col.accessor as string)
                              ? prev.filter((c) => c !== col.accessor)
                              : [...prev, col.accessor as string]
                          )
                        }
                      />
                      {col.title}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          </Dropdown>
        </div>

        <div className="md:col-span-2">
          <TextInput
            placeholder="Search by name..."
            value={query}
            onChange={(e) => setQuery(e.currentTarget.value)}
            leftSection={<IconSearch size={16} />}
            rightSection={
              <ActionIcon size="sm" variant="transparent" onClick={() => setQuery("")}> <IconX size={14} /> </ActionIcon>
            }
            className="w-full"
          />
        </div>
      </div>

      <DataTable<RoomCategory>
        className="whitespace-nowrap mt-4"
        records={records}
        columns={columns.filter((col) => !hiddenColumns.includes(col.accessor as string))}
        highlightOnHover
        totalRecords={rooms.length}
        recordsPerPage={pageSize}
        page={page}
        onPageChange={setPage}
        recordsPerPageOptions={PAGE_SIZES}
        onRecordsPerPageChange={setPageSize}
        sortStatus={sortStatus}
        onSortStatusChange={setSortStatus}
        minHeight={200}
        paginationText={({ from, to, totalRecords }) => `Showing ${from} to ${to} of ${totalRecords} entries`}
      />

      <ConfirmDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onConfirm={handleDelete}
        title="Delete Room"
        message="Are you sure you want to delete this room? This action cannot be undone."
      />
    </div>
  );
};

export default RoomList;