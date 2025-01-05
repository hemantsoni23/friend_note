import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { AuthContext } from '../context/AuthContext';
import MessageModal from '../components/MessageModal';

const RecommendationsPage = () => {
    const { user: loggedInUser, refreshUser } = useContext(AuthContext);
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [modalInfo, setModalInfo] = useState({
        show: false,
        text: '',
        button1_text: '',
        button2_text: '',
        handleAction: null,
    });

    useEffect(() => {
        if (!loggedInUser) return;

        const fetchRecommendations = async () => {
            try {
                const cachedRecommendations = localStorage.getItem(`recommendations:${loggedInUser._id}`);
                if (cachedRecommendations) {
                    setRecommendations(JSON.parse(cachedRecommendations));
                } else {
                    await refreshRecommendations();
                }
            } catch (err) {
                console.error('Error fetching recommendations:', err);
                setError('Failed to load recommendations.');
            }
        };

        fetchRecommendations();
    }, [loggedInUser]);

    const refreshRecommendations = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_API_ROUTE}/api/users/recommendations`,
                {
                    headers: {
                        Authorization: `Bearer ${Cookies.get('accessToken')}`,
                    },
                }
            );
            setRecommendations(response.data);
            localStorage.setItem(`recommendations:${loggedInUser._id}`, JSON.stringify(response.data));
            console.log(response.data);
        } catch (err) {
            console.error('Error refreshing recommendations:', err);
            setError('Unable to refresh recommendations.');
        } finally {
            setLoading(false);
        }
    };

    const handleFriendRequest = async (friendId) => {
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API_ROUTE}/api/users/send-friend-request`,
                { receiverId: friendId },
                {
                    headers: {
                        Authorization: `Bearer ${Cookies.get('accessToken')}`,
                    },
                }
            );
            setModalInfo({
                show: true,
                text: response.data.message,
                button1_text: '',
                button2_text: 'Close',
                handleAction: () => setModalInfo({ ...modalInfo, show: false }),
            });
            const updatedUser = {
                ...loggedInUser,
                sentFriendRequests: [
                    ...loggedInUser.sentFriendRequests,
                    { receiverId: { _id: friendId }, status: 'pending', createdAt: new Date() },
                ],
            };
            refreshUser(updatedUser);
        } catch (err) {
            console.error('Error sending friend request:', err);
            setModalInfo({
                show: true,
                text: err.response?.data?.message || 'An error occurred while sending the friend request.',
                button1_text: '',
                button2_text: 'Close',
                handleAction: () => setModalInfo({ ...modalInfo, show: false }),
            });
        }
    };

    const getFriendRequestStatus = (user) => {
        const sentRequest = loggedInUser.sentFriendRequests.find(
            (request) => request.receiverId._id === user.userId
        );

        const receivedRequest = loggedInUser.receivedFriendRequests.find(
            (request) => request.senderId._id === user.userId && request.status === 'pending'
        );

        if (sentRequest) {
            if (sentRequest.status === 'pending') return 'Pending';
            if (sentRequest.status === 'rejected') {
                const oneWeekInMs = 7 * 24 * 60 * 60 * 1000;
                const timeElapsed = new Date() - new Date(sentRequest.createdAt);
                if (timeElapsed < oneWeekInMs) return 'Cannot send request (wait 7 days)';
            }
        }

        if (receivedRequest) {
            return (
                <div className="flex gap-2">
                    <button
                        className="px-4 py-2 bg-green-500 text-white text-sm rounded-md hover:bg-green-600 transition"
                        onClick={() => handleAcceptFriendRequest(receivedRequest._id)}
                    >
                        Accept
                    </button>
                    <button
                        className="px-4 py-2 bg-red-500 text-white text-sm rounded-md hover:bg-red-600 transition"
                        onClick={() => handleRejectFriendRequest(receivedRequest._id)}
                    >
                        Reject
                    </button>
                </div>
            );
        }

        return null;
    };

    const handleAcceptFriendRequest = async (requestId) => {
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
            setModalInfo({
                show: true,
                text: response.data.message,
                button1_text: '',
                button2_text: 'Close',
                handleAction: () => setModalInfo({ ...modalInfo, show: false }),
            });
            refreshUser();
        } catch (err) {
            console.error('Error accepting friend request:', err);
        }
    };

    const handleRejectFriendRequest = async (requestId) => {
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
            setModalInfo({
                show: true,
                text: response.data.message,
                button1_text: '',
                button2_text: 'Close',
                handleAction: () => setModalInfo({ ...modalInfo, show: false }),
            });
            refreshUser();
        } catch (err) {
            console.error('Error rejecting friend request:', err);
        }
    };

    return (
        <div className="p-6 min-h-screen bg-background-light text-text-light dark:bg-background-dark dark:text-text-dark transition-colors duration-300">
            <div className="max-w-4xl mx-auto bg-background-light text-text-light dark:bg-background-dark dark:text-text-dark transition-colors duration-600 rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">Friend Recommendations</h1>
                    <button
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                        onClick={refreshRecommendations}
                        disabled={loading}
                    >
                        {loading ? 'Refreshing...' : 'Refresh Recommendations'}
                    </button>
                </div>
                {error && <p className="text-red-500">{error}</p>}
                {recommendations.length > 0 ? (
                    <ul className="space-y-4">
                        {recommendations.map((user) => (
                            <li
                                key={user.userId}
                                className="flex items-center gap-4 p-4 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition"
                            >
                                <img
                                    src={`${process.env.PUBLIC_URL}/assets/avatars/a_${user.avatarIndex}.png`}
                                    alt="User Avatar"
                                    className="w-12 h-12 rounded-full object-cover"
                                />
                                <div className="flex-1">
                                    <p className="font-medium">{user.username}</p>
                                    <p className="text-sm text-muted-light dark:text-muted-dark">
                                        Mutual Friends: {user.mutualFriends}
                                    </p>
                                    <p className="text-sm text-muted-light dark:text-muted-dark">
                                        Interest Match: {Math.round(user.interestMatch * 100)}%
                                    </p>
                                </div>
                                {loggedInUser?.friends.some((friend) => friend._id === user.userId) ? (
                                    <button className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition">
                                        Remove Friend
                                    </button>
                                ) : (
                                    getFriendRequestStatus(user) || (
                                        <button
                                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                                            onClick={() => handleFriendRequest(user.userId)}
                                        >
                                            Send Friend Request
                                        </button>
                                    )
                                )}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500">No recommendations available.</p>
                )}
            </div>
            {modalInfo.show && (
                <MessageModal
                    text={modalInfo.text}
                    button1_text={modalInfo.button1_text}
                    button2_text={modalInfo.button2_text}
                    onClose={() => setModalInfo({ ...modalInfo, show: false })}
                    handleAction={modalInfo.handleAction}
                />
            )}
        </div>
    );
};

export default RecommendationsPage;
