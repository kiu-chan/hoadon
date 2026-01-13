import React from "react";

function Header() {
  return (
    <header className="bg-white/95 backdrop-blur-sm shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <a href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          MyBrand
        </a>
        <nav className="flex items-center gap-8">
          <a href="/" className="text-gray-700 hover:text-blue-600 transition font-medium">
            Trang chủ
          </a>
          <a href="#about" className="text-gray-700 hover:text-blue-600 transition font-medium">
            Giới thiệu
          </a>
          <a href="#services" className="text-gray-700 hover:text-blue-600 transition font-medium">
            Dịch vụ
          </a>
          <a href="#contact" className="text-gray-700 hover:text-blue-600 transition font-medium">
            Liên hệ
          </a>
          <a
            href="/login"
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-5 py-2 rounded-full hover:shadow-lg hover:scale-105 transition font-medium"
          >
            Đăng nhập
          </a>
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
              MyBrand
            </h3>
            <p className="text-gray-400">
              Giải pháp công nghệ hàng đầu cho doanh nghiệp của bạn.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Liên kết</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/" className="hover:text-white transition">Trang chủ</a></li>
              <li><a href="#about" className="hover:text-white transition">Giới thiệu</a></li>
              <li><a href="#services" className="hover:text-white transition">Dịch vụ</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Dịch vụ</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition">Thiết kế web</a></li>
              <li><a href="#" className="hover:text-white transition">Phát triển app</a></li>
              <li><a href="#" className="hover:text-white transition">Tư vấn IT</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Liên hệ</h4>
            <ul className="space-y-2 text-gray-400">
              <li>contact@mybrand.com</li>
              <li>0123 456 789</li>
              <li>Hà Nội, Việt Nam</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
          <p>&copy; 2025 MyBrand. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

function DefaultLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

export default DefaultLayout;