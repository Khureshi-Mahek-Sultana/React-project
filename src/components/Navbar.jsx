import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          🚌 BusBooking
        </Link>
        
        <div className="nav-menu">
          <Link to="/" className="nav-link">
            Home
          </Link>
          
          {isAuthenticated ? (
            <>
              <Link to="/profile" className="nav-link">
                My Bookings
              </Link>
              <div className="nav-user">
                <span className="nav-username">Hello, {user?.name}</span>
                <button onClick={handleLogout} className="nav-logout">
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="nav-auth">
              <Link to="/login" className="nav-link">
                Login
              </Link>
              <Link to="/signup" className="nav-link nav-signup">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
