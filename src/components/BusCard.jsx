import { Link } from 'react-router-dom';

const BusCard = ({ bus }) => {
  const formatTime = (time) => {
    return time;
  };

  const formatPrice = (price) => {
    return `$${price}`;
  };

  return (
    <div className="bus-card">
      <div className="bus-header">
        <h3 className="bus-name">{bus.name}</h3>
        <span className="bus-type">{bus.type}</span>
      </div>
      
      <div className="bus-details">
        <div className="bus-timing">
          <div className="time-section">
            <span className="time">{formatTime(bus.departureTime)}</span>
            <span className="city">{bus.from}</span>
          </div>
          
          <div className="duration-section">
            <div className="duration-line"></div>
            <span className="duration">{bus.duration}</span>
          </div>
          
          <div className="time-section">
            <span className="time">{formatTime(bus.arrivalTime)}</span>
            <span className="city">{bus.to}</span>
          </div>
        </div>
        
        <div className="bus-info">
          <div className="seats-info">
            <span className="seats-available">{bus.availableSeats} seats left</span>
            <span className="total-seats">of {bus.totalSeats}</span>
          </div>
          
          <div className="price-section">
            <span className="price">{formatPrice(bus.price)}</span>
            <span className="price-label">per seat</span>
          </div>
        </div>
      </div>
      
      <div className="bus-amenities">
        {bus.amenities.map((amenity, index) => (
          <span key={index} className="amenity-tag">
            {amenity}
          </span>
        ))}
      </div>
      
      <div className="bus-actions">
        <Link to={`/bus/${bus.id}`} className="select-btn">
          Select Seats
        </Link>
      </div>
    </div>
  );
};

export default BusCard;
