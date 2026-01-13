import React, { useState } from "react";
import { FiPlus, FiSearch, FiEdit2, FiTrash2, FiToggleLeft, FiToggleRight } from "react-icons/fi";

const initialPromos = [
  { id: 1, code: "XMAS2025", description: "Giảm 10% toàn bộ đơn", discount: 10, start: "2025-12-01", end: "2025-12-31", active: true },
  { id: 2, code: "WELCOME", description: "Giảm 5% cho đơn hàng đầu", discount: 5, start: "2025-01-01", end: "2026-01-01", active: true },
];

function PromotionsPage() {
  const [promos, setPromos] = useState(initialPromos);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editPromo, setEditPromo] = useState(null);
  const [formData, setFormData] = useState({ code: "", description: "", discount: 0, start: "", end: "", active: true });

  const filtered = promos.filter(
    (p) =>
      p.code.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => {
    setEditPromo(null);
    setFormData({ code: "", description: "", discount: 0, start: "", end: "", active: true });
    setShowModal(true);
  };

  const openEdit = (p) => {
    setEditPromo(p);
    setFormData({ code: p.code, description: p.description, discount: p.discount, start: p.start, end: p.end, active: p.active });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (confirm("Bạn có chắc muốn xóa khuyến mãi này?")) {
      setPromos(promos.filter((p) => p.id !== id));
    }
  };

  const toggleActive = (id) => {
    setPromos(promos.map((p) => (p.id === id ? { ...p, active: !p.active } : p)));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editPromo) {
      setPromos(promos.map((p) => (p.id === editPromo.id ? { ...p, ...formData, discount: Number(formData.discount) } : p)));
    } else {
      const newPromo = { id: Date.now(), ...formData, discount: Number(formData.discount) };
      setPromos([newPromo, ...promos]);
    }
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Quản lý khuyến mãi</h1>
          <p className="text-gray-500">Tổng cộng {promos.length} chương trình</p>
        </div>
        <div className="flex gap-3">
          <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition">
            <FiPlus /> Tạo khuyến mãi
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Tìm kiếm khuyến mãi..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
        </div>
      </div>

      {/* List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((p) => (
          <div key={p.id} className="bg-white rounded-2xl p-4 shadow-sm flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">{p.code} • {p.discount}%</p>
              <p className="text-lg font-medium text-gray-800">{p.description}</p>
              <p className="text-xs text-gray-400">Từ {p.start} tới {p.end}</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => toggleActive(p.id)} className="p-2 rounded-lg hover:bg-gray-100">
                {p.active ? <FiToggleRight className="text-green-600" /> : <FiToggleLeft className="text-gray-400" />}
              </button>
              <button onClick={() => openEdit(p)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"><FiEdit2 /></button>
              <button onClick={() => handleDelete(p.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"><FiTrash2 /></button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full bg-white rounded-2xl p-6 text-center text-gray-500">Không có chương trình phù hợp</div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800">{editPromo ? "Sửa khuyến mãi" : "Tạo khuyến mãi"}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mã khuyến mãi</label>
                <input type="text" value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                <input type="text" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Giảm (%)</label>
                  <input type="number" value={formData.discount} onChange={(e) => setFormData({ ...formData, discount: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bắt đầu</label>
                  <input type="date" value={formData.start} onChange={(e) => setFormData({ ...formData, start: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kết thúc</label>
                  <input type="date" value={formData.end} onChange={(e) => setFormData({ ...formData, end: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input id="active" type="checkbox" checked={formData.active} onChange={(e) => setFormData({ ...formData, active: e.target.checked })} className="h-4 w-4" />
                <label htmlFor="active" className="text-sm text-gray-700">Kích hoạt</label>
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-3 border border-gray-200 rounded-xl font-medium hover:bg-gray-50 transition">Hủy</button>
                <button type="submit" className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition">{editPromo ? "Cập nhật" : "Tạo"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default PromotionsPage;