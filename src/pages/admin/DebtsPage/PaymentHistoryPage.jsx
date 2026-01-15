import React, { useState } from "react";
import { FiSearch, FiTrendingDown, FiFileText } from "react-icons/fi";

const initialDebts = [
  { 
    id: 1, 
    customer: "Công ty A", 
    payments: [
      { id: 1, date: "2025-01-10", amount: 10000000, method: "transfer", invoice: "HĐ001", note: "Thanh toán đợt 1" },
      { id: 2, date: "2025-01-15", amount: 10000000, method: "cash", invoice: "", note: "Tiền mặt" }
    ]
  },
  { 
    id: 2, 
    customer: "Nguyễn Văn B", 
    payments: []
  },
  { 
    id: 3, 
    customer: "Công ty C", 
    payments: [
      { id: 1, date: "2024-12-15", amount: 30000000, method: "transfer", invoice: "HĐ005", note: "Thanh toán full" }
    ]
  },
];

function PaymentHistoryPage() {
  const [debts] = useState(initialDebts);
  const [search, setSearch] = useState("");

  const getAllPaymentHistory = () => {
    const history = [];
    debts.forEach(debt => {
      debt.payments?.forEach(p => {
        history.push({
          ...p,
          customer: debt.customer,
          type: "payment"
        });
      });
    });
    return history.sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  const getCurrentMonthStats = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    let monthlyPaid = 0;
    debts.forEach(debt => {
      debt.payments?.forEach(p => {
        const paymentDate = new Date(p.date);
        if (paymentDate.getMonth() === currentMonth && paymentDate.getFullYear() === currentYear) {
          monthlyPaid += p.amount;
        }
      });
    });

    return monthlyPaid;
  };

  const getMethodLabel = (method) => {
    const labels = {
      cash: "Tiền mặt",
      transfer: "Chuyển khoản",
      card: "Thẻ"
    };
    return labels[method] || method;
  };

  const paymentHistory = getAllPaymentHistory();
  const monthlyPaid = getCurrentMonthStats();

  const filtered = paymentHistory.filter(
    (item) =>
      item.customer.toLowerCase().includes(search.toLowerCase()) ||
      String(item.amount).includes(search) ||
      item.invoice?.toLowerCase().includes(search.toLowerCase()) ||
      item.note?.toLowerCase().includes(search.toLowerCase()) ||
      getMethodLabel(item.method).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Lịch sử thanh toán</h1>
        <p className="text-gray-500">Theo dõi các khoản thanh toán đã thực hiện</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <FiTrendingDown className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Đã thu tháng này</p>
              <p className="text-xl font-bold text-gray-800">
                {monthlyPaid.toLocaleString()}đ
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <FiFileText className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Số lượng thanh toán</p>
              <p className="text-xl font-bold text-gray-800">
                {paymentHistory.length}
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
              placeholder="Tìm kiếm lịch sử thanh toán..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" 
            />
          </div>
        </div>
      </div>

      {/* History */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b">
          <h3 className="font-semibold text-gray-800">Lịch sử thanh toán</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr className="text-left text-sm text-gray-500">
                <th className="px-6 py-4 font-medium">Ngày</th>
                <th className="px-6 py-4 font-medium">Khách hàng</th>
                <th className="px-6 py-4 font-medium">Số tiền</th>
                <th className="px-6 py-4 font-medium">Phương thức</th>
                <th className="px-6 py-4 font-medium">Hóa đơn</th>
                <th className="px-6 py-4 font-medium">Ghi chú</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item, index) => (
                <tr key={index} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-4 text-gray-600">{item.date}</td>
                  <td className="px-6 py-4 font-medium text-gray-800">{item.customer}</td>
                  <td className="px-6 py-4 text-green-600 font-bold">+{item.amount.toLocaleString()}đ</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                      {getMethodLabel(item.method)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{item.invoice || "-"}</td>
                  <td className="px-6 py-4 text-gray-600">{item.note || "-"}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    Chưa có lịch sử thanh toán
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default PaymentHistoryPage;