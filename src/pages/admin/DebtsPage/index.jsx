import React, { useState } from "react";
import { FiPlus, FiSearch, FiDollarSign, FiCheck, FiX, FiEye, FiFileText } from "react-icons/fi";

const initialDebts = [
  { 
    id: 1, 
    customer: "Công ty A", 
    totalDebt: 45200000,
    paid: 20000000,
    remaining: 25200000,
    dueDate: "2025-02-15", 
    status: "unpaid",
    payments: [
      { id: 1, date: "2025-01-10", amount: 10000000, method: "transfer", invoice: "HĐ001", note: "Thanh toán đợt 1" },
      { id: 2, date: "2025-01-15", amount: 10000000, method: "cash", invoice: "", note: "Tiền mặt" }
    ]
  },
  { 
    id: 2, 
    customer: "Nguyễn Văn B", 
    totalDebt: 1200000,
    paid: 0,
    remaining: 1200000,
    dueDate: "2025-01-30", 
    status: "unpaid",
    payments: []
  },
  { 
    id: 3, 
    customer: "Công ty C", 
    totalDebt: 30000000,
    paid: 30000000,
    remaining: 0,
    dueDate: "2024-12-01", 
    status: "paid",
    payments: [
      { id: 1, date: "2024-12-15", amount: 30000000, method: "transfer", invoice: "HĐ005", note: "Thanh toán full" }
    ]
  },
];

