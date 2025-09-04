import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { busesAPI } from '../api/buses';
import { bookingsAPI } from '../api/bookings';
import { useAuth } from '../context/AuthContext';
import SeatSelector from '../components/SeatSelector';
import LoadingSpinner from '../components/LoadingSpinner';

const BusDetails = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [bus, setBus] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState('');

  const from = searchParams.get('from');
  const to = searchParams.get('to');
  const date = searchParams.get('date');

  useEffect(() => {
    const fetchBusDetails = async () => {
      try {
        setLoading(true);
        const result = await busesAPI.getBusDetails(id);
        
        if (result.success) {
          setBus(result.data);
        } else {
          setError(result.error || 'Failed to fetch bus details');
        }
      } catch (err) {
        setError('An error occurred while fetching bus details');
      } finally {
        setLoading(false);
      }
    };

    fetchBusDetails();
  }, [id]);

  const handleSeatSelect = (seats) => {
    setSelectedSeats(seats);
  };

  const handleBookTickets = async () => {
    if (selectedSeats.length === 0) {
      alert('Please select at least one seat');
      return;
    }

    setBookingLoading(true);
    try {
      const bookingData = {
        busId: bus.id,
        userId: user.id,
        busName: bus.name,
        from: from || bus.from,
        to: to || bus.to,
        departureTime: bus.departureTime,
        arrivalTime: bus.arrivalTime,
        date: date || new Date().toISOString().split('T')[0],
        seats: selectedSeats,
        totalPrice: selectedSeats.length * bus.price
      };

      const result = await bookingsAPI.createBooking(bookingData);
      
      if (result.success) {
        alert(`Booking successful! Your booking ID is: ${result.data.id}`);
        navigate('/profile');
      } else {
        setError(result.error || 'Failed to create booking');
      }
    } catch (err) {
      setError('An error occurred while booking tickets');
    } finally {
      setBookingLoading(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="bus-details-page">
        <div className="container">
          <LoadingSpinner message="Loading bus details..." />
        </div>
      </div>
    );
  }

  if (error || !bus) {
    return (
      <div className="bus-details-page">
        <div className="container">
          <div className="error-state">
            <h2>Oops! Something went wrong</h2>
            <p>{error || 'Bus not found'}</p>
            <button onClick={handleBack} className="back-btn">
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bus-details-page">
      <div className="container">
        <div className="page-header">
          <button onClick={handleBack} className="back-btn">
            ← Back
          </button>
          <h1>Select Your Seats</h1>
        </div>

        <div className="bus-summary">
          <div className="bus-info">
            <h2>{bus.name}</h2>
            <p className="bus-type">{bus.type}</p>
          </div>
          
          <div className="route-info">
            <div className="timing">
              <span className="time">{bus.departureTime}</span>
              <span className="city">{from || bus.from}</span>
            </div>
            
            <div className="duration">
              <span>{bus.duration}</span>
            </div>
            
            <div className="timing">
              <span className="time">{bus.arrivalTime}</span>
              <span className="city">{to || bus.to}</span>
            </div>
          </div>

          <div className="price-info">
            <span className="price">${bus.price}</span>
            <span className="price-label">per seat</span>
          </div>
        </div>

        <div className="seat-selection">
          <h3>Select Seats ({selectedSeats.length} selected)</h3>
          <SeatSelector
            seatLayout={bus.seatLayout}
            onSeatSelect={handleSeatSelect}
            selectedSeats={selectedSeats}
          />
        </div>

        {selectedSeats.length > 0 && (
          <div className="booking-summary">
            <h3>Booking Summary</h3>
            <div className="summary-details">
              <p>Seats: {selectedSeats.join(', ')}</p>
              <p>Total Seats: {selectedSeats.length}</p>
              <p className="total-price">
                Total: ${selectedSeats.length * bus.price}
              </p>
            </div>
            
            <button
              onClick={handleBookTickets}
              disabled={bookingLoading}
              className="book-btn"
            >
              {bookingLoading ? <LoadingSpinner size="small" /> : 'Confirm Booking'}
            </button>
          </div>
        )}

        {error && <div className="error-message">{error}</div>}
      </div>
    </div>
  );
};

export default BusDetails;
