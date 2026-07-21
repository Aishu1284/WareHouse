import { Link, useNavigate } from "react-router-dom";
import { FaWarehouse } from "react-icons/fa";
import { useState } from "react";
import { toast } from "react-toastify";
import api from "../services/api";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/auth/register", formData);

      toast.success(res.data.message);

      navigate("/");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Registration Failed"
      );
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left */}
      <div className="hidden lg:flex w-1/2 bg-black text-white items-center justify-center flex-col px-10">
        <FaWarehouse className="text-red-600 text-7xl mb-6" />

        <h1 className="text-5xl font-bold">Warehouse</h1>

        <p className="mt-4 text-gray-300 text-center max-w-md">
          Manage Products, Inventory, Customers and Orders with one dashboard.
        </p>
      </div>

      {/* Right */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white">
        <div className="w-full max-w-md p-10 shadow-xl rounded-2xl">
          <h2 className="text-3xl font-bold mb-2">
            Create Account
          </h2>

          <p className="text-gray-500 mb-8">
            Register to continue
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">

            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border p-3 rounded-xl focus:border-red-600 outline-none"
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border p-3 rounded-xl focus:border-red-600 outline-none"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border p-3 rounded-xl focus:border-red-600 outline-none"
            />

            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white rounded-xl p-3 font-semibold transition"
            >
              Register
            </button>

          </form>

          <p className="text-center mt-6">
            Already have an account?

            <Link
              to="/"
              className="text-red-600 font-semibold ml-2"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;