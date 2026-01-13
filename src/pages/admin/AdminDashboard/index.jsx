import React from "react";
import { 
  FiBox, 
  FiShoppingCart, 
  FiUsers, 
  FiDollarSign,
  FiTrendingUp,
  FiTrendingDown,
  FiArrowRight
} from "react-icons/fi";

const stats = [
  {
    label: "Tổng sản phẩm",
    value: "1,234",
    change: "+12%",
    up: true,
    icon: FiBox,
    color: "from-blue-500 to-blue-600",
  },
  {
    label: "Đơn hàng",
    value: "856",
    change: "+8%",
    up: true,
    icon: FiShoppingCart,
    color: "from-green-500 to-green-600",
  },
  {
    label: "Khách hàng",
    value: "2,456",
    change: "+15%",
    up: true,
    icon: FiUsers,
    color: "from-purple-500 to-purple-600",
  },
  {
    label: "Công nợ",
    value: "45.2M",
    change: "-5%",
    up: false,
    icon: FiDollarSign,
    color: "from-orange-500 to-orange-600",
  },
];

const recentOrders = [
  { id: "DH001", customer: "Nguyễn Văn A", total: "2,500,000", status: "Hoàn thành", statusColor: "bg-green-100 text-green-700" },
  { id: "DH002", customer: "Trần Thị B", total: "1,800,000", status: "Đang giao", statusColor: "bg-blue-100 text-blue-700" },
  { id: "DH003", customer: "Lê Văn C", total: "3,200,000", status: "Chờ xử lý", statusColor: "bg-yellow-100 text-yellow-700" },
  { id: "DH004", customer: "Phạm Thị D", total: "950,000", status: "Hoàn thành", statusColor: "bg-green-100 text-green-700" },
  { id: "DH005", customer: "Hoàng Văn E", total: "4,100,000", status: "Đã hủy", statusColor: "bg-red-100 text-red-700" },
];

const lowStockProducts = [
  { name: "Sản phẩm A", stock: 5, min: 10 },
  { name: "Sản phẩm B", stock: 3, min: 15 },
  { name: "Sản phẩm C", stock: 8, min: 20 },
  { name: "Sản phẩm D", stock: 2, min: 10 },
];

function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
                <div className={`flex items-center gap-1 mt-2 text-sm ${stat.up ? "text-green-600" : "text-red-600"}`}>
                  {stat.up ? <FiTrendingUp /> : <FiTrendingDown />}
                  <span>{stat.change}</span>
                  <span className="text-gray-400">so với tháng trước</span>
                </div>
              </div>
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${stat.color} flex items-center justify-center`}>
                <stat.icon className="text-white" size={24} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-800">Đơn hàng gần đây</h2>
            <a href="/admin/orders" className="flex items-center gap-1 text-sm text-blue-600 hover:underline">
              Xem tất cả <FiArrowRight />
            </a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-gray-500 border-b">
                  <th className="pb-3 font-medium">Mã đơn</th>
                  <th className="pb-3 font-medium">Khách hàng</th>
                  <th className="pb-3 font-medium">Tổng tiền</th>
                  <th className="pb-3 font-medium">Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b last:border-0">
                    <td className="py-4 font-medium text-gray-800">{order.id}</td>
                    <td className="py-4 text-gray-600">{order.customer}</td>
                    <td className="py-4 text-gray-600">{order.total}đ</td>
                    <td className="py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${order.statusColor}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-800">Sắp hết hàng</h2>
            <span className="bg-red-100 text-red-600 text-xs font-medium px-2 py-1 rounded-full">
              {lowStockProducts.length} sản phẩm
            </span>
          </div>
          <div className="space-y-4">
            {lowStockProducts.map((product, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div>
                  <p className="font-medium text-gray-800">{product.name}</p>
                  <p className="text-sm text-gray-500">Tối thiểu: {product.min}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-red-600">{product.stock}</p>
                  <p className="text-xs text-gray-500">còn lại</p>
                </div>
              </div>
            ))}
          </div>
          <a
            href="/admin/inventory/import"
            className="mt-4 w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition"
          >
            Nhập hàng ngay
          </a>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;