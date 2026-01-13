import React, { useState } from "react";
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
  FiBox
} from "react-icons/fi";

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
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [openSubMenu, setOpenSubMenu] = useState("");

  const handleMenuClick = (item) => {
    setActiveMenu(item.id);
    if (item.subMenu) {
      setOpenSubMenu(openSubMenu === item.id ? "" : item.id);
    } else {
      setOpenSubMenu("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen bg-gray-900 text-white transition-all duration-300 ${
          sidebarOpen ? "w-64" : "w-20"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-800">
          {sidebarOpen && (
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Admin Panel
            </span>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-800 transition"
          >
            {sidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>

        {/* Menu */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <div key={item.id}>
              <button
                onClick={() => handleMenuClick(item)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                  activeMenu === item.id
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                    : "text-gray-300 hover:bg-gray-800"
                }`}
              >
                <item.icon size={20} />
                {sidebarOpen && (
                  <>
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.subMenu && (
                      <FiChevronDown
                        className={`transition-transform ${
                          openSubMenu === item.id ? "rotate-180" : ""
                        }`}
                      />
                    )}
                  </>
                )}
              </button>

              {/* SubMenu */}
              {item.subMenu && sidebarOpen && openSubMenu === item.id && (
                <div className="mt-2 ml-4 space-y-1">
                  {item.subMenu.map((sub) => (
                    <a
                      key={sub.id}
                      href={sub.path}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition"
                    >
                      <span className="w-1.5 h-1.5 bg-gray-500 rounded-full"></span>
                      {sub.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Logout */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
          <button
            className={`w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 rounded-xl transition ${
              !sidebarOpen && "justify-center"
            }`}
          >
            <FiLogOut size={20} />
            {sidebarOpen && <span>Đăng xuất</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div
        className={`transition-all duration-300 ${
          sidebarOpen ? "ml-64" : "ml-20"
        }`}
      >
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white shadow-sm h-16 flex items-center justify-between px-6">
          <h1 className="text-xl font-semibold text-gray-800">
            {menuItems.find((m) => m.id === activeMenu)?.label || "Tổng quan"}
          </h1>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-800">Admin</p>
              <p className="text-xs text-gray-500">admin@example.com</p>
            </div>
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
              A
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}

export default AdminLayout;