function DebtsPage() {
  const [debts, setDebts] = useState(initialDebts);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedDebt, setSelectedDebt] = useState(null);
  const [formData, setFormData] = useState({ customer: "", amount: 0, dueDate: "" });
  const [paymentData, setPaymentData] = useState({
    amount: 0,
    method: "cash",
    invoice: "",
    note: ""
  });

  const filtered = debts.filter(
    (d) =>
      d.customer.toLowerCase().includes(search.toLowerCase()) ||
      String(d.totalDebt).includes(search) ||
      String(d.remaining).includes(search)
  );

  const openPaymentModal = (debt) => {
    setSelectedDebt(debt);
    setPaymentData({
      amount: debt.remaining,
      method: "cash",
      invoice: "",
      note: ""
    });
    setShowPaymentModal(true);
  };

  const openDetailModal = (debt) => {
    setSelectedDebt(debt);
    setShowDetailModal(true);
  };

  const handlePayment = (e) => {
    e.preventDefault();
    const paymentAmount = Number(paymentData.amount);
    
    if (paymentAmount <= 0 || paymentAmount > selectedDebt.remaining) {
      alert("Số tiền thanh toán không hợp lệ!");
      return;
    }

    const newPayment = {
      id: Date.now(),
      date: new Date().toISOString().split("T")[0],
      amount: paymentAmount,
      method: paymentData.method,
      invoice: paymentData.invoice,
      note: paymentData.note
    };

    setDebts(debts.map((d) => {
      if (d.id === selectedDebt.id) {
        const newPaid = d.paid + paymentAmount;
        const newRemaining = d.totalDebt - newPaid;
        return {
          ...d,
          paid: newPaid,
          remaining: newRemaining,
          status: newRemaining === 0 ? "paid" : "unpaid",
          payments: [...d.payments, newPayment]
        };
      }
      return d;
    }));

    setShowPaymentModal(false);
  };

  const addDebt = (e) => {
    e.preventDefault();
    const amount = Number(formData.amount);
    const newDebt = { 
      id: Date.now(), 
      customer: formData.customer,
      totalDebt: amount,
      paid: 0,
      remaining: amount,
      dueDate: formData.dueDate,
      status: amount > 0 ? "unpaid" : "paid",
      payments: []
    };
    setDebts([newDebt, ...debts]);
    setShowModal(false);
  };

  const getStatusBadge = (remaining) => {
    if (remaining === 0) {
      return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium flex items-center gap-1"><FiCheck /> Đã thanh toán</span>;
    }
    return <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">Còn nợ</span>;
  };

  const getMethodLabel = (method) => {
    const labels = {
      cash: "Tiền mặt",
      transfer: "Chuyển khoản",
      card: "Thẻ"
    };
    return labels[method] || method;
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
          <button 
            onClick={() => { 
              setFormData({ customer: "", amount: 0, dueDate: "" }); 
              setShowModal(true); 
            }} 
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition"
          >
            <FiPlus /> Thêm công nợ
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <FiDollarSign className="text-red-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Tổng công nợ</p>
              <p className="text-xl font-bold text-gray-800">
                {debts.reduce((s, d) => s + d.totalDebt, 0).toLocaleString()}đ
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <FiCheck className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Đã thu</p>
              <p className="text-xl font-bold text-gray-800">
                {debts.reduce((s, d) => s + d.paid, 0).toLocaleString()}đ
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <FiDollarSign className="text-orange-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Còn lại</p>
              <p className="text-xl font-bold text-gray-800">
                {debts.reduce((s, d) => s + d.remaining, 0).toLocaleString()}đ
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Tìm kiếm công nợ..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" 
            />
          </div>
        </div>
      </div>

      {/* List */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr className="text-left text-sm text-gray-500">
                <th className="px-6 py-4 font-medium">Đối tác</th>
                <th className="px-6 py-4 font-medium">Tổng nợ</th>
                <th className="px-6 py-4 font-medium">Đã trả</th>
                <th className="px-6 py-4 font-medium">Còn lại</th>
                <th className="px-6 py-4 font-medium">Hạn trả</th>
                <th className="px-6 py-4 font-medium">Trạng thái</th>
                <th className="px-6 py-4 font-medium">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((d) => (
                <tr key={d.id} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-800">{d.customer}</td>
                  <td className="px-6 py-4 text-gray-800">{d.totalDebt.toLocaleString()}đ</td>
                  <td className="px-6 py-4 text-green-600 font-medium">{d.paid.toLocaleString()}đ</td>
                  <td className="px-6 py-4 text-red-600 font-bold">{d.remaining.toLocaleString()}đ</td>
                  <td className="px-6 py-4 text-gray-600">{d.dueDate}</td>
                  <td className="px-6 py-4">{getStatusBadge(d.remaining)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {d.remaining > 0 && (
                        <button 
                          onClick={() => openPaymentModal(d)} 
                          className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                        >
                          <FiDollarSign /> Thanh toán
                        </button>
                      )}
                      <button
                        onClick={() => openDetailModal(d)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        title="Xem chi tiết"
                      >
                        <FiEye />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    Không có mục công nợ
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Debt Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Thêm công nợ mới</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <FiX />
              </button>
            </div>
            <form onSubmit={addDebt} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Đối tác / Khách hàng</label>
                <input 
                  type="text" 
                  value={formData.customer} 
                  onChange={(e) => setFormData({ ...formData, customer: e.target.value })} 
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" 
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Số tiền (VNĐ)</label>
                <input 
                  type="number" 
                  value={formData.amount} 
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })} 
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" 
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hạn trả</label>
                <input 
                  type="date" 
                  value={formData.dueDate} 
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })} 
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" 
                />
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
                  Thêm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && selectedDebt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Thanh toán công nợ</h2>
              <button onClick={() => setShowPaymentModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <FiX />
              </button>
            </div>

            <div className="mb-4 p-4 bg-blue-50 rounded-xl">
              <p className="text-sm text-gray-600">Khách hàng: <span className="font-medium text-gray-800">{selectedDebt.customer}</span></p>
              <p className="text-sm text-gray-600">Tổng nợ: <span className="font-medium text-gray-800">{selectedDebt.totalDebt.toLocaleString()}đ</span></p>
              <p className="text-sm text-gray-600">Đã trả: <span className="font-medium text-green-600">{selectedDebt.paid.toLocaleString()}đ</span></p>
              <p className="text-sm text-gray-600">Còn lại: <span className="font-bold text-red-600">{selectedDebt.remaining.toLocaleString()}đ</span></p>
            </div>

            <form onSubmit={handlePayment} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Số tiền thanh toán</label>
                <input 
                  type="number" 
                  value={paymentData.amount} 
                  onChange={(e) => setPaymentData({ ...paymentData, amount: e.target.value })} 
                  max={selectedDebt.remaining}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" 
                  required 
                />
                <p className="text-xs text-gray-500 mt-1">Tối đa: {selectedDebt.remaining.toLocaleString()}đ</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phương thức</label>
                <select
                  value={paymentData.method}
                  onChange={(e) => setPaymentData({ ...paymentData, method: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="cash">Tiền mặt</option>
                  <option value="transfer">Chuyển khoản</option>
                  <option value="card">Thẻ</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Số hóa đơn / Mã GD</label>
                <input 
                  type="text" 
                  value={paymentData.invoice} 
                  onChange={(e) => setPaymentData({ ...paymentData, invoice: e.target.value })} 
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" 
                  placeholder="VD: HĐ001, GD123456"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú</label>
                <textarea
                  value={paymentData.note}
                  onChange={(e) => setPaymentData({ ...paymentData, note: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  rows={3}
                  placeholder="Ghi chú về khoản thanh toán này..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setShowPaymentModal(false)} 
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-xl font-medium hover:bg-gray-50 transition"
                >
                  Hủy
                </button>
                <button 
                  type="submit" 
                  className="flex-1 px-4 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition"
                >
                  Xác nhận thanh toán
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedDebt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Chi tiết công nợ</h2>
              <button onClick={() => setShowDetailModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <FiX />
              </button>
            </div>

            <div className="mb-6 p-4 bg-gray-50 rounded-xl">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Khách hàng</p>
                  <p className="font-medium text-gray-800">{selectedDebt.customer}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Hạn trả</p>
                  <p className="font-medium text-gray-800">{selectedDebt.dueDate}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Tổng công nợ</p>
                  <p className="text-lg font-bold text-gray-800">{selectedDebt.totalDebt.toLocaleString()}đ</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Đã thanh toán</p>
                  <p className="text-lg font-bold text-green-600">{selectedDebt.paid.toLocaleString()}đ</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Còn lại</p>
                  <p className="text-lg font-bold text-red-600">{selectedDebt.remaining.toLocaleString()}đ</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Trạng thái</p>
                  {getStatusBadge(selectedDebt.remaining)}
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FiFileText /> Lịch sử thanh toán ({selectedDebt.payments.length})
              </h3>
              {selectedDebt.payments.length === 0 ? (
                <div className="text-center text-gray-500 py-8">Chưa có khoản thanh toán nào</div>
              ) : (
                <div className="space-y-3">
                  {selectedDebt.payments.map((payment) => (
                    <div key={payment.id} className="p-4 border border-gray-200 rounded-xl hover:bg-gray-50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm text-gray-500">{payment.date}</span>
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                              {getMethodLabel(payment.method)}
                            </span>
                            {payment.invoice && (
                              <span className="text-xs text-gray-500">#{payment.invoice}</span>
                            )}
                          </div>
                          {payment.note && (
                            <p className="text-sm text-gray-600">{payment.note}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-green-600">
                            +{payment.amount.toLocaleString()}đ
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-6 border-t mt-6">
              <button 
                onClick={() => setShowDetailModal(false)} 
                className="flex-1 px-4 py-3 border border-gray-200 rounded-xl font-medium hover:bg-gray-50 transition"
              >
                Đóng
              </button>
              {selectedDebt.remaining > 0 && (
                <button 
                  onClick={() => {
                    setShowDetailModal(false);
                    openPaymentModal(selectedDebt);
                  }}
                  className="flex-1 px-4 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition flex items-center justify-center gap-2"
                >
                  <FiDollarSign /> Thanh toán
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DebtsPage;