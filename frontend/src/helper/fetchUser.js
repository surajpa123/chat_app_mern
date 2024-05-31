import axios from 'axios';

export const fetchUserData = async (token) => {
  try {
    const response = await axios.get('http://localhost:5000/user/me', {
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
