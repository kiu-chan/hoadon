import React, { useState } from "react";
import {
  FiSearch,
  FiFilter,
  FiEye,
  FiPrinter,
  FiX,
  FiPlus,
  FiFileText,
} from "react-icons/fi";

const initialOrders = [
  { id: 1, code: "DH001", customer: "Nguyễn Văn A", phone: "0901234567", date: "2025-01-13", items: 3, total: 8500000, status: "completed", paid: true },
  { id: 2, code: "DH002", customer: "Trần Thị B", phone: "0912345678", date: "2025-01-13", items: 2, total: 4200000, status: "shipping", paid: true },
  { id: 3, code: "DH003", customer: "Lê Văn C", phone: "0923456789", date: "2025-01-12", items: 5, total: 12500000, status: "pending", paid: false },
  { id: 4, code: "DH004", customer: "Phạm Thị D", phone: "0934567890", date: "2025-01-12", items: 1, total: 2500000, status: "completed", paid: true },
  { id: 5, code: "DH005", customer: "Hoàng Văn E", phone: "0945678901", date: "2025-01-11", items: 4, total: 9800000, status: "cancelled", paid: false },
];

const products = [
  { id: 1, code: "SP001", name: "Sản phẩm A", price: 2500000 },
  { id: 2, code: "SP002", name: "Sản phẩm B", price: 850000 },
  { id: 3, code: "SP003", name: "Sản phẩm C", price: 15000000 },
  { id: 4, code: "SP004", name: "Sản phẩm D", price: 3200000 },
];

const statusConfig = {
  pending: { label: "Chờ xử lý", color: "bg-yellow-100 text-yellow-700" },
  shipping: { label: "Đang giao", color: "bg-blue-100 text-blue-700" },
  completed: { label: "Hoàn thành", color: "bg-green-100 text-green-700" },
  cancelled: { label: "Đã hủy", color: "bg-red-100 text-red-700" },
};

