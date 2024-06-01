import axios from 'axios';

export const fetchUserData = async (token) => {
  const apiUrl = import.meta.env.VITE_API_URL;

  try {
    const response = await axios.get(`${apiUrl}/user/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
};
