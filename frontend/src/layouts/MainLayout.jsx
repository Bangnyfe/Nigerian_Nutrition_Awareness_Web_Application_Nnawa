import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

function MainLayout() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/', { replace: true });
  }

  return (
    <>
      <header className="site-header">
        <div className="site-header__inner">
          <Link to="/" className="site-header__brand">
            Nnawa
          </Link>
          <nav className="site-nav">
            <Link to="/">Home</Link>
            <Link to="/search">Search</Link>
            <Link to="/how-it-works">How Nnawa Evaluates Foods</Link>
            <Link to="/about">About</Link>
            {isAuthenticated ? (
              <>
                <Link to="/admin">Admin</Link>
                <button
                  type="button"
                  className="site-nav__button"
                  onClick={handleLogout}
                >
                  Log out
                </button>
              </>
            ) : (
              <Link to="/admin/login">Admin</Link>
            )}
          </nav>
        </div>
      </header>

      <main className="site-main">
        <Outlet />
      </main>

      <footer className="site-footer">
        <div className="site-footer__inner">
          Nnawa provides nutrition information for educational purposes only
          and does not provide medical advice.
        </div>
      </footer>
    </>
  );
}
export default MainLayout;
