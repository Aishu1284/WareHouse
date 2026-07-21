import DashboardLayout from "../components/layout/DashboardLayout";
import Card from "../components/common/Card";

function Dashboard() {
  return (
    <DashboardLayout>
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <Card title="Products" value="0" />
        <Card title="Customers" value="0" />
        <Card title="Orders" value="0" />
        <Card title="Inventory" value="0" />
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            Recent Orders
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Latest customer orders will appear here.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td
                  colSpan={5}
                  className="text-center py-12 text-gray-400"
                >
                  No orders available.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Dashboard;