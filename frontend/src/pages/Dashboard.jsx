import { useEffect, useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import Card from "../components/common/Card";
import api from "../services/api";
import { toast } from "react-toastify";

function Dashboard() {
  const [stats, setStats] = useState({
    products: 0,
    customers: 0,
    orders: 0,
    inventory: 0,
    revenue: 0,
  });

  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      setLoading(true);

      const res = await api.get("/dashboard");

      setStats(res.data.stats);

      setRecentOrders(res.data.recentOrders || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  return (
    <DashboardLayout>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-6 mb-8">

        <Card
          title="Products"
          value={stats.products}
        />

        <Card
          title="Customers"
          value={stats.customers}
        />

        <Card
          title="Orders"
          value={stats.orders}
        />

        <Card
          title="Inventory"
          value={stats.inventory}
        />

        <Card
          title="Revenue"
          value={`₹${stats.revenue}`}
        />

      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">

        <div className="px-6 py-4 border-b border-gray-200">

          <h2 className="text-xl font-semibold text-gray-800">
            Recent Orders
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Latest customer orders.
          </p>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-gray-50">

              <tr>

                <th className="px-6 py-3 text-left">
                  Order ID
                </th>

                <th className="px-6 py-3 text-left">
                  Customer
                </th>

                <th className="px-6 py-3 text-left">
                  Product
                </th>

                <th className="px-6 py-3 text-left">
                  Quantity
                </th>

                <th className="px-6 py-3 text-left">
                  Total
                </th>

                <th className="px-6 py-3 text-left">
                  Date
                </th>

              </tr>

            </thead>

            <tbody>

              {loading ? (

                <tr>

                  <td
                    colSpan={6}
                    className="text-center py-10"
                  >
                    Loading...
                  </td>

                </tr>

              ) : recentOrders.length === 0 ? (

                <tr>

                  <td
                    colSpan={6}
                    className="text-center py-10 text-gray-400"
                  >
                    No orders available.
                  </td>

                </tr>

              ) : (

                recentOrders.map((order) => (

                  <tr
                    key={order.id}
                    className="border-b hover:bg-gray-50"
                  >

                    <td className="px-6 py-4">
                      #{order.id}
                    </td>

                    <td className="px-6 py-4">
                      {order.customer_name}
                    </td>

                    <td className="px-6 py-4">
                      {order.product_name}
                    </td>

                    <td className="px-6 py-4">
                      {order.quantity}
                    </td>

                    <td className="px-6 py-4 font-semibold text-green-600">
                      ₹{order.total_price}
                    </td>

                    <td className="px-6 py-4">
                      {new Date(
                        order.created_at
                      ).toLocaleDateString()}
                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      </div>

    </DashboardLayout>
  );
}

export default Dashboard;