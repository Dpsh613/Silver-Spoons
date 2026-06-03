import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  withCredentials: true, // Important for future admin dashboard / cross-origin cookies
});

// Helper function for analytics
export const trackEvent = async (eventType) => {
  try {
    await api.post('/analytics/track', { eventType });
  } catch (error) {
    console.error('Analytics error:', error);
  }
};

export default api;