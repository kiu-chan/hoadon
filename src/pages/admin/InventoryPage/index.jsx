import React, { useState } from "react";
import {
  FiDownload,
  FiUpload,
  FiSearch,
  FiPlus,
  FiX,
  FiFileText,
} from "react-icons/fi";

const initialHistory = [
  { 
    id: 1, 
    type: "import", 
    code: "NK001", 
    date: "2025-01-10", 
    supplier: "NCC ABC", 
    products: 5, 
    total: 25000000, 
    note: "Nhập hàng tháng 1",
    priceLevels: [
      { fromQty: 1, toQty: 10, price: 2000000, discount: 0 },
      { fromQty: 11, toQty: 50, price: 1800000, discount: 10 }
    ]
  },
  { 
    id: 2, 
    type: "export", 
    code: "XK001", 
    date: "2025-01-11", 
    customer: "Nguyễn Văn A", 
    products: 3, 
    total: 8500000, 
    note: "Xuất bán" 
  },
];

const products = [
  { id: 1, code: "SP001", name: "Sản phẩm A", currentPrice: 2500000 },
  { id: 2, code: "SP002", name: "Sản phẩm B", currentPrice: 850000 },
  { id: 3, code: "SP003", name: "Sản phẩm C", currentPrice: 15000000 },
  { id: 4, code: "SP004", name: "Sản phẩm D", currentPrice: 3200000 },
];

