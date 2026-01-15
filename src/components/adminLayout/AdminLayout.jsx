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
      { id: "overview", label: "Tổng thể", path: "/admin/inventory" },
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
    subMenu: [
      { id: "overview", label: "Tổng quan", path: "/admin/debts" },
      { id: "debt", label: "Nợ", path: "/admin/debts/debt" },
      { id: "payment", label: "Trả", path: "/admin/debts/payment" },
      { id: "history", label: "Lịch sử", path: "/admin/debts/history" },
    ],
  },
];

function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const saved = localStorage.getItem('sidebarOpen');
    return saved ? JSON.parse(saved) : true;
  });
  const [openSubMenu, setOpenSubMenu] = useState(() => {
    const saved = localStorage.getItem('openSubMenu');
    return saved || "";
  });
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  // Save sidebar state to localStorage
  useEffect(() => {
    localStorage.setItem('sidebarOpen', JSON.stringify(sidebarOpen));
  }, [sidebarOpen]);

  // Save submenu state to localStorage
  useEffect(() => {
    localStorage.setItem('openSubMenu', openSubMenu);
  }, [openSubMenu]);

  // Sync submenu open state with current path (only on first load if no saved state)
  useEffect(() => {
    const saved = localStorage.getItem('openSubMenu');
    if (!saved) {
      const match = menuItems.find(
        (m) =>
          location.pathname === m.path ||
          location.pathname.startsWith(m.path + "/") ||
          (m.path === "/admin" && location.pathname === "/admin")
      );
      if (match && match.subMenu) {
        setOpenSubMenu(match.id);
      }
    }
  }, []);

  const toggleSubMenu = (item) => {
    setOpenSubMenu((prev) => (prev === item.id ? "" : item.id));
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error("Logout error:", err);
    }
    // Clear localStorage on logout
    localStorage.removeItem('openSubMenu');
    localStorage.removeItem('sidebarOpen');
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
          {menuItems.map((item) => {
            // Check if any submenu item is active
            const isSubMenuActive = item.subMenu?.some(sub => location.pathname === sub.path);
            const isParentActive = location.pathname === item.path && !item.subMenu;
            
            return (
              <div key={item.id}>
                <div className="flex items-center">
                  <NavLink
                    to={item.path}
                    end={item.path === "/admin"}
                    onClick={(e) => {
                      if (item.subMenu) {
                        toggleSubMenu(item);
                      }
                      handleNavClick();
                    }}
                    className={() =>
                      `group flex items-center gap-3 w-full px-3 py-2 rounded-lg transition-colors ${
                        isSubMenuActive || isParentActive
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
                        end={sub.path === "/admin/inventory" || sub.path === "/admin/debts"}
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
            );
          })}
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


        {/* Content */}
        <main className="p-6 bg-gray-50 min-h-[calc(100vh-64px)]">{children}</main>
      </div>
    </div>
  );
}

export default AdminLayout;