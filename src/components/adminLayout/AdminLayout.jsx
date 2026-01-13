import React, { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  FiHome,
  FiPackage,
  FiUsers,
  FiShoppingCart,
  FiPercent,
  FiDollarSign,
  FiMenu,
  FiX,
  FiLogOut,
  FiChevronDown,
  FiBox,
} from "react-icons/fi";
import { useAuth } from "../../contexts/AuthContext";

const menuItems = [
  {
    id: "dashboard",
    label: "Tổng quan",
    icon: FiHome,
    path: "/admin",
  },
  {
    id: "products",
    label: "Sản phẩm",
    icon: FiBox,
    path: "/admin/products",
  },
  {
    id: "inventory",
    label: "Kho hàng",
    icon: FiPackage,
    path: "/admin/inventory",
    subMenu: [
      { id: "import", label: "Nhập hàng", path: "/admin/inventory/import" },
      { id: "export", label: "Xuất hàng", path: "/admin/inventory/export" },
      { id: "history", label: "Lịch sử", path: "/admin/inventory/history" },
    ],
  },
  {
    id: "orders",
    label: "Đơn hàng",
    icon: FiShoppingCart,
    path: "/admin/orders",
  },
  {
    id: "customers",
    label: "Khách hàng",
    icon: FiUsers,
    path: "/admin/customers",
  },
  {
    id: "promotions",
    label: "Khuyến mãi",
    icon: FiPercent,
    path: "/admin/promotions",
  },
  {
    id: "debts",
    label: "Công nợ",
    icon: FiDollarSign,
    path: "/admin/debts",
  },
];

function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [openSubMenu, setOpenSubMenu] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  // Sync submenu open state with current path
  useEffect(() => {
    const match = menuItems.find(
      (m) =>
        location.pathname === m.path ||
        location.pathname.startsWith(m.path + "/") ||
        (m.path === "/admin" && location.pathname === "/admin")
    );
    if (match && match.subMenu) {
      setOpenSubMenu(match.id);
    } else {
      setOpenSubMenu("");
    }
  }, [location.pathname]);

  const toggleSubMenu = (item) => {
    setOpenSubMenu((prev) => (prev === item.id ? "" : item.id));
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      // ignore; still navigate to login
      console.error("Logout error:", err);
    }
    navigate("/login", { replace: true });
  };

  // close sidebar on small screens when navigating
  const handleNavClick = () => {
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 bg-white border-r transition-all duration-200 flex flex-col ${
          sidebarOpen ? "w-64" : "w-20"
        }`}
      >
        {/* Top - Logo & Toggle */}
        <div className="flex items-center justify-between h-16 px-4 border-b">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-semibold">
              L
            </div>
            {sidebarOpen && <span className="font-semibold text-gray-800">Admin</span>}
          </div>
          <button
            onClick={() => setSidebarOpen((s) => !s)}
            className="p-2 rounded-md text-gray-600 hover:bg-gray-100"
            aria-label={sidebarOpen ? "Thu nhỏ sidebar" : "Mở rộng sidebar"}
          >
            {sidebarOpen ? <FiX size={18} /> : <FiMenu size={18} />}
          </button>
        </div>

        {/* Menu */}
        <nav className="p-3 space-y-1 overflow-auto">
          {menuItems.map((item) => (
            <div key={item.id}>
              <div className="flex items-center">
                <NavLink
                  to={item.path}
                  end={item.path === "/admin"}
                  onClick={(e) => {
                    // if item has submenu, toggle it (but still allow navigation)
                    if (item.subMenu) {
                      toggleSubMenu(item);
                    }
                    handleNavClick();
                  }}
                  className={({ isActive }) =>
                    `group flex items-center gap-3 w-full px-3 py-2 rounded-lg transition-colors ${
                      isActive || openSubMenu === item.id
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-600 hover:bg-gray-50"
                    }`
                  }
                >
                  <item.icon className="flex-shrink-0" size={18} />
                  {sidebarOpen && <span className="flex-1 text-sm font-medium">{item.label}</span>}
                  {sidebarOpen && item.subMenu && (
                    <FiChevronDown
                      className={`transition-transform text-gray-400 ${openSubMenu === item.id ? "rotate-180" : ""}`}
                    />
                  )}
                </NavLink>
              </div>

              {/* submenu */}
              {item.subMenu && sidebarOpen && openSubMenu === item.id && (
                <div className="ml-8 mt-1 space-y-1">
                  {item.subMenu.map((sub) => (
                    <NavLink
                      key={sub.id}
                      to={sub.path}
                      onClick={handleNavClick}
                      className={({ isActive }) =>
                        `block px-3 py-2 rounded-md text-sm transition-colors ${
                          isActive ? "text-white bg-blue-600" : "text-gray-600 hover:bg-gray-50"
                        }`
                      }
                    >
                      {sub.label}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Footer - user + logout */}
        <div className="p-4 border-t">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
              {currentUser?.name?.charAt(0) || "A"}
            </div>
            {sidebarOpen ? (
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-800">{currentUser?.name || "Admin"}</div>
                <div className="text-xs text-gray-500">{currentUser?.email || "admin@example.com"}</div>
              </div>
            ) : null}
            <button
              onClick={handleLogout}
              className="ml-2 p-2 rounded-md text-red-600 hover:bg-red-50"
              title="Đăng xuất"
              aria-label="Đăng xuất"
            >
              <FiLogOut size={18} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main area */}
      <div className={`flex-1 min-h-screen transition-margin duration-200 ${sidebarOpen ? "ml-64" : "ml-20"}`}>
        {/* Header */}
        <header className="sticky top-0 z-20 bg-white shadow-sm border-b h-16 flex items-center justify-between px-6">
          <div>
            <h1 className="text-lg font-semibold text-gray-800">
              {menuItems.find((m) => location.pathname === m.path || location.pathname.startsWith(m.path + "/"))?.label ||
                "Tổng quan"}
            </h1>
            <div className="text-xs text-gray-500">{location.pathname}</div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex sm:flex-col sm:items-end">
              <div className="text-sm font-medium text-gray-800">{currentUser?.name || "Admin"}</div>
              <div className="text-xs text-gray-500">{currentUser?.email || ""}</div>
            </div>
            <button
              onClick={() => {
                // quick logout from header as well
                handleLogout();
              }}
              className="px-3 py-2 rounded-md text-sm text-red-600 hover:bg-red-50"
            >
              Đăng xuất
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="p-6 bg-gray-50 min-h-[calc(100vh-64px)]">{children}</main>
      </div>
    </div>
  );
}

export default AdminLayout;