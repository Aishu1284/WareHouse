import { useEffect, useState } from "react";
import api from "../../services/api";
import { toast } from "react-toastify";

function ProductModal({
  open,
  onClose,
  onSuccess,
  product,
}) {
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    category: "",
    price: "",
    quantity: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        sku: product.sku || "",
        category: product.category || "",
        price: product.price || "",
        quantity: product.quantity || "",
      });
    } else {
      setFormData({
        name: "",
        sku: "",
        category: "",
        price: "",
        quantity: "",
      });
    }
  }, [product, open]);

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.sku.trim() ||
      !formData.category.trim() ||
      formData.price === "" ||
      formData.quantity === ""
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        name: formData.name.trim(),
        sku: formData.sku.trim(),
        category: formData.category.trim(),
        price: Number(formData.price),
        quantity: Number(formData.quantity),
      };

      if (product) {
        await api.put(`/products/${product.id}`, payload);
        toast.success("Product updated successfully");
      } else {
        await api.post("/products", payload);
        toast.success("Product added successfully");
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message || "Operation failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">

        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2 className="text-2xl font-bold text-gray-800">
            {product ? "Edit Product" : "Add Product"}
          </h2>

          <button
            onClick={onClose}
            className="text-2xl text-gray-500 hover:text-red-600"
          >
            ×
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-5"
        >

          <div>
            <label className="block mb-2 font-medium">
              Product Name
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter product name"
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              SKU
            </label>

            <input
              type="text"
              name="sku"
              value={formData.sku}
              onChange={handleChange}
              placeholder="Enter SKU"
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Category
            </label>

            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="Electronics / Grocery / Furniture"
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">

            <div>
              <label className="block mb-2 font-medium">
                Price
              </label>

              <input
                type="number"
                min="0"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="0"
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">
                Quantity
              </label>

              <input
                type="number"
                min="0"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="0"
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

          </div>

          <div className="flex justify-end gap-3 pt-4">

            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-5 py-2 border rounded-lg hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg disabled:opacity-50"
            >
              {loading
                ? "Saving..."
                : product
                ? "Update Product"
                : "Add Product"}
            </button>

          </div>

        </form>

      </div>
    </div>
  );
}

export default ProductModal;