import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import PageHeader from "../components/common/PageHeader";
import CustomerModal from "../components/customers/CustomerModal";
import api from "../services/api";
import { toast } from "react-toastify";
import {
  FiEdit2,
  FiTrash2,
  FiPlus,
  FiSearch,
} from "react-icons/fi";

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [openModal, setOpenModal] = useState(false);

  const [selectedCustomer, setSelectedCustomer] =
    useState(null);

  const fetchCustomers = async () => {
    try {
      setLoading(true);

      const res = await api.get("/customers");

      setCustomers(res.data.customers || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load customers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleAdd = () => {
    setSelectedCustomer(null);
    setOpenModal(true);
  };

  const handleEdit = (customer) => {
    setSelectedCustomer(customer);
    setOpenModal(true);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this customer?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/customers/${id}`);

      toast.success("Customer deleted successfully");

      fetchCustomers();
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Failed to delete customer"
      );
    }
  };

  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      const keyword = search.toLowerCase();

      return (
        customer.name?.toLowerCase().includes(keyword) ||
        customer.email?.toLowerCase().includes(keyword) ||
        customer.phone?.toLowerCase().includes(keyword)
      );
    });
  }, [customers, search]);

  return (
    <DashboardLayout>
      <div className="space-y-6">

        <PageHeader
          title="Customers"
          subtitle="Manage all your customers"
        />

        <div className="bg-white rounded-xl shadow p-5">

          <div className="flex flex-col md:flex-row gap-4 justify-between mb-6">

            <div className="relative w-full md:w-80">

              <FiSearch className="absolute left-3 top-3.5 text-gray-400" />

              <input
                type="text"
                placeholder="Search customer..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                className="w-full border rounded-lg py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-red-500"
              />

            </div>

            <button
              onClick={handleAdd}
              className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg flex items-center gap-2"
            >
              <FiPlus />
              Add Customer
            </button>

          </div>

          {loading ? (
            <div className="text-center py-20 text-gray-500">
              Loading customers...
            </div>
          ) : filteredCustomers.length === 0 ? (
            <div className="text-center py-20">

              <h2 className="text-2xl font-semibold text-gray-600">
                No Customers Found
              </h2>

              <p className="text-gray-500 mt-2">
                Add your first customer.
              </p>

            </div>
          ) : (
            <div className="overflow-x-auto">

              <table className="w-full">

                <thead className="bg-gray-100">

                  <tr>

                    <th className="text-left px-4 py-3">
                      Name
                    </th>

                    <th className="text-left px-4 py-3">
                      Email
                    </th>

                    <th className="text-left px-4 py-3">
                      Phone
                    </th>

                    <th className="text-left px-4 py-3">
                      Address
                    </th>

                    <th className="text-center px-4 py-3">
                      Actions
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {filteredCustomers.map((customer) => (
                    <tr
                      key={customer.id}
                      className="border-b hover:bg-gray-50"
                    >
                      <td className="px-4 py-3 font-medium">
                        {customer.name}
                      </td>

                      <td className="px-4 py-3">
                        {customer.email || "-"}
                      </td>

                      <td className="px-4 py-3">
                        {customer.phone || "-"}
                      </td>

                      <td className="px-4 py-3">
                        {customer.address || "-"}
                      </td>

                      <td className="px-4 py-3">

                        <div className="flex justify-center gap-2">

                          <button
                            onClick={() =>
                              handleEdit(customer)
                            }
                            className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg"
                          >
                            <FiEdit2 />
                          </button>

                          <button
                            onClick={() =>
                              handleDelete(customer.id)
                            }
                            className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg"
                          >
                            <FiTrash2 />
                          </button>

                        </div>

                      </td>

                    </tr>
                  ))}

                </tbody>

              </table>

            </div>
          )}

        </div>

        <CustomerModal
          open={openModal}
          onClose={() => setOpenModal(false)}
          onSuccess={fetchCustomers}
          customer={selectedCustomer}
        />

      </div>
    </DashboardLayout>
  );
}

export default Customers;