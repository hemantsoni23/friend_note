import React from 'react';

const FriendsList = ({ friends }) => {
    if (!friends || friends.length === 0) {
        return <p>No friends to show.</p>;
    }

    return (
        <div className="space-y-3">
            {friends.map((friend) => (
                <div
                    key={friend._id}
                    className="flex items-center justify-between p-3 border rounded-md"
                >
                    <div className="flex items-center gap-3">
                        <img
                            src={`${process.env.PUBLIC_URL}/assets/avatars/a_${friend.avatarIndex}.png`}
                            alt="Friend Avatar"
                            className="w-12 h-12 rounded-full object-cover"
                        />
                        <div>
                            <p className="font-semibold">{friend.name}</p>
                            <p className="text-sm text-muted">{friend.bio || 'No bio available'}</p>
                        </div>
                    </div>
                    <button
                        className="px-3 py-1 bg-primary text-white rounded-md hover:bg-secondary"
                        onClick={() => console.log('Remove Friend')}
                    >
                        Remove
                    </button>
                </div>
            ))}
        </div>
    );
};

export default FriendsList;