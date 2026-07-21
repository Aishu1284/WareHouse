import { NavLink, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaBox,
  FaUsers,
  FaClipboardList,
  FaShoppingCart,
  FaWarehouse,
  FaSignOutAlt,
} from "react-icons/fa";

import { useAuth } from "../../context/AuthContext";

function Sidebar() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const menuClass = ({ isActive }) =>
    `flex items-center gap-3 px-5 py-3 rounded-lg transition ${
      isActive
        ? "bg-red-600 text-white"
        : "text-gray-300 hover:bg-gray-800 hover:text-white"
    }`;

  return (
   <aside className="w-56 bg-slate-900 flex flex-col shadow-xl">

      <div className="flex items-center gap-3 p-6 border-b border-gray-700">
        <FaWarehouse className="text-red-600 text-3xl" />
        <h1 className="text-white text-xl font-bold">
          Warehouse
        </h1>
      </div>

      <nav className="flex-1 p-4 space-y-2">

        <NavLink to="/dashboard" className={menuClass}>
          <FaHome />
          Dashboard
        </NavLink>

        <NavLink to="/products" className={menuClass}>
          <FaBox />
          Products
        </NavLink>

        <NavLink to="/customers" className={menuClass}>
          <FaUsers />
          Customers
        </NavLink>

        <NavLink to="/inventory" className={menuClass}>
          <FaClipboardList />
          Inventory
        </NavLink>

        <NavLink to="/orders" className={menuClass}>
          <FaShoppingCart />
          Orders
        </NavLink>

      </nav>

      <div className="mt-auto p-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg"
        >
          <FaSignOutAlt />
          Logout
        </button>
      </div>

    </aside>
  );
}

export default Sidebar;