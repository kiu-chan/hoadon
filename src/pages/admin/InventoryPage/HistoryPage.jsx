import React, { useState } from "react";
import {
  FiDownload,
  FiUpload,
  FiSearch,
  FiFilter,
  FiEye,
  FiPrinter,
  FiX,
  FiFileText,
  FiCalendar,
} from "react-icons/fi";

const initialHistory = [
  { 
    id: 1, 
    type: "import", 
    code: "NK001", 
    date: "2025-01-10", 
    partner: "NCC ABC",
    products: 5, 
    totalQty: 150,
    total: 25000000, 
    note: "Nhập hàng tháng 1",
    invoice: "HĐ001",
    productDetails: [
      { name: "Sản phẩm A", quantity: 50, price: 200000 },
      { name: "Sản phẩm B", quantity: 100, price: 150000 }
    ]
  },
  { 
    id: 2, 
    type: "export", 
    code: "XK001", 
    date: "2025-01-11", 
    partner: "Nguyễn Văn A",
    products: 3, 
    totalQty: 8,
    total: 8500000, 
    note: "Xuất bán lẻ",
    invoice: "DH001",
    productDetails: [
      { name: "Sản phẩm A", quantity: 3, price: 2500000 },
      { name: "Sản phẩm C", quantity: 5, price: 400000 }
    ]
  },
  { 
    id: 3, 
    type: "import", 
    code: "NK002", 
    date: "2025-01-12", 
    partner: "NCC XYZ",
    products: 10, 
    totalQty: 500,
    total: 45000000, 
    note: "Nhập khuyến mãi chiết khấu 15%",
    invoice: "HĐ002",
    productDetails: [
      { name: "Sản phẩm D", quantity: 300, price: 100000 },
      { name: "Sản phẩm E", quantity: 200, price: 75000 }
    ]
  },
  { 
    id: 4, 
    type: "export", 
    code: "XK002", 
    date: "2025-01-12", 
    partner: "Công ty B",
    products: 8, 
    totalQty: 50,
    total: 32000000, 
    note: "Đơn hàng lớn",
    invoice: "DH002",
    productDetails: [
      { name: "Sản phẩm C", quantity: 20, price: 1500000 },
      { name: "Sản phẩm A", quantity: 30, price: 100000 }
    ]
  },
  { 
    id: 5, 
    type: "import", 
    code: "NK003", 
    date: "2025-01-13", 
    partner: "NCC ABC",
    products: 2, 
    totalQty: 80,
    total: 12000000, 
    note: "Bổ sung hàng",
    invoice: "",
    productDetails: [
      { name: "Sản phẩm B", quantity: 80, price: 150000 }
    ]
  },
  { 
    id: 6, 
    type: "export", 
    code: "XK003", 
    date: "2025-01-14", 
    partner: "Trần Thị C",
    products: 5, 
    totalQty: 12,
    total: 5800000, 
    note: "",
    invoice: "DH003",
    productDetails: [
      { name: "Sản phẩm A", quantity: 5, price: 500000 },
      { name: "Sản phẩm B", quantity: 7, price: 400000 }
    ]
  },
];

