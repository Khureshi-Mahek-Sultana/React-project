// Mock API service for authentication
const API_BASE_URL = 'https://mock-api.busbooking.com/api';

// Import user data from JSON file
import usersData from '../data/users.json';

// Get users from localStorage or use JSON file data
const getStoredUsers = () => {
  const storedUsers = localStorage.getItem('busbooking_users');
  if (storedUsers) {
    return JSON.parse(storedUsers);
  }
  
  // Use data from JSON file
  return usersData.users;
};

// Save users to localStorage
const saveUsers = (users) => {
  localStorage.setItem('busbooking_users', JSON.stringify(users));
};

let mockUsers = getStoredUsers();

export const authAPI = {
  // Login user
  login: async (email, password) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user = mockUsers.find(u => u.email === email && u.password === password);
    
    if (user) {
      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;
      return {
        success: true,
        data: {
          user: userWithoutPassword,
          token: 'mock-jwt-token-' + user.id
        }
      };
    }
    
    return {
      success: false,
      error: 'Invalid email or password'
    };
  },

  // Register new user
  signup: async (userData) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const existingUser = mockUsers.find(u => u.email === userData.email);
    
    if (existingUser) {
      return {
        success: false,
        error: 'User already exists with this email'
      };
    }
    
    const newUser = {
      id: mockUsers.length + 1,
      ...userData
    };
    
    mockUsers.push(newUser);
    saveUsers(mockUsers); // Save to localStorage
    
    // Remove password from response
    const { password: _, ...userWithoutPassword } = newUser;
    
    return {
      success: true,
      data: {
        user: userWithoutPassword,
        token: 'mock-jwt-token-' + newUser.id
      }
    };
  },

  // Get user profile
  getProfile: async (token) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (!token) {
      return {
        success: false,
        error: 'No token provided'
      };
    }
    
    const userId = parseInt(token.split('-').pop());
    const user = mockUsers.find(u => u.id === userId);
    
    if (user) {
      const { password: _, ...userWithoutPassword } = user;
      return {
        success: true,
        data: userWithoutPassword
      };
    }
    
    return {
      success: false,
      error: 'User not found'
    };
  }
};

export default authAPI;
