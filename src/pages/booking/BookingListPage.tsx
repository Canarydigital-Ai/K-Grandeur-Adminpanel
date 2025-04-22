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
import {  FiEye } from "react-icons/fi";
import Dropdown from "../../layout/Dropdown";
import "@mantine/core/styles.css";
import "mantine-datatable/styles.css";
import "react-toastify/dist/ReactToastify.css";
import { IoIosArrowDown } from "react-icons/io";
import { FaPlus } from "react-icons/fa";
import ConfirmDialog from "../../components/dialogs/ConfirmDialog";
import { deleteBooking, getAllBookings } from "../../api/services/bookingService";

interface Booking {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  checkInDate: Date;
  checkOutDate: Date;
  nightsCount: number;
  roomId: string;
  roomName: string;
  basePrice: number;
  subTotal: number;
  tax: number;
  totalAmount: number;
  paymentStatus: boolean;
  paymentMethod: string;
  createdAt: Date;
  updatedAt: Date;
}

const BookingListPage: React.FC = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [page, setPage] = useState(1);
  const PAGE_SIZES = [10, 20, 30, 50, 100, 500];
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [records, setRecords] = useState<Booking[]>([]);
  const [query, setQuery] = useState("");
  const [debouncedQuery] = useDebouncedValue(query, 200);
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus<Booking>>({
    columnAccessor: "checkInDate",
    direction: "desc",
  });
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [hiddenColumns, setHiddenColumns] = useState<string[]>(["createdAt", "updatedAt", "tax",  "subTotal"]);
  const [selectedRecords, setSelectedRecords] = useState<string[]>([]);

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      try {
        const data = await getAllBookings();
        setBookings(data);
      } catch (error) {
        toast.error("Failed to fetch bookings");
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  useEffect(() => {
    const filteredData = bookings.filter(({ firstName, lastName, email, roomName }) =>
      firstName.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
      lastName.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
      email.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
      roomName.toLowerCase().includes(debouncedQuery.toLowerCase())
    );

    const sortedData = filteredData.sort((a, b) => {
      const accessor = sortStatus.columnAccessor as keyof Booking;
      return sortStatus.direction === "asc"
        ? a[accessor] > b[accessor]
          ? 1
          : -1
        : a[accessor] < b[accessor]
        ? 1
        : -1;
    });

    setRecords(sortedData.slice((page - 1) * pageSize, page * pageSize));
  }, [bookings, debouncedQuery, sortStatus, page, pageSize]);

  const handleViewSecific = (id: string) => navigate(`/admin/view-booking/${id}`);

  const handleDelete = async () => {
    if (!selectedBookingId) return;
  
    try {
      await deleteBooking(selectedBookingId);
      setBookings((prev) => prev.filter((booking) => booking._id !== selectedBookingId));
      toast.success("Booking deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete booking.");
      console.error("Delete error:", error);
    } finally {
      setIsDialogOpen(false);
      setSelectedBookingId(null);
    }
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

  const handleCreate = () => navigate("/admin/create-booking");

  const formatDate = (date: Date) => {
    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, '0');
    const month = d.toLocaleString('default', { month: 'short' }).toUpperCase();
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const columns: DataTableColumn<Booking>[] = [
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
          <ActionIcon onClick={() => handleViewSecific(_id)} title="ViewSpecific" className="text-blue-500" variant="transparent">
            <FiEye />
          </ActionIcon>
        </div>
      ),
    },
    { 
      accessor: "fullName", 
      title: "Guest Name",
      render: ({ firstName, lastName }) => `${firstName} ${lastName}`
    },
    { accessor: "email", title: "Email" },
    { accessor: "phone", title: "Phone" },
    { 
      accessor: "checkInDate", 
      title: "Check-in Date",
      render: ({ checkInDate }) => formatDate(checkInDate)
    },
    { 
      accessor: "checkOutDate", 
      title: "Check-out Date",
      render: ({ checkOutDate }) => formatDate(checkOutDate)
    },
    { accessor: "nightsCount", title: "Nights" },
    { accessor: "roomName", title: "Room" },
    { 
      accessor: "basePrice", 
      title: "Base Price",
      render: ({ basePrice }) => formatCurrency(basePrice)
    },
    { 
      accessor: "subTotal", 
      title: "Subtotal",
      render: ({ subTotal }) => formatCurrency(subTotal)
    },
    { 
      accessor: "tax", 
      title: "Tax",
      render: ({ tax }) => formatCurrency(tax)
    },
    { 
      accessor: "totalAmount", 
      title: "Total Amount",
      render: ({ totalAmount }) => formatCurrency(totalAmount)
    },
    {
      accessor: "paymentStatus",
      title: "Payment Status",
      render: ({ paymentStatus }) => (
        <span className={`px-2 py-1 rounded-full text-xs ${paymentStatus ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
          {paymentStatus ? "Paid" : "Unpaid"}
        </span>
      )
    },
    { accessor: "paymentMethod", title: "Payment Method" },
    {
      accessor: "createdAt",
      title: "Created At",
      render: ({ createdAt }) => formatDate(createdAt),
    },
    {
      accessor: "updatedAt",
      title: "Updated At",
      render: ({ updatedAt }) => formatDate(updatedAt),
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
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Bookings</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <button
          className="bg-blue-600 text-white h-11 rounded-md hover:bg-blue-700 transition flex items-center justify-center w-full"
          onClick={handleCreate}
        >
          <FaPlus className="mr-2" /> Create Booking
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
            placeholder="Search by name, email or room..."
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

      <DataTable<Booking>
        className="whitespace-nowrap mt-4"
        records={records}
        columns={columns.filter((col) => !hiddenColumns.includes(col.accessor as string))}
        highlightOnHover
        totalRecords={bookings.length}
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
        title="Delete Booking"
        message="Are you sure you want to delete this booking? This action cannot be undone."
      />
    </div>
  );
};

export default BookingListPage;