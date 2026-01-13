// routes/index.jsx
import Home from "../pages/Home/index";
import LoginPage from "../pages/account/LoginPage";
import AdminDashboard from "../pages/admin/AdminDashboard/index.jsx";
import InventoryPage from "../pages/admin/InventoryPage/index.jsx";
import OrdersPage from "../pages/admin/OrdersPage/index.jsx";
import ProductsPage from "../pages/admin/ProductsPage/index.jsx";
import DefaultLayout from "../components/Layout/DefaultLayout";
import AdminLayout from "../components/adminLayout/AdminLayout";

// Routes công khai
const publicRoutes = [
  {
    path: "/",
    component: Home,
    layout: DefaultLayout,
  },
  {
    path:  "/login",
    component: LoginPage,
    layout: DefaultLayout,
  },
];

// Routes yêu cầu đăng nhập và quyền admin
const privateRoutes = [
  {
    path: "/admin",
    component: AdminDashboard,
    layout: AdminLayout,
  },
  {
    path: "/admin/inventory",
    component: InventoryPage,
    layout: AdminLayout,
  },
  {
    path: "/admin/orders",
    component: OrdersPage,
    layout: AdminLayout,
  },
  {
    path: "/admin/products",
    component: ProductsPage,
    layout: AdminLayout,
  },
];

export { publicRoutes, privateRoutes };