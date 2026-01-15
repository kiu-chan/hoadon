import React, { useState } from "react";
import { FiUpload, FiPlus, FiX, FiCalendar, FiUser } from "react-icons/fi";

const products = [
  { id: 1, code: "SP001", name: "Sản phẩm A", currentPrice: 2500000, stock: 50 },
  { id: 2, code: "SP002", name: "Sản phẩm B", currentPrice: 850000, stock: 120 },
  { id: 3, code: "SP003", name: "Sản phẩm C", currentPrice: 15000000, stock: 8 },
  { id: 4, code: "SP004", name: "Sản phẩm D", currentPrice: 3200000, stock: 35 },
];

function ExportPage() {
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [formData, setFormData] = useState({
    customer: "",
    note: "",
    invoice: "",
  });

  const addProduct = () => {
    setSelectedProducts([
      ...selectedProducts,
      { productId: "", quantity: 1, price: 0, name: "", maxStock: 0 },
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
        updated[index].maxStock = product.stock;
        updated[index].quantity = 1;
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedProducts.length === 0) {
      alert("Vui lòng thêm ít nhất 1 sản phẩm!");
      return;
    }

    // Kiểm tra tồn kho
    const invalidProducts = selectedProducts.filter(item => item.quantity > item.maxStock);
    if (invalidProducts.length > 0) {
      alert(`Một số sản phẩm vượt quá số lượng tồn kho!`);
      return;
    }
    
    const exportData = {
      customer: formData.customer,
      invoice: formData.invoice,
      note: formData.note,
      products: selectedProducts,
      total: calculateTotal(),
      date: new Date().toISOString().split("T")[0]
    };
    
    console.log("Dữ liệu xuất hàng:", exportData);
    alert("Tạo phiếu xuất hàng thành công!");
    
    // Reset form
    setSelectedProducts([]);
    setFormData({ customer: "", note: "", invoice: "" });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Xuất hàng</h1>
          <p className="text-gray-500">Tạo phiếu xuất hàng mới</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-xl">
          <FiUpload />
          <span className="font-medium">Phiếu xuất</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Thông tin khách hàng */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Thông tin khách hàng</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <FiUser className="inline mr-1" /> Khách hàng *
              </label>
              <input
                type="text"
                value={formData.customer}
                onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="VD: Nguyễn Văn A"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Số hóa đơn / Mã đơn
              </label>
              <input
                type="text"
                value={formData.invoice}
                onChange={(e) => setFormData({ ...formData, invoice: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="VD: DH001"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <FiCalendar className="inline mr-1" /> Ngày xuất
              </label>
              <input
                type="date"
                value={new Date().toISOString().split("T")[0]}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-600"
                readOnly
              />
            </div>
          </div>
        </div>

        {/* Danh sách sản phẩm */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Danh sách sản phẩm xuất</h2>
            <button
              type="button"
              onClick={addProduct}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
            >
              <FiPlus /> Thêm sản phẩm
            </button>
          </div>
          
          {selectedProducts.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <FiUpload className="mx-auto text-4xl mb-2 opacity-50" />
              <p>Chưa có sản phẩm nào. Click "Thêm sản phẩm" để bắt đầu.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {selectedProducts.map((item, index) => (
                <div key={index} className="flex gap-3 items-center p-4 bg-gray-50 rounded-xl">
                  <div className="flex-1 grid grid-cols-4 gap-3">
                    <div className="col-span-2">
                      <label className="block text-xs text-gray-500 mb-1">Sản phẩm</label>
                      <select
                        value={item.productId}
                        onChange={(e) => updateSelectedProduct(index, "productId", e.target.value)}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                        required
                      >
                        <option value="">Chọn sản phẩm</option>
                        {products.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.code} - {p.name} (Tồn: {p.stock})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">
                        Số lượng {item.maxStock > 0 && <span className="text-orange-600">(Tồn: {item.maxStock})</span>}
                      </label>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateSelectedProduct(index, "quantity", Number(e.target.value))}
                        min="1"
                        max={item.maxStock || 999999}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 outline-none text-sm ${
                          item.quantity > item.maxStock ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-blue-500'
                        }`}
                        placeholder="SL"
                        required
                      />
                      {item.quantity > item.maxStock && item.maxStock > 0 && (
                        <p className="text-xs text-red-600 mt-1">Vượt quá tồn kho!</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Giá bán</label>
                      <input
                        type="number"
                        value={item.price}
                        onChange={(e) => updateSelectedProduct(index, "price", Number(e.target.value))}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                        placeholder="Giá"
                        required
                      />
                    </div>
                  </div>
                  <div className="text-right min-w-[120px]">
                    <p className="text-xs text-gray-500">Thành tiền</p>
                    <p className="text-lg font-bold text-gray-800">{(item.price * item.quantity).toLocaleString()}đ</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeSelectedProduct(index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <FiX size={20} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Ghi chú */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <label className="block text-sm font-medium text-gray-700 mb-2">Ghi chú</label>
          <textarea
            value={formData.note}
            onChange={(e) => setFormData({ ...formData, note: e.target.value })}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            rows={4}
            placeholder="Ghi chú về đơn xuất này..."
          />
        </div>

        {/* Tổng tiền & Submit */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-sm text-gray-500">Tổng số lượng</p>
              <p className="text-2xl font-bold text-gray-800">
                {selectedProducts.reduce((sum, item) => sum + item.quantity, 0)} sản phẩm
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Tổng tiền</p>
              <p className="text-3xl font-bold text-blue-600">{calculateTotal().toLocaleString()}đ</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => {
                if (confirm("Bạn có chắc muốn hủy phiếu xuất này?")) {
                  setSelectedProducts([]);
                  setFormData({ customer: "", note: "", invoice: "" });
                }
              }}
              className="flex-1 px-6 py-3 border border-gray-200 rounded-xl font-medium hover:bg-gray-50 transition"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition flex items-center justify-center gap-2"
            >
              <FiUpload /> Tạo phiếu xuất hàng
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default ExportPage;