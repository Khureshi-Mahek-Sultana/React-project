import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Footer from '../components/Footer'; // Importing the Footer component

const Home = () => {
  const [searchData, setSearchData] = useState({
    from: '',
    to: '',
    date: ''
  });
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleInputChange = (e) => {
    setSearchData({
      ...searchData,
      [e.target.name]: e.target.value
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      alert('Please login to search for buses');
      navigate('/login');
      return;
    }

    if (!searchData.from || !searchData.to || !searchData.date) {
      alert('Please fill in all fields');
      return;
    }

    navigate(`/buses?from=${searchData.from}&to=${searchData.to}&date=${searchData.date}`);
  };

  const cities = ['New York', 'Boston', 'Washington DC', 'Philadelphia', 'Baltimore'];

  return (
    <div className="home-page">
      <div className="hero-section">
        <div className="hero-content">
          <h1>Book Your Bus Journey</h1>
          <p>Travel comfortably with our premium bus services across major cities</p>
          
          <form onSubmit={handleSearch} className="search-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="from">From</label>
                <select
                  id="from"
                  name="from"
                  value={searchData.from}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select departure city</option>
                  {cities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="to">To</label>
                <select
                  id="to"
                  name="to"
                  value={searchData.to}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select destination city</option>
                  {cities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="date">Date</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={searchData.date}
                  onChange={handleInputChange}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
            </div>
            
            <button type="submit" className="search-btn">
              Search Buses
            </button>
          </form>
        </div>
      </div>

      <div className="features-section">
        <h2>Why Choose Us?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🚌</div>
            <h3>Comfortable Rides</h3>
            <p>Travel in comfort with our modern fleet of buses</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">💰</div>
            <h3>Affordable Prices</h3>
            <p>Get the best value for your money with competitive pricing</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">⏰</div>
            <h3>On Time Service</h3>
            <p>Reliable schedules and punctual departures</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3>Secure Booking</h3>
            <p>Your bookings and payments are safe with us</p>
          </div>
        </div>
      </div>

      {!isAuthenticated && (
        <div className="cta-section">
          <h2>Ready to Travel?</h2>
          <p>Create an account to start booking your bus tickets</p>
          <button 
            onClick={() => navigate('/signup')} 
            className="cta-btn"
          >
            Sign Up Now
          </button>
        </div>
      )}
      <Footer /> {/* Adding the Footer component here */}
    </div>
  );
};

export default Home;
