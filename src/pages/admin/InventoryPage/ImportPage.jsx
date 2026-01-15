import React, { useState } from "react";
import { FiDownload, FiPlus, FiX, FiCalendar, FiUser } from "react-icons/fi";

const products = [
  { id: 1, code: "SP001", name: "Sản phẩm A", currentPrice: 2500000 },
  { id: 2, code: "SP002", name: "Sản phẩm B", currentPrice: 850000 },
  { id: 3, code: "SP003", name: "Sản phẩm C", currentPrice: 15000000 },
  { id: 4, code: "SP004", name: "Sản phẩm D", currentPrice: 3200000 },
];

function ImportPage() {
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [importPriceLevels, setImportPriceLevels] = useState([
    { fromQty: 1, toQty: null, price: 0, discount: 0 }
  ]);
  const [formData, setFormData] = useState({
    supplier: "",
    note: "",
    invoice: "",
  });

  const addProduct = () => {
    setSelectedProducts([
      ...selectedProducts,
      { productId: "", quantity: 1, price: 0, name: "" },
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
    if (selectedProducts.length === 0) {
      alert("Vui lòng thêm ít nhất 1 sản phẩm!");
      return;
    }
    
    const importData = {
      supplier: formData.supplier,
      invoice: formData.invoice,
      note: formData.note,
      products: selectedProducts,
      priceLevels: importPriceLevels,
      total: calculateTotal(),
      date: new Date().toISOString().split("T")[0]
    };
    
    console.log("Dữ liệu nhập hàng:", importData);
    alert("Tạo phiếu nhập hàng thành công!");
    
    // Reset form
    setSelectedProducts([]);
    setImportPriceLevels([{ fromQty: 1, toQty: null, price: 0, discount: 0 }]);
    setFormData({ supplier: "", note: "", invoice: "" });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Nhập hàng</h1>
          <p className="text-gray-500">Tạo phiếu nhập hàng mới</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-xl">
          <FiDownload />
          <span className="font-medium">Phiếu nhập</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Thông tin nhà cung cấp */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Thông tin nhà cung cấp</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <FiUser className="inline mr-1" /> Nhà cung cấp *
              </label>
              <input
                type="text"
                value={formData.supplier}
                onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                placeholder="VD: Công ty ABC"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Số hóa đơn / Mã GD
              </label>
              <input
                type="text"
                value={formData.invoice}
                onChange={(e) => setFormData({ ...formData, invoice: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                placeholder="VD: HĐ001"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <FiCalendar className="inline mr-1" /> Ngày nhập
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

        {/* Bảng giá nhập */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Bảng giá nhập theo số lượng / chiết khấu</h2>
            <button
              type="button"
              onClick={addPriceLevel}
              className="flex items-center gap-1 text-sm text-green-600 hover:text-green-700"
            >
              <FiPlus /> Thêm mức giá
            </button>
          </div>
          <div className="space-y-3">
            {importPriceLevels.map((level, index) => (
              <div key={index} className="flex gap-3 items-start bg-gray-50 p-4 rounded-xl">
                <div className="flex-1 grid grid-cols-5 gap-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Từ SL</label>
                    <input
                      type="number"
                      value={level.fromQty || ''}
                      onChange={(e) => updatePriceLevel(index, "fromQty", e.target.value)}
                      min="1"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-sm"
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
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Giá nhập (VNĐ)</label>
                    <input
                      type="number"
                      value={level.price}
                      onChange={(e) => updatePriceLevel(index, "price", e.target.value)}
                      min="0"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Chiết khấu (%)</label>
                    <input
                      type="number"
                      value={level.discount}
                      onChange={(e) => updatePriceLevel(index, "discount", e.target.value)}
                      min="0"
                      max="100"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Giá cuối cùng</label>
                    <input
                      type="text"
                      value={(level.finalPrice || level.price * (1 - level.discount / 100)).toLocaleString()}
                      readOnly
                      className="w-full px-3 py-2 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700 font-medium"
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
          <p className="text-xs text-gray-500 mt-3">
            * Nhập giá theo số lượng hoặc % chiết khấu. Để trống "Đến SL" nếu không giới hạn.
          </p>
        </div>

        {/* Danh sách sản phẩm */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Danh sách sản phẩm nhập</h2>
            <button
              type="button"
              onClick={addProduct}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition"
            >
              <FiPlus /> Thêm sản phẩm
            </button>
          </div>
          
          {selectedProducts.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <FiDownload className="mx-auto text-4xl mb-2 opacity-50" />
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
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-sm"
                        required
                      >
                        <option value="">Chọn sản phẩm</option>
                        {products.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.code} - {p.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Số lượng</label>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateSelectedProduct(index, "quantity", Number(e.target.value))}
                        min="1"
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-sm"
                        placeholder="SL"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Giá nhập</label>
                      <input
                        type="number"
                        value={item.price}
                        onChange={(e) => updateSelectedProduct(index, "price", Number(e.target.value))}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-sm"
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
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
            rows={4}
            placeholder="Ghi chú về lô hàng này..."
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
              <p className="text-sm text-gray-500">Tổng tiền nhập</p>
              <p className="text-3xl font-bold text-green-600">{calculateTotal().toLocaleString()}đ</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => {
                if (confirm("Bạn có chắc muốn hủy phiếu nhập này?")) {
                  setSelectedProducts([]);
                  setImportPriceLevels([{ fromQty: 1, toQty: null, price: 0, discount: 0 }]);
                  setFormData({ supplier: "", note: "", invoice: "" });
                }
              }}
              className="flex-1 px-6 py-3 border border-gray-200 rounded-xl font-medium hover:bg-gray-50 transition"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition flex items-center justify-center gap-2"
            >
              <FiDownload /> Tạo phiếu nhập hàng
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default ImportPage;