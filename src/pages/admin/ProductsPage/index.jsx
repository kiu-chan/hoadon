import React, { useState } from "react";
import {
  FiPlus,
  FiSearch,
  FiEdit2,
  FiTrash2,
  FiFilter,
  FiPrinter,
  FiX,
} from "react-icons/fi";

const initialProducts = [
  { 
    id: 1, 
    code: "SP001", 
    name: "Sản phẩm A", 
    category: "Điện tử", 
    priceLevels: [
      { minQty: 1, price: 2500000, stock: 30 },
      { minQty: 5, price: 2300000, stock: 20 }
    ],
    status: "active" 
  },
  { 
    id: 2, 
    code: "SP002", 
    name: "Sản phẩm B", 
    category: "Thời trang", 
    priceLevels: [
      { minQty: 1, price: 850000, stock: 120 }
    ],
    status: "active" 
  },
  { 
    id: 3, 
    code: "SP003", 
    name: "Sản phẩm C", 
    category: "Điện tử", 
    priceLevels: [
      { minQty: 1, price: 15000000, stock: 8 }
    ],
    status: "low" 
  },
];

function ProductsPage() {
  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [expandedProduct, setExpandedProduct] = useState(null);
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    category: "",
    priceLevels: [{ minQty: 1, price: 0, stock: 0 }]
  });

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.code.toLowerCase().includes(search.toLowerCase())
  );

  const getTotalStock = (priceLevels) => {
    return priceLevels.reduce((sum, level) => sum + level.stock, 0);
  };

  const getPriceRange = (priceLevels) => {
    if (priceLevels.length === 0) return { min: 0, max: 0 };
    const prices = priceLevels.map(l => l.price);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices)
    };
  };

  const getProductStatus = (priceLevels) => {
    const total = getTotalStock(priceLevels);
    if (total === 0) return "out";
    if (total <= 10) return "low";
    return "active";
  };

  const handleAdd = () => {
    setEditProduct(null);
    setFormData({ 
      code: "", 
      name: "", 
      category: "", 
      priceLevels: [{ minQty: 1, price: 0, stock: 0 }]
    });
    setShowModal(true);
  };

  const handleEdit = (product) => {
    setEditProduct(product);
    setFormData({
      code: product.code,
      name: product.name,
      category: product.category,
      priceLevels: [...product.priceLevels]
    });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (confirm("Bạn có chắc muốn xóa sản phẩm này?")) {
      setProducts(products.filter((p) => p.id !== id));
    }
  };

  const addPriceLevel = () => {
    setFormData({
      ...formData,
      priceLevels: [...formData.priceLevels, { minQty: 1, price: 0, stock: 0 }]
    });
  };

  const removePriceLevel = (index) => {
    const newLevels = formData.priceLevels.filter((_, i) => i !== index);
    setFormData({ ...formData, priceLevels: newLevels });
  };

  const updatePriceLevel = (index, field, value) => {
    const newLevels = [...formData.priceLevels];
    newLevels[index][field] = Number(value);
    setFormData({ ...formData, priceLevels: newLevels });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const productData = {
      ...formData,
      priceLevels: formData.priceLevels.sort((a, b) => a.minQty - b.minQty),
      status: getProductStatus(formData.priceLevels)
    };

    if (editProduct) {
      setProducts(
        products.map((p) =>
          p.id === editProduct.id ? { ...p, ...productData } : p
        )
      );
    } else {
      setProducts([...products, { id: Date.now(), ...productData }]);
    }
    setShowModal(false);
  };

  const getStatusBadge = (status) => {
    const styles = {
      active: "bg-green-100 text-green-700",
      low: "bg-yellow-100 text-yellow-700",
      out: "bg-red-100 text-red-700",
    };
    const labels = {
      active: "Còn hàng",
      low: "Sắp hết",
      out: "Hết hàng",
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Quản lý sản phẩm</h1>
          <p className="text-gray-500">Tổng cộng {products.length} sản phẩm</p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition"
        >
          <FiPlus /> Thêm sản phẩm
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition">
            <FiFilter /> Lọc
          </button>
          <button className="flex items-center gap-2 px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition">
            <FiPrinter /> In danh sách
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr className="text-left text-sm text-gray-500">
                <th className="px-6 py-4 font-medium">Mã SP</th>
                <th className="px-6 py-4 font-medium">Tên sản phẩm</th>
                <th className="px-6 py-4 font-medium">Danh mục</th>
                <th className="px-6 py-4 font-medium">Các mức giá</th>
                <th className="px-6 py-4 font-medium">Tổng tồn</th>
                <th className="px-6 py-4 font-medium">Trạng thái</th>
                <th className="px-6 py-4 font-medium">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-800">{product.code}</td>
                  <td className="px-6 py-4 text-gray-800">{product.name}</td>
                  <td className="px-6 py-4 text-gray-600">{product.category}</td>
                  <td className="px-6 py-4">
                    {product.priceLevels.length === 1 ? (
                      <div className="text-sm">
                        <span className="font-medium text-gray-800">{product.priceLevels[0].price.toLocaleString()}đ</span>
                        <span className="text-gray-400 text-xs"> ({product.priceLevels[0].stock} sp)</span>
                      </div>
                    ) : (
                      <div className="relative">
                        <button
                          onClick={() => setExpandedProduct(expandedProduct === product.id ? null : product.id)}
                          className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition text-sm"
                        >
                          <span className="font-medium">
                            {getPriceRange(product.priceLevels).min.toLocaleString()}đ - {getPriceRange(product.priceLevels).max.toLocaleString()}đ
                          </span>
                          <svg 
                            className={`w-4 h-4 transition-transform ${expandedProduct === product.id ? 'rotate-180' : ''}`} 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        {expandedProduct === product.id && (
                          <div className="absolute left-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-10 min-w-[240px]">
                            <div className="space-y-2">
                              {product.priceLevels.map((level, idx) => (
                                <div key={idx} className="text-xs pb-2 border-b last:border-0 last:pb-0">
                                  <div className="flex justify-between items-center">
                                    <span className="text-gray-500">Từ {level.minQty} sp:</span>
                                    <span className="font-medium text-gray-800">{level.price.toLocaleString()}đ</span>
                                  </div>
                                  <div className="text-gray-400 mt-0.5">Tồn kho: {level.stock} sp</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-gray-600 font-medium">{getTotalStock(product.priceLevels)}</td>
                  <td className="px-6 py-4">{getStatusBadge(product.status)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      >
                        <FiEdit2 />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                {editProduct ? "Sửa sản phẩm" : "Thêm sản phẩm"}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <FiX />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mã sản phẩm</label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  >
                    <option value="">Chọn danh mục</option>
                    <option value="Điện tử">Điện tử</option>
                    <option value="Thời trang">Thời trang</option>
                    <option value="Gia dụng">Gia dụng</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tên sản phẩm</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">Các mức giá bán</label>
                  <button
                    type="button"
                    onClick={addPriceLevel}
                    className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
                  >
                    <FiPlus /> Thêm mức giá
                  </button>
                </div>
                <div className="space-y-3 bg-gray-50 p-4 rounded-xl">
                  {formData.priceLevels.map((level, index) => (
                    <div key={index} className="flex gap-3 items-start bg-white p-3 rounded-lg">
                      <div className="flex-1 grid grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Từ SL</label>
                          <input
                            type="number"
                            value={level.minQty}
                            onChange={(e) => updatePriceLevel(index, "minQty", e.target.value)}
                            min="1"
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Giá bán</label>
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
                          <label className="block text-xs text-gray-500 mb-1">Tồn kho</label>
                          <input
                            type="number"
                            value={level.stock}
                            onChange={(e) => updatePriceLevel(index, "stock", e.target.value)}
                            min="0"
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                            required
                          />
                        </div>
                      </div>
                      {formData.priceLevels.length > 1 && (
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
                  * Mức giá sẽ được áp dụng theo số lượng mua. VD: Từ 1-4 sp: giá A, từ 5 sp trở lên: giá B
                </p>
              </div>

              <div className="flex gap-3 pt-4">
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
                  {editProduct ? "Cập nhật" : "Thêm mới"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductsPage;