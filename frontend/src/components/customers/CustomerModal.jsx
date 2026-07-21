import { useEffect, useState } from "react";
import api from "../../services/api";
import { toast } from "react-toastify";

function CustomerModal({
  open,
  onClose,
  onSuccess,
  customer,
}) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name || "",
        email: customer.email || "",
        phone: customer.phone || "",
        address: customer.address || "",
      });
    } else {
      setFormData({
        name: "",
        email: "",
        phone: "",
        address: "",
      });
    }
  }, [customer, open]);

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

    if (!formData.name.trim()) {
      toast.error("Customer name is required");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
      };

      if (customer) {
        await api.put(`/customers/${customer.id}`, payload);
        toast.success("Customer updated successfully");
      } else {
        await api.post("/customers", payload);
        toast.success("Customer added successfully");
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">

      <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl">

        <div className="flex items-center justify-between border-b px-6 py-4">

          <h2 className="text-2xl font-bold text-gray-800">
            {customer ? "Edit Customer" : "Add Customer"}
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
              Customer Name <span className="text-red-600">*</span>
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter customer name"
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-red-500 focus:outline-none"
            />

          </div>

          <div className="grid md:grid-cols-2 gap-4">

            <div>

              <label className="block mb-2 font-medium">
                Email
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email"
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-red-500 focus:outline-none"
              />

            </div>

            <div>

              <label className="block mb-2 font-medium">
                Phone
              </label>

              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-red-500 focus:outline-none"
              />

            </div>

          </div>

          <div>

            <label className="block mb-2 font-medium">
              Address
            </label>

            <textarea
              rows="4"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter address"
              className="w-full border border-gray-300 rounded-lg p-3 resize-none focus:ring-2 focus:ring-red-500 focus:outline-none"
            />

          </div>

          <div className="flex justify-end gap-3 pt-2">

            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-5 py-2 rounded-lg border hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg disabled:opacity-50"
            >
              {loading
                ? "Saving..."
                : customer
                ? "Update Customer"
                : "Add Customer"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default CustomerModal;