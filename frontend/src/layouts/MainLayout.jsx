import { Link, Outlet } from 'react-router-dom';

function MainLayout() {
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
            <Link to="/how-it-works">How It Works</Link>
            <Link to="/about">About</Link>
            <Link to="/admin">Admin</Link>
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
