import React, { useState } from "react";
import { FiPlus, FiSearch, FiDollarSign, FiCheck, FiX } from "react-icons/fi";

const initialDebts = [
  { id: 1, customer: "Công ty A", amount: 45200000, dueDate: "2025-02-15", status: "unpaid" },
  { id: 2, customer: "Nguyễn Văn B", amount: 1200000, dueDate: "2025-01-30", status: "unpaid" },
  { id: 3, customer: "Công ty C", amount: 0, dueDate: "2024-12-01", status: "paid" },
];

function DebtsPage() {
  const [debts, setDebts] = useState(initialDebts);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ customer: "", amount: 0, dueDate: "" });

  const filtered = debts.filter(
    (d) =>
      d.customer.toLowerCase().includes(search.toLowerCase()) ||
      String(d.amount).includes(search)
  );

  const markPaid = (id) => {
    setDebts(debts.map((d) => (d.id === id ? { ...d, status: "paid", amount: 0 } : d)));
  };

  const addDebt = (e) => {
    e.preventDefault();
    const newDebt = { id: Date.now(), ...formData, amount: Number(formData.amount), status: Number(formData.amount) > 0 ? "unpaid" : "paid" };
    setDebts([newDebt, ...debts]);
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Quản lý công nợ</h1>
          <p className="text-gray-500">Tổng {debts.length} mục công nợ</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => { setFormData({ customer: "", amount: 0, dueDate: "" }); setShowModal(true); }} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition">
            <FiPlus /> Thêm công nợ
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Tìm kiếm công nợ..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
        </div>
      </div>

      {/* List */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <div className="space-y-3">
          {filtered.map((d) => (
            <div key={d.id} className="flex items-center justify-between gap-4 p-3 bg-gray-50 rounded-xl">
              <div>
                <p className="font-medium text-gray-800">{d.customer}</p>
                <p className="text-sm text-gray-500">Hạn: {d.dueDate}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-red-600">{d.amount.toLocaleString()}đ</p>
                <div className="flex items-center gap-2 mt-2">
                  {d.status === "unpaid" ? (
                    <button onClick={() => markPaid(d.id)} className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg">
                      <FiCheck /> Đánh dấu đã trả
                    </button>
                  ) : (
                    <span className="px-3 py-2 bg-green-100 text-green-700 rounded-full text-sm flex items-center gap-2"><FiDollarSign /> Đã trả</span>
                  )}
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && <div className="text-center text-gray-500 p-6">Không có mục công nợ</div>}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Thêm công nợ mới</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">✕</button>
            </div>
            <form onSubmit={addDebt} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Đối tác / Khách hàng</label>
                <input type="text" value={formData.customer} onChange={(e) => setFormData({ ...formData, customer: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Số tiền (VNĐ)</label>
                <input type="number" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hạn trả</label>
                <input type="date" value={formData.dueDate} onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-3 border border-gray-200 rounded-xl font-medium hover:bg-gray-50 transition">Hủy</button>
                <button type="submit" className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition">Thêm</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default DebtsPage;