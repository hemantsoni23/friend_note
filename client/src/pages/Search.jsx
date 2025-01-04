import React, { useState } from 'react';
import axios from 'axios';

const Search = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);

    const handleSearch = async () => {
        if (!query) return;

        try {
            const response = await axios.get(`${process.env.REACT_APP_API_ROUTE}/api/users/search`, {
                params: { q: query },
            });
            setResults(response.data);
        } catch (error) {
            console.error('Error fetching search results:', error);
        }
    };

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
                        <div key={user._id} className="p-2 border-b">
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-gray-600">{user.email}</p>
                            {/* Add buttons for actions like "Send Friend Request" */}
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
