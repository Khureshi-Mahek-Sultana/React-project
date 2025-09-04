// Mock API service for buses
const API_BASE_URL = 'https://mock-api.busbooking.com/api';

// Import bus data from JSON file
import busesData from '../data/buses.json';

// Mock bus data for development
const mockBuses = busesData.buses;

// Mock seat layout
const generateSeatLayout = (busId, totalSeats) => {
  const seats = [];
  const rows = Math.ceil(totalSeats / 4);
  
  for (let row = 1; row <= rows; row++) {
    for (let col = 1; col <= 4; col++) {
      const seatNumber = (row - 1) * 4 + col;
      if (seatNumber <= totalSeats) {
        seats.push({
          id: `${busId}-${seatNumber}`,
          number: seatNumber,
          row: row,
          col: col,
          isAvailable: Math.random() > 0.3, // 70% chance of being available
          isWindow: col === 1 || col === 4,
          isAisle: col === 2 || col === 3
        });
      }
    }
  }
  
  return seats;
};

export const busesAPI = {
  // Search buses
  searchBuses: async (from, to, date) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const filteredBuses = mockBuses.filter(bus => 
      bus.from.toLowerCase() === from.toLowerCase() && 
      bus.to.toLowerCase() === to.toLowerCase()
    );
    
    return {
      success: true,
      data: filteredBuses
    };
  },

  // Get bus details
  getBusDetails: async (busId) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const bus = mockBuses.find(b => b.id === parseInt(busId));
    
    if (!bus) {
      return {
        success: false,
        error: 'Bus not found'
      };
    }
    
    const seatLayout = generateSeatLayout(bus.id, bus.totalSeats);
    
    return {
      success: true,
      data: {
        ...bus,
        seatLayout
      }
    };
  },

  // Get all buses (for admin)
  getAllBuses: async () => {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    return {
      success: true,
      data: mockBuses
    };
  }
};

export default busesAPI;
