import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import PageHeader from "../components/common/PageHeader";
import OrderModal from "../components/orders/OrderModal";
import api from "../services/api";
import { toast } from "react-toastify";
import {
  FiPlus,
  FiSearch,
  FiTrash2,
} from "react-icons/fi";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [openModal, setOpenModal] =
    useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const res = await api.get("/orders");

      setOrders(res.data.orders || []);
    } catch (error) {
      console.error(error);

      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    const keyword = search.toLowerCase();

    return orders.filter((order) => {
      return (
        order.customer_name
          ?.toLowerCase()
          .includes(keyword) ||
        order.product_name
          ?.toLowerCase()
          .includes(keyword)
      );
    });
  }, [orders, search]);

  const deleteOrder = async (id) => {
    if (
      !window.confirm(
        "Delete this order?"
      )
    )
      return;

    try {
      await api.delete(`/orders/${id}`);

      toast.success(
        "Order deleted successfully"
      );

      fetchOrders();
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Delete failed"
      );
    }
  };

  return (
    <DashboardLayout>

      <div className="space-y-6">

        <PageHeader
          title="Orders"
          subtitle="Manage warehouse orders"
        />

        <div className="bg-white rounded-xl shadow p-5">

          <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">

            <div className="relative w-full md:w-80">

              <FiSearch className="absolute left-3 top-3.5 text-gray-400" />

              <input
                type="text"
                placeholder="Search orders..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                className="w-full border rounded-lg py-2.5 pl-10 pr-4 focus:ring-2 focus:ring-red-500 outline-none"
              />

            </div>

            <button
              onClick={() =>
                setOpenModal(true)
              }
              className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg flex items-center gap-2"
            >
              <FiPlus />

              New Order

            </button>

          </div>

          {loading ? (

            <div className="text-center py-20">
              Loading Orders...
            </div>

          ) : filteredOrders.length === 0 ? (

            <div className="text-center py-20">

              <h2 className="text-2xl font-bold text-gray-600">
                No Orders Found
              </h2>

              <p className="text-gray-500 mt-2">
                Create your first order.
              </p>

            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead className="bg-gray-100">

                  <tr>

                    <th className="text-left px-4 py-3">
                      Customer
                    </th>

                    <th className="text-left px-4 py-3">
                      Product
                    </th>

                    <th className="text-center px-4 py-3">
                      Qty
                    </th>

                    <th className="text-center px-4 py-3">
                      Total
                    </th>

                    <th className="text-center px-4 py-3">
                      Date
                    </th>

                    <th className="text-center px-4 py-3">
                      Action
                    </th>

                  </tr>

                </thead>

                <tbody>
                                  {filteredOrders.map((order) => (

                    <tr
                      key={order.id}
                      className="border-b hover:bg-gray-50"
                    >

                      <td className="px-4 py-3 font-medium">
                        {order.customer_name}
                      </td>

                      <td className="px-4 py-3">
                        {order.product_name}
                      </td>

                      <td className="px-4 py-3 text-center">
                        {order.quantity}
                      </td>

                      <td className="px-4 py-3 text-center font-semibold text-green-600">
                        ₹{Number(order.total_price).toFixed(2)}
                      </td>

                      <td className="px-4 py-3 text-center">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>

                      <td className="px-4 py-3">

                        <div className="flex justify-center">

                          <button
                            onClick={() => deleteOrder(order.id)}
                            className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition"
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

        <OrderModal
          open={openModal}
          onClose={() => setOpenModal(false)}
          onSuccess={fetchOrders}
        />

      </div>

    </DashboardLayout>
  );
}

export default Orders;