import React, { useState } from "react";
import { FiSearch, FiTrendingUp, FiFileText } from "react-icons/fi";

const initialDebts = [
  { 
    id: 1, 
    customer: "Công ty A", 
    totalDebt: 45200000,
    paid: 20000000,
    remaining: 25200000,
    debts: [
      { id: 1, date: "2025-01-05", amount: 45200000, invoice: "HĐ001", note: "Đơn hàng tháng 1" }
    ]
  },
  { 
    id: 2, 
    customer: "Nguyễn Văn B", 
    totalDebt: 1200000,
    paid: 0,
    remaining: 1200000,
    debts: [
      { id: 1, date: "2025-01-12", amount: 1200000, invoice: "HĐ002", note: "Mua hàng" }
    ]
  },
  { 
    id: 3, 
    customer: "Công ty C", 
    totalDebt: 30000000,
    paid: 30000000,
    remaining: 0,
    debts: [
      { id: 1, date: "2024-12-01", amount: 30000000, invoice: "HĐ003", note: "Đơn hàng tháng 12" }
    ]
  },
];

function DebtHistoryPage() {
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

  const debtHistory = getAllDebtHistory();
  const totalCurrentDebt = debts.reduce((s, d) => s + d.remaining, 0);

  const filtered = debtHistory.filter(
    (item) =>
      item.customer.toLowerCase().includes(search.toLowerCase()) ||
      String(item.amount).includes(search) ||
      item.invoice?.toLowerCase().includes(search.toLowerCase()) ||
      item.note?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Lịch sử ghi nợ</h1>
        <p className="text-gray-500">Theo dõi các khoản nợ đã phát sinh</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <FiTrendingUp className="text-red-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Tổng nợ hiện tại</p>
              <p className="text-xl font-bold text-gray-800">
                {totalCurrentDebt.toLocaleString()}đ
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <FiFileText className="text-orange-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Số lượng ghi nợ</p>
              <p className="text-xl font-bold text-gray-800">
                {debtHistory.length}
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
              placeholder="Tìm kiếm lịch sử nợ..." 
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
          <h3 className="font-semibold text-gray-800">Lịch sử ghi nợ</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr className="text-left text-sm text-gray-500">
                <th className="px-6 py-4 font-medium">Ngày</th>
                <th className="px-6 py-4 font-medium">Khách hàng</th>
                <th className="px-6 py-4 font-medium">Số tiền</th>
                <th className="px-6 py-4 font-medium">Hóa đơn</th>
                <th className="px-6 py-4 font-medium">Ghi chú</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item, index) => (
                <tr key={index} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-4 text-gray-600">{item.date}</td>
                  <td className="px-6 py-4 font-medium text-gray-800">{item.customer}</td>
                  <td className="px-6 py-4 text-red-600 font-bold">+{item.amount.toLocaleString()}đ</td>
                  <td className="px-6 py-4 text-gray-600">{item.invoice || "-"}</td>
                  <td className="px-6 py-4 text-gray-600">{item.note || "-"}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    Chưa có lịch sử ghi nợ
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

export default DebtHistoryPage;