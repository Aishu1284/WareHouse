import { useEffect, useMemo, useState } from "react";
import api from "../../services/api";
import { toast } from "react-toastify";

function OrderModal({
  open,
  onClose,
  onSuccess,
}) {
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);

  const [formData, setFormData] = useState({
    customer_id: "",
    product_id: "",
    quantity: 1,
  });

  useEffect(() => {
    if (open) {
      fetchData();
    }
  }, [open]);

  const fetchData = async () => {
    try {
      setPageLoading(true);

      const [customerRes, productRes] = await Promise.all([
        api.get("/customers"),
        api.get("/products"),
      ]);

      setCustomers(customerRes.data.customers || []);
      setProducts(productRes.data.products || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load data");
    } finally {
      setPageLoading(false);
    }
  };

  const selectedProduct = useMemo(() => {
    return (
      products.find(
        (item) =>
          Number(item.id) === Number(formData.product_id)
      ) || null
    );
  }, [products, formData.product_id]);

  const unitPrice = selectedProduct
    ? Number(selectedProduct.price)
    : 0;

  const availableStock = selectedProduct
    ? Number(selectedProduct.quantity)
    : 0;

  const totalPrice =
    unitPrice * Number(formData.quantity || 0);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "quantity"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.customer_id) {
      toast.error("Please select customer");
      return;
    }

    if (!formData.product_id) {
      toast.error("Please select product");
      return;
    }

    if (formData.quantity <= 0) {
      toast.error("Invalid quantity");
      return;
    }

    if (formData.quantity > availableStock) {
      toast.error("Insufficient stock");
      return;
    }

    try {
      setLoading(true);

      await api.post("/orders", {
        customer_id: Number(formData.customer_id),
        product_id: Number(formData.product_id),
        quantity: Number(formData.quantity),
      });

      toast.success("Order placed successfully");

      onSuccess();

      onClose();

      setFormData({
        customer_id: "",
        product_id: "",
        quantity: 1,
      });
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Failed to create order"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">

      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl">

        <div className="flex justify-between items-center border-b px-6 py-4">

          <h2 className="text-2xl font-bold">
            Create Order
          </h2>

          <button
            onClick={onClose}
            className="text-3xl text-gray-500 hover:text-red-600"
          >
            ×
          </button>

        </div>

        {pageLoading ? (

          <div className="p-10 text-center">
            Loading...
          </div>

        ) : (

          <form
            onSubmit={handleSubmit}
            className="p-6 space-y-5"
          >
                        <div>

              <label className="block mb-2 font-medium">
                Customer
              </label>

              <select
                name="customer_id"
                value={formData.customer_id}
                onChange={handleChange}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-red-500 focus:outline-none"
              >
                <option value="">
                  Select Customer
                </option>

                {customers.map((customer) => (
                  <option
                    key={customer.id}
                    value={customer.id}
                  >
                    {customer.name}
                  </option>
                ))}

              </select>

            </div>

            <div>

              <label className="block mb-2 font-medium">
                Product
              </label>

              <select
                name="product_id"
                value={formData.product_id}
                onChange={handleChange}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-red-500 focus:outline-none"
              >
                <option value="">
                  Select Product
                </option>

                {products.map((product) => (
                  <option
                    key={product.id}
                    value={product.id}
                  >
                    {product.name}
                  </option>
                ))}

              </select>

            </div>

            {selectedProduct && (

              <div className="grid md:grid-cols-3 gap-4">

                <div className="bg-gray-100 rounded-lg p-4">

                  <p className="text-gray-500 text-sm">
                    Unit Price
                  </p>

                  <p className="font-bold text-lg">
                    ₹{unitPrice}
                  </p>

                </div>

                <div className="bg-gray-100 rounded-lg p-4">

                  <p className="text-gray-500 text-sm">
                    Available Stock
                  </p>

                  <p className="font-bold text-lg">
                    {availableStock}
                  </p>

                </div>

                <div className="bg-green-100 rounded-lg p-4">

                  <p className="text-gray-500 text-sm">
                    Total Price
                  </p>

                  <p className="font-bold text-xl text-green-700">
                    ₹{totalPrice}
                  </p>

                </div>

              </div>

            )}

            <div>

              <label className="block mb-2 font-medium">
                Quantity
              </label>

              <input
                type="number"
                name="quantity"
                min="1"
                max={availableStock || 1}
                value={formData.quantity}
                onChange={handleChange}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-red-500 focus:outline-none"
              />

            </div>

            <div className="flex justify-end gap-3 pt-4">

              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-6 py-2 border rounded-lg hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg disabled:opacity-50"
              >
                {loading
                  ? "Creating..."
                  : "Place Order"}
              </button>

            </div>

          </form>

        )}

      </div>

    </div>
  );
}

export default OrderModal;