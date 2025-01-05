import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { AuthContext } from '../context/AuthContext';

const RecommendationsPage = () => {
    const { user } = useContext(AuthContext);
    const [recommendations, setRecommendations] = useState([]);

    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                const cachedRecommendations = localStorage.getItem(`recommendations:${user._id}`);
                if (cachedRecommendations) {
                    setRecommendations(JSON.parse(cachedRecommendations));
                } else {
                    refreshRecommendations();
                }
            } catch (error) {
                console.error('Error fetching recommendations:', error);
            }
        };

        fetchRecommendations();
    }, [user._id]);

    const refreshRecommendations = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_ROUTE}/api/users/recommendations`,{
                headers: {
                    Authorization: `Bearer ${Cookies.get('accessToken')}`,
                },
            });
            setRecommendations(response.data);
            localStorage.setItem(`recommendations:${user._id}`, JSON.stringify(response.data));
        } catch (error) {
            console.error('Error refreshing recommendations:', error);
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
                    >
                        Refresh Recommendations
                    </button>
                </div>
                {recommendations.length > 0 ? (
                    <ul className="space-y-4">
                        {recommendations.map((rec) => (
                            <li
                                key={rec.userId}
                                className="flex items-center gap-4 p-4 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition"
                            >
                                <img
                                    src={`${process.env.PUBLIC_URL}/assets/avatars/a_${rec.avatarIndex}.png`}
                                    alt={`${rec.username}'s avatar`}
                                    className="w-12 h-12 rounded-full object-cover"
                                />
                                <div className="flex-1">
                                    <p className="text-lg font-medium text-text-light dark:text-text-dark">
                                        {rec.username}
                                    </p>
                                    <p className="text-sm text-muted-light dark:text-muted-dark">
                                        Mutual Friends: {rec.mutualFriends}
                                    </p>
                                    <p className="text-sm text-muted-light dark:text-muted-dark">
                                        Interest Match: {Math.round(rec.interestMatch * 100)}%
                                    </p>
                                </div>
                                <button
                                    className="px-4 py-2 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 transition"
                                    onClick={() => console.log(`Send friend request to ${rec.username}`)}
                                >
                                    Add Friend
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500 dark:text-gray-400">No recommendations available.</p>
                )}
            </div>
        </div>
    );
};

export default RecommendationsPage;
