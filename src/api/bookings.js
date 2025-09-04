// Mock API service for bookings
const API_BASE_URL = 'https://mock-api.busbooking.com/api';

// Import bookings data from JSON file
import bookingsData from '../data/bookings.json';

// Get bookings from localStorage or use JSON file data
const getStoredBookings = () => {
  const storedBookings = localStorage.getItem('busbooking_bookings');
  if (storedBookings) {
    return JSON.parse(storedBookings);
  }
  
  // Use data from JSON file
  return bookingsData.bookings;
};

// Save bookings to localStorage
const saveBookings = (bookings) => {
  localStorage.setItem('busbooking_bookings', JSON.stringify(bookings));
};

let mockBookings = getStoredBookings();

export const bookingsAPI = {
  // Create new booking
  createBooking: async (bookingData) => {
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    const newBooking = {
      id: mockBookings.length + 1,
      ...bookingData,
      status: 'confirmed',
      bookingDate: new Date().toISOString()
    };
    
    mockBookings.push(newBooking);
    saveBookings(mockBookings); // Save to localStorage
    
    return {
      success: true,
      data: newBooking
    };
  },

  // Get user bookings
  getUserBookings: async (userId) => {
    await new Promise(resolve => setTimeout(resolve, 700));
    
    const userBookings = mockBookings.filter(booking => booking.userId === userId);
    
    return {
      success: true,
      data: userBookings.sort((a, b) => new Date(b.bookingDate) - new Date(a.bookingDate))
    };
  },

  // Get booking by ID
  getBookingById: async (bookingId) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const booking = mockBookings.find(b => b.id === parseInt(bookingId));
    
    if (!booking) {
      return {
        success: false,
        error: 'Booking not found'
      };
    }
    
    return {
      success: true,
      data: booking
    };
  },

  // Cancel booking
  cancelBooking: async (bookingId) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const bookingIndex = mockBookings.findIndex(b => b.id === parseInt(bookingId));
    
    if (bookingIndex === -1) {
      return {
        success: false,
        error: 'Booking not found'
      };
    }
    
    mockBookings[bookingIndex].status = 'cancelled';
    saveBookings(mockBookings); // Save updated status to localStorage
    
    return {
      success: true,
      data: mockBookings[bookingIndex]
    };
  },

  // Get all bookings (for admin)
  getAllBookings: async () => {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    return {
      success: true,
      data: mockBookings
    };
  }
};

export default bookingsAPI;
