import { BrowserRouter, Route, Routes } from 'react-router-dom';
import MainLayout from './layouts/MainLayout.jsx';
import HomePage from './pages/HomePage.jsx';
import SearchResultsPage from './pages/SearchResultsPage.jsx';
import ProductDetailsPage from './pages/ProductDetailsPage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import HowItWorksPage from './pages/HowItWorksPage.jsx';
import AdminDashboardPage from './pages/AdminDashboardPage.jsx';
import AdminProductPage from './pages/AdminProductPage.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchResultsPage />} />
          <Route path="/product/:id" element={<ProductDetailsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/admin/new" element={<AdminProductPage />} />
          <Route path="/admin/edit/:id" element={<AdminProductPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
export default App;
