import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaWarehouse } from "react-icons/fa";
import { toast } from "react-toastify";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
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
      const res = await api.post("/auth/login", formData);

      login(res.data.token, res.data.user);

      toast.success(res.data.message);

      navigate("/dashboard");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Login Failed"
      );
    }
  };

  return (
    <div className="min-h-screen flex">

      {/* Left Section */}
      <div className="hidden lg:flex w-1/2 bg-black text-white items-center justify-center flex-col px-10">

        <FaWarehouse className="text-red-600 text-7xl mb-6" />

        <h1 className="text-5xl font-bold">
          Warehouse
        </h1>

        <p className="mt-4 text-gray-300 text-center max-w-md">
          Smart Warehouse Management System for Products,
          Inventory, Customers and Orders.
        </p>

      </div>

      {/* Right Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white">

        <div className="w-full max-w-md p-10 rounded-2xl shadow-xl">

          <h2 className="text-3xl font-bold text-black">
            Welcome Back
          </h2>

          <p className="text-gray-500 mt-2 mb-8">
            Login to continue
          </p>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            <div>

              <label className="block mb-2 font-medium">
                Email
              </label>

              <input
                type="email"
                name="email"
                placeholder="Enter Email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full border rounded-xl p-3 outline-none focus:border-red-600"
              />

            </div>

            <div>

              <label className="block mb-2 font-medium">
                Password
              </label>

              <input
                type="password"
                name="password"
                placeholder="Enter Password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full border rounded-xl p-3 outline-none focus:border-red-600"
              />

            </div>

            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white p-3 rounded-xl font-semibold transition-all duration-300"
            >
              Login
            </button>

          </form>

          <p className="text-center mt-6">

            Don't have an account?

            <Link
              to="/register"
              className="text-red-600 font-semibold ml-2 hover:underline"
            >
              Register
            </Link>

          </p>

        </div>

      </div>

    </div>
  );
}

export default Login;