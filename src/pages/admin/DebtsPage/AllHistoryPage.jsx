import React, { useState } from "react";
import { FiSearch, FiCalendar, FiTrendingUp, FiTrendingDown } from "react-icons/fi";

const initialDebts = [
  { 
    id: 1, 
    customer: "Công ty A", 
    payments: [
      { id: 1, date: "2025-01-10", amount: 10000000, method: "transfer", invoice: "HĐ001", note: "Thanh toán đợt 1" },
      { id: 2, date: "2025-01-15", amount: 10000000, method: "cash", invoice: "", note: "Tiền mặt" }
    ],
    debts: [
      { id: 1, date: "2025-01-05", amount: 45200000, invoice: "HĐ001", note: "Đơn hàng tháng 1" }
    ]
  },
  { 
    id: 2, 
    customer: "Nguyễn Văn B", 
    payments: [],
    debts: [
      { id: 1, date: "2025-01-12", amount: 1200000, invoice: "HĐ002", note: "Mua hàng" }
    ]
  },
  { 
    id: 3, 
    customer: "Công ty C", 
    payments: [
      { id: 1, date: "2024-12-15", amount: 30000000, method: "transfer", invoice: "HĐ005", note: "Thanh toán full" }
    ],
    debts: [
      { id: 1, date: "2024-12-01", amount: 30000000, invoice: "HĐ003", note: "Đơn hàng tháng 12" }
    ]
  },
];

function AllHistoryPage() {
  const [debts] = useState(initialDebts);
  const [search, setSearch] = useState("");

  const getAllDebtHistory = () => {
    const history = [];
    debts.forEach(debt => {
      debt.debts?.forEach(d => {
        history.push({
          ...d,
          customer: debt.customer,
          type: "debt"
        });
      });
    });
    return history.sort((a, b) => new Date(b.date) - new Date(a.date));
  };

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

  const getAllHistory = () => {
    const debtHistory = getAllDebtHistory();
    const paymentHistory = getAllPaymentHistory();
    return [...debtHistory, ...paymentHistory].sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  const getMethodLabel = (method) => {
    const labels = {
      cash: "Tiền mặt",
      transfer: "Chuyển khoản",
      card: "Thẻ"
    };
    return labels[method] || method;
  };

  const allHistory = getAllHistory();

  const filtered = allHistory.filter(
    (item) =>
      item.customer.toLowerCase().includes(search.toLowerCase()) ||
      String(item.amount).includes(search) ||
      item.invoice?.toLowerCase().includes(search.toLowerCase()) ||
      item.note?.toLowerCase().includes(search.toLowerCase()) ||
      (item.method && getMethodLabel(item.method).toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Lịch sử tổng hợp</h1>
        <p className="text-gray-500">Theo dõi toàn bộ giao dịch nợ và thanh toán</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <FiCalendar className="text-purple-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Tổng giao dịch</p>
              <p className="text-xl font-bold text-gray-800">
                {allHistory.length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <FiTrendingUp className="text-red-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Lần ghi nợ</p>
              <p className="text-xl font-bold text-gray-800">
                {allHistory.filter(h => h.type === 'debt').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <FiTrendingDown className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Lần thanh toán</p>
              <p className="text-xl font-bold text-gray-800">
                {allHistory.filter(h => h.type === 'payment').length}
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
              placeholder="Tìm kiếm lịch sử..." 
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
          <h3 className="font-semibold text-gray-800">Lịch sử tổng hợp</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr className="text-left text-sm text-gray-500">
                <th className="px-6 py-4 font-medium">Ngày</th>
                <th className="px-6 py-4 font-medium">Loại</th>
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
                  <td className="px-6 py-4">
                    {item.type === 'debt' ? (
                      <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">Ghi nợ</span>
                    ) : (
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">Thanh toán</span>
                    )}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-800">{item.customer}</td>
                  <td className={`px-6 py-4 font-bold ${item.type === 'debt' ? 'text-red-600' : 'text-green-600'}`}>
                    {item.type === 'debt' ? '+' : '+'}{item.amount.toLocaleString()}đ
                  </td>
                  <td className="px-6 py-4">
                    {item.method ? (
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                        {getMethodLabel(item.method)}
                      </span>
                    ) : '-'}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{item.invoice || "-"}</td>
                  <td className="px-6 py-4 text-gray-600">{item.note || "-"}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    Chưa có lịch sử giao dịch
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

export default AllHistoryPage;