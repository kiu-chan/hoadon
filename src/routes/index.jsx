import Home from "../pages/Home/index";
import LoginPage from "../pages/account/LoginPage";
import AdminDashboard from "../pages/admin/AdminDashboard/index.jsx";
import InventoryPage from "../pages/admin/InventoryPage/index.jsx";
import ExportPage from "../pages/admin/InventoryPage/ExportPage.jsx";
import ImportPage from "../pages/admin/InventoryPage/ImportPage.jsx";
import HistoryPage from "../pages/admin/InventoryPage/HistoryPage.jsx";
import OrdersPage from "../pages/admin/OrdersPage/index.jsx";
import ProductsPage from "../pages/admin/ProductsPage/index.jsx";
import CustomersPage from "../pages/admin/CustomersPage/index.jsx";
import PromotionsPage from "../pages/admin/PromotionsPage/index.jsx";
import DebtsPage from "../pages/admin/DebtsPage/index.jsx";
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
    path: "/login",
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
    path: "/admin/inventory/history",
    component: HistoryPage,
    layout: AdminLayout,
  },
  {
    path: "/admin/inventory/import",
    component: ImportPage,
    layout: AdminLayout,
  },
  {
    path: "/admin/inventory/export",
    component: ExportPage,
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
  {
    path: "/admin/customers",
    component: CustomersPage,
    layout: AdminLayout,
  },
  {
    path: "/admin/promotions",
    component: PromotionsPage,
    layout: AdminLayout,
  },
  {
    path: "/admin/debts",
    component: DebtsPage,
    layout: AdminLayout,
  },
];

export { publicRoutes, privateRoutes };