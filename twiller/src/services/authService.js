import axios from 'axios';

export const getLoginHistory = async (userId) => {
    try {
        if (!userId) {
            throw new Error('User ID is required to fetch login history');
        }
        const response = await axios.get(`/api/auth/login-history?userId=${userId}`); 
        return response.data;
    } catch (error) {
        console.error('Error fetching login history:', error);
        throw error;
    }
};


