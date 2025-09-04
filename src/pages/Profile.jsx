import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { bookingsAPI } from '../api/bookings';
import LoadingSpinner from '../components/LoadingSpinner';

const Profile = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const result = await bookingsAPI.getUserBookings(user.id);
        
        if (result.success) {
          setBookings(result.data);
        } else {
          setError(result.error || 'Failed to fetch bookings');
        }
      } catch (err) {
        setError('An error occurred while fetching bookings');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchBookings();
    }
  }, [user]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    return timeString;
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      const result = await bookingsAPI.cancelBooking(bookingId);
      
      if (result.success) {
        setBookings(prev => prev.map(booking =>
          booking.id === bookingId 
            ? { ...booking, status: 'cancelled' }
            : booking
        ));
        alert('Booking cancelled successfully');
      } else {
        setError(result.error || 'Failed to cancel booking');
      }
    } catch (err) {
      setError('An error occurred while cancelling booking');
    }
  };

  if (loading) {
    return (
      <div className="profile-page">
        <div className="container">
          <LoadingSpinner message="Loading your bookings..." />
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="container">
        <div className="profile-header">
          <h1>My Profile</h1>
          <div className="user-info">
            <h2>{user?.name}</h2>
            <p>{user?.email}</p>
            <p>{user?.phone}</p>
          </div>
        </div>

        <div className="bookings-section">
          <h2>My Bookings</h2>
          
          {error && <div className="error-message">{error}</div>}

          {bookings.length === 0 ? (
            <div className="no-bookings">
              <p>You don't have any bookings yet.</p>
              <p>Start by searching for buses on the home page!</p>
            </div>
          ) : (
            <div className="bookings-list">
              {bookings.map(booking => (
                <div key={booking.id} className={`booking-card ${booking.status}`}>
                  <div className="booking-header">
                    <h3>{booking.busName}</h3>
                    <span className={`status-badge ${booking.status}`}>
                      {booking.status}
                    </span>
                  </div>
                  
                  <div className="booking-details">
                    <div className="route">
                      <span className="from">{booking.from}</span>
                      <span className="arrow">→</span>
                      <span className="to">{booking.to}</span>
                    </div>
                    
                    <div className="timing">
                      <span>{formatTime(booking.departureTime)}</span>
                      <span className="date">{formatDate(booking.date)}</span>
                    </div>
                    
                    <div className="seats-info">
                      <span>Seats: {booking.seats.join(', ')}</span>
                    </div>
                    
                    <div className="price-info">
                      <span className="total">Total: ${booking.totalPrice}</span>
                    </div>
                    
                    <div className="booking-meta">
                      <span>Booking ID: {booking.id}</span>
                      <span>Booked on: {formatDate(booking.bookingDate)}</span>
                    </div>
                  </div>
                  
                  {booking.status === 'confirmed' && (
                    <div className="booking-actions">
                      <button
                        onClick={() => handleCancelBooking(booking.id)}
                        className="cancel-btn"
                      >
                        Cancel Booking
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
