import axios from 'axios';
import Cookies from 'js-cookie';

// Accept Friend Request
export const acceptFriendRequest = async (requestId) => {
    try {
        const response = await axios.post(
            `${process.env.REACT_APP_API_ROUTE}/api/users/accept-friend-request`,
            { requestId },
            {
                headers: {
                    Authorization: `Bearer ${Cookies.get('accessToken')}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error accepting friend request:', error);
        throw error;
    }
};

// Reject Friend Request
export const rejectFriendRequest = async (requestId) => {
    try {
        const response = await axios.post(
            `${process.env.REACT_APP_API_ROUTE}/api/users/reject-friend-request`,
            { requestId },
            {
                headers: {
                    Authorization: `Bearer ${Cookies.get('accessToken')}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error rejecting friend request:', error);
        throw error;
    }
};

// Remove Friend
export const removeFriend = async (friendId) => {
    try {
        const response = await axios.post(
            `${process.env.REACT_APP_API_ROUTE}/api/users/removeFriend`,
            { friendId },
            {
                headers: {
                    Authorization: `Bearer ${Cookies.get('accessToken')}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error removing friend:', error);
        throw error;
    }
};