function InventoryPage() {
  const [history, setHistory] = useState(initialHistory);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("import");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [importPriceLevels, setImportPriceLevels] = useState([
    { fromQty: 1, toQty: null, price: 0, discount: 0 }
  ]);
  const [formData, setFormData] = useState({
    supplier: "",
    customer: "",
    note: "",
  });

  const filteredHistory = history.filter((item) => {
    const matchSearch =
      item.code.toLowerCase().includes(search.toLowerCase()) ||
      (item.supplier?.toLowerCase().includes(search.toLowerCase()) || false) ||
      (item.customer?.toLowerCase().includes(search.toLowerCase()) || false);
    const matchType = filterType === "all" || item.type === filterType;
    return matchSearch && matchType;
  });

  const openModal = (type) => {
    setModalType(type);
    setSelectedProducts([]);
    setImportPriceLevels([{ fromQty: 1, toQty: null, price: 0, discount: 0 }]);
    setFormData({ supplier: "", customer: "", note: "" });
    setShowModal(true);
  };

  const addProduct = () => {
    setSelectedProducts([
      ...selectedProducts,
      { productId: "", quantity: 1, price: 0 },
    ]);
  };

  const updateSelectedProduct = (index, field, value) => {
    const updated = [...selectedProducts];
    updated[index][field] = value;
    if (field === "productId") {
      const product = products.find((p) => p.id === Number(value));
      if (product) {
        updated[index].price = product.currentPrice;
        updated[index].name = product.name;
      }
    }
    setSelectedProducts(updated);
  };

  const removeSelectedProduct = (index) => {
    setSelectedProducts(selectedProducts.filter((_, i) => i !== index));
  };

  const addPriceLevel = () => {
    const lastLevel = importPriceLevels[importPriceLevels.length - 1];
    const newFromQty = lastLevel.toQty ? lastLevel.toQty + 1 : lastLevel.fromQty + 10;
    setImportPriceLevels([
      ...importPriceLevels,
      { fromQty: newFromQty, toQty: null, price: 0, discount: 0 }
    ]);
  };

  const removePriceLevel = (index) => {
    if (importPriceLevels.length > 1) {
      setImportPriceLevels(importPriceLevels.filter((_, i) => i !== index));
    }
  };

  const updatePriceLevel = (index, field, value) => {
    const updated = [...importPriceLevels];
    updated[index][field] = field === 'fromQty' || field === 'toQty' ? (value === '' ? null : Number(value)) : Number(value);
    
    // Tính giá sau chiết khấu
    if (field === 'price' || field === 'discount') {
      const basePrice = field === 'price' ? Number(value) : updated[index].price;
      const discount = field === 'discount' ? Number(value) : updated[index].discount;
      updated[index].finalPrice = basePrice * (1 - discount / 100);
    }
    
    setImportPriceLevels(updated);
  };

  const calculateTotal = () => {
    return selectedProducts.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newEntry = {
      id: Date.now(),
      type: modalType,
      code: modalType === "import" 
        ? `NK${String(history.filter((h) => h.type === "import").length + 1).padStart(3, "0")}` 
        : `XK${String(history.filter((h) => h.type === "export").length + 1).padStart(3, "0")}`,
      date: new Date().toISOString().split("T")[0],
      supplier: modalType === "import" ? formData.supplier : undefined,
      customer: modalType === "export" ? formData.customer : undefined,
      products: selectedProducts.length,
      total: calculateTotal(),
      note: formData.note,
      priceLevels: modalType === "import" ? importPriceLevels : undefined,
      productDetails: selectedProducts
    };
    setHistory([newEntry, ...history]);
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Quản lý kho hàng</h1>
          <p className="text-gray-500">Nhập xuất và theo dõi tồn kho</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => openModal("import")}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition"
          >
            <FiDownload /> Nhập hàng
          </button>
          <button
            onClick={() => openModal("export")}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition"
          >
            <FiUpload /> Xuất hàng
          </button>
        </div>
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
                {history.filter((h) => h.type === "import").reduce((s, h) => s + h.total, 0).toLocaleString()}đ
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
                {history.filter((h) => h.type === "export").reduce((s, h) => s + h.total, 0).toLocaleString()}đ
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
              <p className="text-sm text-gray-500">Số phiếu</p>
              <p className="text-xl font-bold text-gray-800">{history.length}</p>
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
              placeholder="Tìm kiếm phiếu..."
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
            <option value="all">Tất cả</option>
            <option value="import">Phiếu nhập</option>
            <option value="export">Phiếu xuất</option>
          </select>
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
                <th className="px-6 py-4 font-medium">Số SP</th>
                <th className="px-6 py-4 font-medium">Tổng tiền</th>
                <th className="px-6 py-4 font-medium">Ghi chú</th>
              </tr>
            </thead>
            <tbody>
              {filteredHistory.map((item) => (
                <tr key={item.id} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        item.type === "import"
                          ? "bg-green-100 text-green-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {item.type === "import" ? "Nhập" : "Xuất"}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-800">{item.code}</td>
                  <td className="px-6 py-4 text-gray-600">{item.date}</td>
                  <td className="px-6 py-4 text-gray-600">{item.supplier || item.customer}</td>
                  <td className="px-6 py-4 text-gray-600">{item.products}</td>
                  <td className="px-6 py-4 font-medium text-gray-800">{item.total.toLocaleString()}đ</td>
                  <td className="px-6 py-4 text-gray-500">{item.note || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                {modalType === "import" ? "Tạo phiếu nhập hàng" : "Tạo phiếu xuất hàng"}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <FiX />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {modalType === "import" ? "Nhà cung cấp" : "Khách hàng"}
                </label>
                <input
                  type="text"
                  value={modalType === "import" ? formData.supplier : formData.customer}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      [modalType === "import" ? "supplier" : "customer"]: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>

              {modalType === "import" && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-700">Bảng giá nhập theo số lượng / chiết khấu</label>
                    <button
                      type="button"
                      onClick={addPriceLevel}
                      className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
                    >
                      <FiPlus /> Thêm mức giá
                    </button>
                  </div>
                  <div className="space-y-3 bg-gray-50 p-4 rounded-xl">
                    {importPriceLevels.map((level, index) => (
                      <div key={index} className="flex gap-3 items-start bg-white p-3 rounded-lg">
                        <div className="flex-1 grid grid-cols-5 gap-3">
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Từ SL</label>
                            <input
                              type="number"
                              value={level.fromQty || ''}
                              onChange={(e) => updatePriceLevel(index, "fromQty", e.target.value)}
                              min="1"
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Đến SL</label>
                            <input
                              type="number"
                              value={level.toQty || ''}
                              onChange={(e) => updatePriceLevel(index, "toQty", e.target.value)}
                              placeholder="∞"
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Giá nhập</label>
                            <input
                              type="number"
                              value={level.price}
                              onChange={(e) => updatePriceLevel(index, "price", e.target.value)}
                              min="0"
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">CK (%)</label>
                            <input
                              type="number"
                              value={level.discount}
                              onChange={(e) => updatePriceLevel(index, "discount", e.target.value)}
                              min="0"
                              max="100"
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Giá cuối</label>
                            <input
                              type="text"
                              value={(level.finalPrice || level.price * (1 - level.discount / 100)).toLocaleString()}
                              readOnly
                              className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-sm text-gray-600"
                            />
                          </div>
                        </div>
                        {importPriceLevels.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removePriceLevel(index)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg mt-5"
                          >
                            <FiX />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    * Nhập giá theo số lượng hoặc % chiết khấu. Để trống "Đến SL" nếu không giới hạn.
                  </p>
                </div>
              )}

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
                            {p.code} - {p.name}
                          </option>
                        ))}
                      </select>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateSelectedProduct(index, "quantity", Number(e.target.value))}
                        min="1"
                        className="w-24 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="SL"
                      />
                      <input
                        type="number"
                        value={item.price}
                        onChange={(e) => updateSelectedProduct(index, "price", Number(e.target.value))}
                        className="w-32 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="Giá"
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú</label>
                <textarea
                  value={formData.note}
                  onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  rows={3}
                />
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
                  className={`flex-1 px-4 py-3 text-white rounded-xl font-medium hover:shadow-lg transition ${
                    modalType === "import" ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {modalType === "import" ? "Tạo phiếu nhập" : "Tạo phiếu xuất"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default InventoryPage;