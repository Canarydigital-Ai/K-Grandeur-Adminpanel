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
import ConfirmDialog from "../../components/dialogs/ConfirmDialog";
import { deleteBooking, getAllBookings } from "../../api/services/bookingService";

interface Customer {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  createdAt: Date;
  updatedAt: Date;
}

const CustomerListing: React.FC = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [page, setPage] = useState(1);
  const PAGE_SIZES = [10, 20, 30, 50, 100, 500];
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [records, setRecords] = useState<Customer[]>([]);
  const [query, setQuery] = useState("");
  const [debouncedQuery] = useDebouncedValue(query, 200);
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus<Customer>>({
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
        const customerMap = new Map<string, Customer>();
        data.forEach((booking: any) => {
          if (!customerMap.has(booking.email)) {
            customerMap.set(booking.email, {
              _id: booking._id,
              firstName: booking.firstName,
              lastName: booking.lastName,
              email: booking.email,
              phone: booking.phone,
              createdAt: booking.createdAt,
              updatedAt: booking.updatedAt,
            });
          }
        });
  
        setCustomers(Array.from(customerMap.values()));
      } catch (error) {
        toast.error("Failed to fetch bookings");
      } finally {
        setLoading(false);
      }
    };
  
    fetchBookings();
  }, []);
  

  useEffect(() => {
    const filteredData = customers.filter(({ firstName, lastName, email }) =>
      firstName.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
      lastName.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
      email.toLowerCase().includes(debouncedQuery.toLowerCase())
    );

    const sortedData = filteredData.sort((a, b) => {
      const accessor = sortStatus.columnAccessor as keyof Customer;
      return sortStatus.direction === "asc"
        ? a[accessor] > b[accessor]
          ? 1
          : -1
        : a[accessor] < b[accessor]
        ? 1
        : -1;
    });

    setRecords(sortedData.slice((page - 1) * pageSize, page * pageSize));
  }, [customers, debouncedQuery, sortStatus, page, pageSize]);

  const handleViewSecific = (id: string) => navigate(`/admin/view-booking/${id}`);

  const handleDelete = async () => {
    if (!selectedBookingId) return;
  
    try {
      await deleteBooking(selectedBookingId);
      setCustomers((prev) => prev.filter((booking) => booking._id !== selectedBookingId));
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


  const formatDate = (date: Date) => {
    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, '0');
    const month = d.toLocaleString('default', { month: 'short' }).toUpperCase();
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const columns: DataTableColumn<Customer>[] = [
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

      <DataTable<Customer>
        className="whitespace-nowrap mt-4"
        records={records}
        columns={columns.filter((col) => !hiddenColumns.includes(col.accessor as string))}
        highlightOnHover
        totalRecords={customers.length}
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

export default CustomerListing;