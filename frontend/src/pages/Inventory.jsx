import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import PageHeader from "../components/common/PageHeader";
import StockModal from "../components/inventory/StockModal";
import api from "../services/api";
import { toast } from "react-toastify";
import {
  FiPlus,
  FiSearch,
  FiPackage,
} from "react-icons/fi";

function Inventory() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [openModal, setOpenModal] =
    useState(false);

  const fetchInventory = async () => {
    try {
      setLoading(true);

      const res = await api.get("/products");

      setProducts(res.data.products || []);

    } catch (error) {

      console.error(error);

      toast.error(
        "Failed to load inventory"
      );

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const filteredProducts = useMemo(() => {

    const keyword = search.toLowerCase();

    return products.filter((product) =>

      product.name
        ?.toLowerCase()
        .includes(keyword) ||

      product.category
        ?.toLowerCase()
        .includes(keyword) ||

      product.sku
        ?.toLowerCase()
        .includes(keyword)

    );

  }, [products, search]);

  const totalProducts = products.length;

  const totalStock = products.reduce(
    (sum, product) =>
      sum + Number(product.quantity),
    0
  );

  const lowStock = products.filter(
    (product) =>
      Number(product.quantity) <= 5
  ).length;

  return (

    <DashboardLayout>

      <div className="space-y-6">

        <PageHeader
          title="Inventory"
          subtitle="Manage warehouse inventory"
        />

        <div className="grid md:grid-cols-3 gap-5">

          <div className="bg-white rounded-xl shadow p-5">

            <div className="flex justify-between items-center">

              <div>

                <p className="text-gray-500">
                  Products
                </p>

                <h2 className="text-3xl font-bold mt-2">
                  {totalProducts}
                </h2>

              </div>

              <FiPackage className="text-4xl text-red-600" />

            </div>

          </div>

          <div className="bg-white rounded-xl shadow p-5">

            <div className="flex justify-between items-center">

              <div>

                <p className="text-gray-500">
                  Total Stock
                </p>

                <h2 className="text-3xl font-bold mt-2">
                  {totalStock}
                </h2>

              </div>

              <FiPackage className="text-4xl text-green-600" />

            </div>

          </div>

          <div className="bg-white rounded-xl shadow p-5">

            <div className="flex justify-between items-center">

              <div>

                <p className="text-gray-500">
                  Low Stock
                </p>

                <h2 className="text-3xl font-bold mt-2 text-red-600">
                  {lowStock}
                </h2>

              </div>

              <FiPackage className="text-4xl text-yellow-500" />

            </div>

          </div>

        </div>

        <div className="bg-white rounded-xl shadow p-5">

          <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">

            <div className="relative w-full md:w-80">

              <FiSearch className="absolute left-3 top-3.5 text-gray-400" />

              <input
                type="text"
                placeholder="Search inventory..."
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

              Stock Transaction

            </button>

          </div>

          {loading ? (

            <div className="text-center py-20">
              Loading Inventory...
            </div>

          ) : filteredProducts.length === 0 ? (

            <div className="text-center py-20">

              <h2 className="text-2xl font-bold text-gray-600">
                No Products Found
              </h2>

              <p className="text-gray-500 mt-2">
                Inventory is empty.
              </p>

            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead className="bg-gray-100">

                  <tr>

                    <th className="text-left px-4 py-3">
                      Product
                    </th>

                    <th className="text-left px-4 py-3">
                      SKU
                    </th>

                    <th className="text-left px-4 py-3">
                      Category
                    </th>

                    <th className="text-center px-4 py-3">
                      Stock
                    </th>

                    <th className="text-center px-4 py-3">
                      Status
                    </th>

                  </tr>

                </thead>

                <tbody>
                                 {filteredProducts.map((product) => (

                    <tr
                      key={product.id}
                      className="border-b hover:bg-gray-50"
                    >

                      <td className="px-4 py-3 font-medium">
                        {product.name}
                      </td>

                      <td className="px-4 py-3">
                        {product.sku}
                      </td>

                      <td className="px-4 py-3">
                        {product.category}
                      </td>

                      <td className="px-4 py-3 text-center font-semibold">
                        {product.quantity}
                      </td>

                      <td className="px-4 py-3 text-center">

                        {Number(product.quantity) > 10 ? (

                          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                            In Stock
                          </span>

                        ) : Number(product.quantity) > 0 ? (

                          <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-medium">
                            Low Stock
                          </span>

                        ) : (

                          <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">
                            Out of Stock
                          </span>

                        )}

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </div>

        <StockModal
          open={openModal}
          onClose={() => setOpenModal(false)}
          onSuccess={fetchInventory}
        />

      </div>

    </DashboardLayout>
  );
}

export default Inventory; 