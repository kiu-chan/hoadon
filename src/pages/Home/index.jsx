import React from "react";

function HeroSection() {
  return (
    <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white py-24">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h1 className="text-5xl font-bold mb-6 leading-tight">
          Giải Pháp Công Nghệ
          <br />
          <span className="text-yellow-300">Cho Tương Lai</span>
        </h1>
        <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
          Chúng tôi mang đến những giải pháp công nghệ tiên tiến, giúp doanh nghiệp của bạn phát triển vượt bậc trong kỷ nguyên số.
        </p>
        <div className="flex gap-4 justify-center">
          <a
            href="#about"
            className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:shadow-xl hover:scale-105 transition"
          >
            Tìm hiểu thêm
          </a>
          <a
            href="#contact"
            className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-blue-600 transition"
          >
            Liên hệ ngay
          </a>
        </div>
      </div>
    </section>
  );
}

function AboutSection() {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Về Chúng Tôi</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto"></div>
        </div>
        <div className="grid grid-cols-2 gap-16 items-center">
          <div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
              Đồng hành cùng sự phát triển của bạn
            </h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Với hơn 10 năm kinh nghiệm trong lĩnh vực công nghệ, chúng tôi tự hào là đối tác tin cậy của hàng trăm doanh nghiệp trong và ngoài nước.
            </p>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Đội ngũ chuyên gia của chúng tôi luôn cập nhật những xu hướng công nghệ mới nhất để mang đến cho khách hàng những giải pháp tối ưu và hiệu quả nhất.
            </p>
            <div className="flex gap-8">
              <div>
                <p className="text-4xl font-bold text-blue-600">500+</p>
                <p className="text-gray-500">Dự án hoàn thành</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-purple-600">200+</p>
                <p className="text-gray-500">Khách hàng</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-indigo-600">50+</p>
                <p className="text-gray-500">Chuyên gia</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl p-8 h-80 flex items-center justify-center">
            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-white text-5xl">🚀</span>
              </div>
              <p className="text-gray-600 font-medium">Đổi mới sáng tạo</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ServicesSection() {
  const services = [
    {
      icon: "💻",
      title: "Thiết kế Website",
      desc: "Thiết kế website chuyên nghiệp, responsive, tối ưu SEO và trải nghiệm người dùng.",
    },
    {
      icon: "📱",
      title: "Phát triển App",
      desc: "Xây dựng ứng dụng di động iOS và Android với hiệu năng cao và giao diện đẹp.",
    },
    {
      icon: "☁️",
      title: "Giải pháp Cloud",
      desc: "Triển khai hạ tầng đám mây an toàn, linh hoạt và tiết kiệm chi phí.",
    },
    {
      icon: "🔒",
      title: "Bảo mật",
      desc: "Đảm bảo an toàn thông tin với các giải pháp bảo mật tiên tiến nhất.",
    },
  ];

  return (
    <section id="services" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Dịch Vụ Của Chúng Tôi</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto"></div>
        </div>
        <div className="grid grid-cols-4 gap-6">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition group"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition">
                {service.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">{service.title}</h3>
              <p className="text-gray-600">{service.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactSection() {
  return (
    <section id="contact" className="py-20 bg-gradient-to-br from-blue-600 to-purple-600 text-white">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">Bắt Đầu Dự Án Của Bạn</h2>
        <p className="text-blue-100 mb-8 max-w-xl mx-auto">
          Hãy liên hệ với chúng tôi để được tư vấn miễn phí và nhận báo giá chi tiết cho dự án của bạn.
        </p>
        <a
          href="mailto:contact@mybrand.com"
          className="inline-block bg-white text-blue-600 px-10 py-4 rounded-full font-semibold hover:shadow-xl hover:scale-105 transition"
        >
          Liên hệ ngay
        </a>
      </div>
    </section>
  );
}

function Home() {
  return (
    <div>
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <ContactSection />
    </div>
  );
}

export default Home;