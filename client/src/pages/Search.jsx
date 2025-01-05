import React, { useContext, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { AuthContext } from '../context/AuthContext';

const Search = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const { user:loggedInUser } = useContext(AuthContext);

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
        // TODO: Implement the add friend functionality
    }

    const handleRemoveFriend = async (friendId) => {
        // TODO: Implement the remove friend functionality
    }

    return (
        <div className="p-4 ml-64 min-h-screen bg-background-light text-text-light">
            <h2 className="text-2xl font-bold mb-4">Search Friends</h2>
            <div className="flex gap-2 mb-4">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full p-2 border rounded"
                    placeholder="Search by name or email..."
                />
                <button onClick={handleSearch} className="bg-primary text-white px-4 py-2 rounded">
                    Search
                </button>
            </div>
            <div>
                {results.length > 0 ? (
                    results.map((user) => (
                        <div key={user._id}
                            className="p-4 border-b flex items-center justify-between gap-4 hover:bg-gray-50 transition"
                        >
                        <img
                            src={`${process.env.PUBLIC_URL}/assets/avatars/a_${user.avatarIndex}.png`}
                            alt="User Avatar"
                            className="w-12 h-12 rounded-full object-cover"
                        />

                        <div className="flex-1">
                            <p className="font-medium text-gray-900">{user.name}</p>
                            <p className="text-sm text-gray-600">{user.email}</p>
                        </div>

                        {loggedInUser?.friends && loggedInUser?.friends.includes(user._id) ? (
                            <button
                            className="px-4 py-2 bg-red-500 text-white text-sm rounded-md hover:bg-red-600 transition"
                            onClick={() => handleRemoveFriend(user._id)}
                            >
                            Remove Friend
                            </button>
                        ) : (
                            <button
                            className="px-4 py-2 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 transition"
                            onClick={() => handleFriendRequest(user._id)}
                            >
                            Send Friend Request
                            </button>
                        )}
                        </div>

                    ))
                ) : (
                    <p className="text-gray-500">No results found</p>
                )}
            </div>
        </div>
    );
};

export default Search;
