import React, { useContext, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { AuthContext } from '../context/AuthContext';
import MessageModal from '../components/MessageModal';

const Search = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [modalInfo, setModalInfo] = useState({
        show: false,
        text: '',
        button1_text: '',
        button2_text: '',
        handleAction: null,
    });
    const { user: loggedInUser } = useContext(AuthContext);

    const handleSearch = async () => {
        if (!query) return;

        try {
            const response = await axios.get(`${process.env.REACT_APP_API_ROUTE}/api/users/search`, {
                params: { q: query },
                headers: {
                    Authorization: `Bearer ${Cookies.get('accessToken')}`,
                },
            });
            setResults(response.data);
        } catch (error) {
            console.error('Error fetching search results:', error);
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
        } catch (error) {
            console.error('Error sending friend request:', error);
            setModalInfo({
                show: true,
                text: error.response?.data?.message || 'An error occurred while sending the friend request.',
                button1_text: '',
                button2_text: 'Close',
                handleAction: () => setModalInfo({ ...modalInfo, show: false }),
            });
        }
    };

    const getFriendRequestStatus = (user) => {
        const sentRequest = loggedInUser.sentFriendRequests.find(
            (request) => request.receiverId._id === user._id
        );

        const receivedRequest = loggedInUser.receivedFriendRequests.find(
            (request) => request.senderId._id === user._id
        );

        if (sentRequest) {
            if (sentRequest.status === 'pending') return 'Pending';
            // Case of harassment or stoking: user sends a friend request, it gets rejected, and they send another one within a week
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
                        // onClick={() => handleAcceptFriendRequest(receivedRequest._id)}
                    >
                        Accept
                    </button>
                    <button
                        className="px-4 py-2 bg-red-500 text-white text-sm rounded-md hover:bg-red-600 transition"
                        // onClick={() => handleRejectFriendRequest(receivedRequest._id)}
                    >
                        Reject
                    </button>
                </div>
            );
        }

        return null;
    };

    const handleRemoveFriend = async (friendId) => {
        // TODO: Implement removing a friend
    }

    return (
        <div className="p-4 ml-64 min-h-screen bg-background-light text-text-light dark:bg-background-dark dark:text-text-dark transition-colors duration-300">
            <h2 className="text-2xl font-bold mb-4">Search Friends</h2>
            <div className="flex gap-2 mb-4">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full p-2 border-border-light dark:border-border-dark text-text-light rounded"
                    placeholder="Search by name or username..."
                />
                <button onClick={handleSearch} className="bg-primary text-white px-4 py-2 rounded">
                    Search
                </button>
            </div>
            <div>
                {results.length > 0 ? (
                    results.map((user) => (
                        <div
                            key={user._id}
                            className="p-4 border-b flex items-center justify-between gap-4 hover:bg-gray-50 transition"
                        >
                            <img
                                src={`${process.env.PUBLIC_URL}/assets/avatars/a_${user.avatarIndex}.png`}
                                alt="User Avatar"
                                className="w-12 h-12 rounded-full object-cover"
                            />
                            <div className="flex-1">
                                <p className="font-medium text-text-light dark:text-text-dark">{user.name}</p>
                                <p className="text-sm text-muted-light dark:text-muted-dark">{user.email}</p>
                            </div>

                            {loggedInUser?.friends && loggedInUser?.friends.includes(user._id) ? (
                                <button
                                    className="px-4 py-2 bg-red-500 text-white text-sm rounded-md hover:bg-red-600 transition"
                                    onClick={() => handleRemoveFriend(user._id)}
                                >
                                    Remove Friend
                                </button>
                            ) : (
                                getFriendRequestStatus(user) || (
                                    <button
                                        className="px-4 py-2 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 transition"
                                        onClick={() => handleFriendRequest(user._id)}
                                    >
                                        Send Friend Request
                                    </button>
                                )
                            )}
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500">No results found</p>
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

export default Search;