function HistoryPage() {
  const [history, setHistory] = useState(initialHistory);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterDate, setFilterDate] = useState("");
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const filteredHistory = history.filter((item) => {
    const matchSearch =
      item.code.toLowerCase().includes(search.toLowerCase()) ||
      item.partner.toLowerCase().includes(search.toLowerCase()) ||
      (item.invoice && item.invoice.toLowerCase().includes(search.toLowerCase()));
    
    const matchType = filterType === "all" || item.type === filterType;
    
    const matchDate = !filterDate || item.date === filterDate;

    return matchSearch && matchType && matchDate;
  });

  const openDetailModal = (item) => {
    setSelectedItem(item);
    setShowDetailModal(true);
  };

  const getTypeLabel = (type) => {
    return type === "import" ? "Nhập" : "Xuất";
  };

  const getTypeBadgeClass = (type) => {
    return type === "import" 
      ? "bg-green-100 text-green-700" 
      : "bg-blue-100 text-blue-700";
  };

  const getTotalStats = () => {
    const totalImport = history
      .filter(h => h.type === "import")
      .reduce((sum, h) => sum + h.total, 0);
    
    const totalExport = history
      .filter(h => h.type === "export")
      .reduce((sum, h) => sum + h.total, 0);

    return { totalImport, totalExport };
  };

  const stats = getTotalStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Lịch sử nhập xuất</h1>
          <p className="text-gray-500">Theo dõi toàn bộ giao dịch kho</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition">
          <FiPrinter /> In báo cáo
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <FiDownload className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Tổng nhập</p>
              <p className="text-xl font-bold text-gray-800">
                {stats.totalImport.toLocaleString()}đ
              </p>
              <p className="text-xs text-gray-400">
                {history.filter(h => h.type === "import").length} phiếu
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <FiUpload className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Tổng xuất</p>
              <p className="text-xl font-bold text-gray-800">
                {stats.totalExport.toLocaleString()}đ
              </p>
              <p className="text-xs text-gray-400">
                {history.filter(h => h.type === "export").length} phiếu
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <FiFileText className="text-purple-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Tổng số phiếu</p>
              <p className="text-xl font-bold text-gray-800">{history.length}</p>
              <p className="text-xs text-gray-400">
                {history.reduce((sum, h) => sum + h.totalQty, 0)} sản phẩm
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo mã phiếu, đối tác, số HĐ..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="all">Tất cả loại</option>
            <option value="import">Phiếu nhập</option>
            <option value="export">Phiếu xuất</option>
          </select>
          <div className="relative">
            <FiCalendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          {(search || filterType !== "all" || filterDate) && (
            <button
              onClick={() => {
                setSearch("");
                setFilterType("all");
                setFilterDate("");
              }}
              className="px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition flex items-center gap-2"
            >
              <FiX /> Xóa bộ lọc
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr className="text-left text-sm text-gray-500">
                <th className="px-6 py-4 font-medium">Loại</th>
                <th className="px-6 py-4 font-medium">Mã phiếu</th>
                <th className="px-6 py-4 font-medium">Ngày</th>
                <th className="px-6 py-4 font-medium">Đối tác</th>
                <th className="px-6 py-4 font-medium">Số HĐ</th>
                <th className="px-6 py-4 font-medium">SL SP</th>
                <th className="px-6 py-4 font-medium">Tổng SL</th>
                <th className="px-6 py-4 font-medium">Tổng tiền</th>
                <th className="px-6 py-4 font-medium">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredHistory.map((item) => (
                <tr key={item.id} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeBadgeClass(item.type)}`}>
                      {getTypeLabel(item.type)}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-800">{item.code}</td>
                  <td className="px-6 py-4 text-gray-600">{item.date}</td>
                  <td className="px-6 py-4 text-gray-600">{item.partner}</td>
                  <td className="px-6 py-4 text-gray-500">{item.invoice || "-"}</td>
                  <td className="px-6 py-4 text-gray-600">{item.products}</td>
                  <td className="px-6 py-4 text-gray-600 font-medium">{item.totalQty}</td>
                  <td className="px-6 py-4 font-medium text-gray-800">{item.total.toLocaleString()}đ</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => openDetailModal(item)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      title="Xem chi tiết"
                    >
                      <FiEye />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredHistory.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center text-gray-500">
                    <FiFileText className="mx-auto text-4xl mb-2 opacity-50" />
                    <p>Không tìm thấy phiếu nào</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-semibold text-gray-800">Chi tiết phiếu {selectedItem.code}</h2>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeBadgeClass(selectedItem.type)}`}>
                  {getTypeLabel(selectedItem.type)}
                </span>
              </div>
              <button onClick={() => setShowDetailModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <FiX />
              </button>
            </div>

            {/* Thông tin chung */}
            <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-xl">
              <div>
                <p className="text-sm text-gray-500">Mã phiếu</p>
                <p className="font-medium text-gray-800">{selectedItem.code}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Ngày</p>
                <p className="font-medium text-gray-800">{selectedItem.date}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">{selectedItem.type === "import" ? "Nhà cung cấp" : "Khách hàng"}</p>
                <p className="font-medium text-gray-800">{selectedItem.partner}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Số hóa đơn</p>
                <p className="font-medium text-gray-800">{selectedItem.invoice || "-"}</p>
              </div>
            </div>

            {/* Danh sách sản phẩm */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Danh sách sản phẩm</h3>
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr className="text-left text-sm text-gray-500">
                      <th className="px-4 py-3 font-medium">Sản phẩm</th>
                      <th className="px-4 py-3 font-medium text-center">Số lượng</th>
                      <th className="px-4 py-3 font-medium text-right">Đơn giá</th>
                      <th className="px-4 py-3 font-medium text-right">Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedItem.productDetails.map((product, idx) => (
                      <tr key={idx} className="border-t">
                        <td className="px-4 py-3 text-gray-800">{product.name}</td>
                        <td className="px-4 py-3 text-center text-gray-600">{product.quantity}</td>
                        <td className="px-4 py-3 text-right text-gray-600">{product.price.toLocaleString()}đ</td>
                        <td className="px-4 py-3 text-right font-medium text-gray-800">
                          {(product.quantity * product.price).toLocaleString()}đ
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Ghi chú */}
            {selectedItem.note && (
              <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                <p className="text-sm font-medium text-gray-700 mb-1">Ghi chú</p>
                <p className="text-gray-600">{selectedItem.note}</p>
              </div>
            )}

            {/* Tổng cộng */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border-t-2 border-gray-800">
              <div>
                <p className="text-sm text-gray-500">Tổng số lượng</p>
                <p className="text-2xl font-bold text-gray-800">{selectedItem.totalQty} sản phẩm</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Tổng tiền</p>
                <p className={`text-3xl font-bold ${selectedItem.type === 'import' ? 'text-green-600' : 'text-blue-600'}`}>
                  {selectedItem.total.toLocaleString()}đ
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowDetailModal(false)}
                className="flex-1 px-4 py-3 border border-gray-200 rounded-xl font-medium hover:bg-gray-50 transition"
              >
                Đóng
              </button>
              <button
                onClick={() => window.print()}
                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition flex items-center justify-center gap-2"
              >
                <FiPrinter /> In phiếu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HistoryPage;