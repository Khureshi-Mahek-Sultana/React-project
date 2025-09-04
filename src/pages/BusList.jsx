import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { busesAPI } from '../api/buses';
import BusCard from '../components/BusCard';
import LoadingSpinner from '../components/LoadingSpinner';

const BusList = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const from = searchParams.get('from');
  const to = searchParams.get('to');
  const date = searchParams.get('date');

  useEffect(() => {
    const fetchBuses = async () => {
      if (!from || !to || !date) {
        setError('Missing search parameters');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const result = await busesAPI.searchBuses(from, to, date);
        
        if (result.success) {
          setBuses(result.data);
        } else {
          setError(result.error || 'Failed to fetch buses');
        }
      } catch (err) {
        setError('An error occurred while searching for buses');
      } finally {
        setLoading(false);
      }
    };

    fetchBuses();
  }, [from, to, date]);

  const handleBackToSearch = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="bus-list-page">
        <div className="container">
          <LoadingSpinner message="Searching for buses..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bus-list-page">
        <div className="container">
          <div className="error-state">
            <h2>Oops! Something went wrong</h2>
            <p>{error}</p>
            <button onClick={handleBackToSearch} className="back-btn">
              Back to Search
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bus-list-page">
      <div className="container">
        <div className="page-header">
          <button onClick={handleBackToSearch} className="back-btn">
            ← Back to Search
          </button>
          <h1>Available Buses</h1>
          <div className="route-info">
            <span className="route-from">{from}</span>
            <span className="route-arrow">→</span>
            <span className="route-to">{to}</span>
            <span className="route-date">on {new Date(date).toLocaleDateString()}</span>
          </div>
        </div>

        {buses.length === 0 ? (
          <div className="no-buses">
            <h2>No buses found</h2>
            <p>Sorry, we couldn't find any buses for your selected route and date.</p>
            <button onClick={handleBackToSearch} className="back-btn">
              Try Different Search
            </button>
          </div>
        ) : (
          <div className="buses-grid">
            {buses.map(bus => (
              <BusCard key={bus.id} bus={bus} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BusList;
