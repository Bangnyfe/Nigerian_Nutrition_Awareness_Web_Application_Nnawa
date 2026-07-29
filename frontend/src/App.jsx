import { BrowserRouter, Route, Routes } from 'react-router-dom';
import MainLayout from './layouts/MainLayout.jsx';
import HomePage from './pages/HomePage.jsx';
import SearchResultsPage from './pages/SearchResultsPage.jsx';
import ProductDetailsPage from './pages/ProductDetailsPage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import HowNnawaEvaluatesPage from './pages/HowNnawaEvaluatesPage.jsx';
import AdminDashboardPage from './pages/AdminDashboardPage.jsx';
import AdminProductPage from './pages/AdminProductPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchResultsPage />} />
          <Route path="/product/:id" element={<ProductDetailsPage />} />
          <Route path="/about" element={<AboutPage />} />
          {/* The route path is kept as /how-it-works; only the page content
              and navigation label were renamed. */}
          <Route path="/how-it-works" element={<HowNnawaEvaluatesPage />} />

          <Route path="/admin/login" element={<LoginPage />} />

          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/new"
            element={
              <ProtectedRoute>
                <AdminProductPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/edit/:id"
            element={
              <ProtectedRoute>
                <AdminProductPage />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
export default App;
