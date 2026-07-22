import { useEffect, useState } from "react";
import api from "../../services/api";
import { toast } from "react-toastify";

function StockModal({
  open,
  onClose,
  onSuccess,
}) {
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(false);

  const [pageLoading, setPageLoading] =
    useState(false);

  const [formData, setFormData] = useState({
    product_id: "",
    transaction_type: "IN",
    quantity: "",
    remarks: "",
  });

  useEffect(() => {
    if (open) {
      fetchProducts();
    }
  }, [open]);

  const fetchProducts = async () => {
    try {
      setPageLoading(true);

      const res = await api.get("/products");

      setProducts(res.data.products || []);
    } catch (error) {
      console.error(error);

      toast.error("Failed to load products");
    } finally {
      setPageLoading(false);
    }
  };

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

    if (!formData.product_id) {
      toast.error("Select Product");
      return;
    }

    if (formData.quantity <= 0) {
      toast.error("Invalid Quantity");
      return;
    }

    try {
      setLoading(true);

      await api.post(
        "/inventory",
        formData
      );

      toast.success(
        "Inventory Updated Successfully"
      );

      onSuccess();

      onClose();

      setFormData({
        product_id: "",
        transaction_type: "IN",
        quantity: "",
        remarks: "",
      });

    } catch (error) {

      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Inventory Update Failed"
      );

    } finally {

      setLoading(false);

    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">

      <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl">

        <div className="flex justify-between items-center border-b px-6 py-4">

          <h2 className="text-2xl font-bold">
            Inventory Transaction
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
            Loading Products...
          </div>

        ) : (

          <form
            onSubmit={handleSubmit}
            className="p-6 space-y-5"
          >
                        <div>

              <label className="block mb-2 font-medium">
                Product
              </label>

              <select
                name="product_id"
                value={formData.product_id}
                onChange={handleChange}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-red-500 outline-none"
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

            <div>

              <label className="block mb-2 font-medium">
                Transaction Type
              </label>

              <select
                name="transaction_type"
                value={formData.transaction_type}
                onChange={handleChange}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-red-500 outline-none"
              >
                <option value="IN">
                  Stock In
                </option>

                <option value="OUT">
                  Stock Out
                </option>

              </select>

            </div>

            <div>

              <label className="block mb-2 font-medium">
                Quantity
              </label>

              <input
                type="number"
                name="quantity"
                min="1"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="Enter Quantity"
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-red-500 outline-none"
              />

            </div>

            <div>

              <label className="block mb-2 font-medium">
                Remarks
              </label>

              <textarea
                rows="3"
                name="remarks"
                value={formData.remarks}
                onChange={handleChange}
                placeholder="Optional remarks..."
                className="w-full border rounded-lg p-3 resize-none focus:ring-2 focus:ring-red-500 outline-none"
              />

            </div>

            <div className="flex justify-end gap-3 pt-2">

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
                  ? "Updating..."
                  : "Save Transaction"}
              </button>

            </div>

          </form>

        )}

      </div>

    </div>
  );
}

export default StockModal;