function OrdersPage() {
  const [orders, setOrders] = useState(initialOrders);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [formData, setFormData] = useState({
    customer: "",
    phone: "",
    address: "",
  });

  const filteredOrders = orders.filter((order) => {
    const matchSearch =
      order.code.toLowerCase().includes(search.toLowerCase()) ||
      order.customer.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || order.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const addProduct = () => {
    setSelectedProducts([...selectedProducts, { productId: "", quantity: 1, price: 0 }]);
  };

  const updateSelectedProduct = (index, field, value) => {
    const updated = [...selectedProducts];
    updated[index][field] = value;
    if (field === "productId") {
      const product = products.find((p) => p.id === Number(value));
      if (product) {
        updated[index].price = product.price;
        updated[index].name = product.name;
      }
    }
    setSelectedProducts(updated);
  };

  const removeSelectedProduct = (index) => {
    setSelectedProducts(selectedProducts.filter((_, i) => i !== index));
  };

  const calculateTotal = () => {
    return selectedProducts.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const handleCreateOrder = (e) => {
    e.preventDefault();
    const newOrder = {
      id: Date.now(),
      code: `DH${String(orders.length + 1).padStart(3, "0")}`,
      customer: formData.customer,
      phone: formData.phone,
      date: new Date().toISOString().split("T")[0],
      items: selectedProducts.length,
      total: calculateTotal(),
      status: "pending",
      paid: false,
      products: selectedProducts,
      address: formData.address,
    };
    setOrders([newOrder, ...orders]);
    setShowModal(false);
    setSelectedOrder(newOrder);
    setShowInvoice(true);
  };

  const openInvoice = (order) => {
    setSelectedOrder({
      ...order,
      products: order.products || [
        { name: "Sản phẩm mẫu", quantity: order.items, price: order.total / order.items },
      ],
    });
    setShowInvoice(true);
  };

  const printInvoice = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Quản lý đơn hàng</h1>
          <p className="text-gray-500">Tổng cộng {orders.length} đơn hàng</p>
        </div>
        <button
          onClick={() => {
            setFormData({ customer: "", phone: "", address: "" });
            setSelectedProducts([]);
            setShowModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition"
        >
          <FiPlus /> Tạo đơn hàng
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(statusConfig).map(([key, { label, color }]) => (
          <div key={key} className="bg-white rounded-2xl p-4 shadow-sm">
            <p className="text-sm text-gray-500">{label}</p>
            <p className="text-2xl font-bold text-gray-800">
              {orders.filter((o) => o.status === key).length}
            </p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm đơn hàng..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="all">Tất cả trạng thái</option>
            {Object.entries(statusConfig).map(([key, { label }]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr className="text-left text-sm text-gray-500">
                <th className="px-6 py-4 font-medium">Mã đơn</th>
                <th className="px-6 py-4 font-medium">Khách hàng</th>
                <th className="px-6 py-4 font-medium">SĐT</th>
                <th className="px-6 py-4 font-medium">Ngày</th>
                <th className="px-6 py-4 font-medium">Số SP</th>
                <th className="px-6 py-4 font-medium">Tổng tiền</th>
                <th className="px-6 py-4 font-medium">Trạng thái</th>
                <th className="px-6 py-4 font-medium">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-800">{order.code}</td>
                  <td className="px-6 py-4 text-gray-800">{order.customer}</td>
                  <td className="px-6 py-4 text-gray-600">{order.phone}</td>
                  <td className="px-6 py-4 text-gray-600">{order.date}</td>
                  <td className="px-6 py-4 text-gray-600">{order.items}</td>
                  <td className="px-6 py-4 font-medium text-gray-800">{order.total.toLocaleString()}đ</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusConfig[order.status].color}`}>
                      {statusConfig[order.status].label}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openInvoice(order)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        title="Xem hóa đơn"
                      >
                        <FiFileText />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Order Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Tạo đơn hàng mới</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <FiX />
              </button>
            </div>
            <form onSubmit={handleCreateOrder} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tên khách hàng</label>
                  <input
                    type="text"
                    value={formData.customer}
                    onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">Sản phẩm</label>
                  <button
                    type="button"
                    onClick={addProduct}
                    className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
                  >
                    <FiPlus /> Thêm sản phẩm
                  </button>
                </div>
                <div className="space-y-3">
                  {selectedProducts.map((item, index) => (
                    <div key={index} className="flex gap-3 items-center">
                      <select
                        value={item.productId}
                        onChange={(e) => updateSelectedProduct(index, "productId", e.target.value)}
                        className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                        required
                      >
                        <option value="">Chọn sản phẩm</option>
                        {products.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.code} - {p.name} - {p.price.toLocaleString()}đ
                          </option>
                        ))}
                      </select>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateSelectedProduct(index, "quantity", Number(e.target.value))}
                        min="1"
                        className="w-20 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => removeSelectedProduct(index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <FiX />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between py-4 border-t">
                <span className="text-lg font-medium text-gray-700">Tổng cộng:</span>
                <span className="text-2xl font-bold text-gray-800">{calculateTotal().toLocaleString()}đ</span>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-xl font-medium hover:bg-gray-50 transition"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition"
                >
                  Tạo đơn & In hóa đơn
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invoice Modal */}
      {showInvoice && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 print:p-4" id="invoice">
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">HÓA ĐƠN BÁN HÀNG</h1>
                <p className="text-gray-500">Mã: {selectedOrder.code}</p>
                <p className="text-gray-500">Ngày: {selectedOrder.date}</p>
              </div>

              <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                <p className="font-medium text-gray-800">{selectedOrder.customer}</p>
                <p className="text-gray-600">{selectedOrder.phone}</p>
                {selectedOrder.address && <p className="text-gray-600">{selectedOrder.address}</p>}
              </div>

              <table className="w-full mb-6">
                <thead>
                  <tr className="border-b text-left text-sm text-gray-500">
                    <th className="pb-2">Sản phẩm</th>
                    <th className="pb-2 text-center">SL</th>
                    <th className="pb-2 text-right">Đơn giá</th>
                    <th className="pb-2 text-right">Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.products?.map((item, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-3 text-gray-800">{item.name}</td>
                      <td className="py-3 text-center text-gray-600">{item.quantity}</td>
                      <td className="py-3 text-right text-gray-600">{item.price?.toLocaleString()}đ</td>
                      <td className="py-3 text-right font-medium">{(item.price * item.quantity).toLocaleString()}đ</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="flex justify-between items-center py-4 border-t-2 border-gray-800">
                <span className="text-xl font-bold">TỔNG CỘNG:</span>
                <span className="text-2xl font-bold text-blue-600">{selectedOrder.total.toLocaleString()}đ</span>
              </div>

              <p className="text-center text-gray-500 mt-6">Cảm ơn quý khách!</p>
            </div>

            <div className="flex gap-3 p-4 border-t print:hidden">
              <button
                onClick={() => setShowInvoice(false)}
                className="flex-1 px-4 py-3 border border-gray-200 rounded-xl font-medium hover:bg-gray-50 transition"
              >
                Đóng
              </button>
              <button
                onClick={printInvoice}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition"
              >
                <FiPrinter /> In hóa đơn
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrdersPage;