import { useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Navbar() {

  const { pathname } = useLocation();
  const { user } = useAuth();

  const titles = {
    "/dashboard": "Dashboard",
    "/products": "Products",
    "/customers": "Customers",
    "/inventory": "Inventory",
    "/orders": "Orders",
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8">

  <h2 className="text-3xl font-bold text-gray-800">
    {titles[pathname] || "Dashboard"}
  </h2>

  <div className="flex items-center gap-3">

    <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white font-bold">
      {user?.name?.charAt(0).toUpperCase() || "A"}
    </div>

    <div>
      <p className="font-semibold text-gray-800">
        {user?.name}
      </p>

      <p className="text-sm text-gray-500">
        {user?.email}
      </p>
    </div>

  </div>

</header>
  );
}

export default Navbar;