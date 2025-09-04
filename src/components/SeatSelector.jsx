import { useState } from 'react';

const SeatSelector = ({ seatLayout, onSeatSelect, selectedSeats = [] }) => {
  const [seats, setSeats] = useState(seatLayout);

  const handleSeatClick = (seat) => {
    if (!seat.isAvailable) return;

    const isSelected = selectedSeats.includes(seat.number);
    let newSelectedSeats;

    if (isSelected) {
      newSelectedSeats = selectedSeats.filter(s => s !== seat.number);
    } else {
      newSelectedSeats = [...selectedSeats, seat.number];
    }

    onSeatSelect(newSelectedSeats);
  };

  const getSeatClassName = (seat) => {
    let className = 'seat';
    
    if (!seat.isAvailable) {
      className += ' unavailable';
    } else if (selectedSeats.includes(seat.number)) {
      className += ' selected';
    } else {
      className += ' available';
    }
    
    if (seat.isWindow) className += ' window';
    if (seat.isAisle) className += ' aisle';
    
    return className;
  };

  // Group seats by row
  const rows = {};
  seats.forEach(seat => {
    if (!rows[seat.row]) {
      rows[seat.row] = [];
    }
    rows[seat.row].push(seat);
  });

  return (
    <div className="seat-selector">
      <div className="seat-legend">
        <div className="legend-item">
          <div className="seat-sample available"></div>
          <span>Available</span>
        </div>
        <div className="legend-item">
          <div className="seat-sample selected"></div>
          <span>Selected</span>
        </div>
        <div className="legend-item">
          <div className="seat-sample unavailable"></div>
          <span>Booked</span>
        </div>
      </div>

      <div className="bus-layout">
        <div className="driver-section">🚌 Driver</div>
        
        {Object.keys(rows).map(rowNumber => (
          <div key={rowNumber} className="seat-row">
            <span className="row-number">Row {rowNumber}</span>
            <div className="seats-container">
              {rows[rowNumber].map(seat => (
                <button
                  key={seat.id}
                  className={getSeatClassName(seat)}
                  onClick={() => handleSeatClick(seat)}
                  disabled={!seat.isAvailable}
                  title={`Seat ${seat.number} - ${seat.isWindow ? 'Window' : seat.isAisle ? 'Aisle' : 'Middle'}`}
                >
                  {seat.number}
                </button>
              ))}
            </div>
          </div>
        ))}
        
        <div className="exit-section">🚪 Exit</div>
      </div>

      {selectedSeats.length > 0 && (
        <div className="selected-seats-info">
          <h4>Selected Seats: {selectedSeats.join(', ')}</h4>
          <p>Total seats selected: {selectedSeats.length}</p>
        </div>
      )}
    </div>
  );
};

export default SeatSelector;
