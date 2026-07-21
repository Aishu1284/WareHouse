import { useEffect, useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import PageHeader from "../components/common/PageHeader";
import Button from "../components/common/Button";
import ProductModal from "../components/products/ProductModal";
import api from "../services/api";
import { toast } from "react-toastify";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [openModal, setOpenModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const res = await api.get("/products");

      setProducts(res.data.products || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAdd = () => {
    setSelectedProduct(null);
    setOpenModal(true);
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setOpenModal(true);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/products/${id}`);

      toast.success("Product deleted successfully");

      fetchProducts();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete product");
    }
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="Products"
        buttonText="+ Add Product"
        onClick={handleAdd}
      />

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-4 text-left">ID</th>
              <th className="px-6 py-4 text-left">Name</th>
              <th className="px-6 py-4 text-left">SKU</th>
              <th className="px-6 py-4 text-left">Price</th>
              <th className="px-6 py-4 text-left">Quantity</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>

            {loading ? (

              <tr>
                <td
                  colSpan="6"
                  className="text-center py-10 text-gray-500"
                >
                  Loading products...
                </td>
              </tr>

            ) : products.length === 0 ? (

              <tr>
                <td
                  colSpan="6"
                  className="text-center py-10 text-gray-500"
                >
                  No products found.
                </td>
              </tr>

            ) : (

              products.map((product) => (
                <tr
                  key={product.id}
                  className="border-t hover:bg-gray-50"
                >
                  <td className="px-6 py-4">
                    {product.id}
                  </td>

                  <td className="px-6 py-4 font-medium">
                    {product.name}
                  </td>

                  <td className="px-6 py-4">
                    {product.sku}
                  </td>

                  <td className="px-6 py-4">
                    ₹{product.price}
                  </td>

                  <td className="px-6 py-4">
                    {product.quantity}
                  </td>

                  <td className="px-6 py-4">

                    <div className="flex justify-center gap-2">

                      <Button
                        className="bg-blue-600 hover:bg-blue-700"
                        onClick={() => handleEdit(product)}
                      >
                        Edit
                      </Button>

                      <Button
                        className="bg-red-600 hover:bg-red-700"
                        onClick={() => handleDelete(product.id)}
                      >
                        Delete
                      </Button>

                    </div>

                  </td>

                </tr>
              ))

            )}

          </tbody>

        </table>

      </div>

      <ProductModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSuccess={fetchProducts}
        product={selectedProduct}
      />

    </DashboardLayout>
  );
}

export default Products;