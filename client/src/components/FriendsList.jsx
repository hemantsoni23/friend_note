import React, { useState } from 'react';
import MessageModal from '../components/MessageModal';
import { removeFriend } from '../utils/friendRequestsAPI';

const FriendsList = ({ friends }) => {
    const [modalInfo, setModalInfo] = useState({
            show: false,
            text: '',
            button1_text: '',
            button2_text: '',
            handleAction: null,
        });

    const handleRemoveFriend = async (friendId) => {
        try {
            const response = await removeFriend(friendId);
            setModalInfo({
                show: true,
                text: response?.message,
                button1_text: '',
                button2_text: 'Close',
                handleAction: () => setModalInfo({ ...modalInfo, show: false }),
            });
        } catch (error) {
            console.error('Error removing friend:', error);
        }
    }

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
                        onClick={() => handleRemoveFriend(friend._id)}
                    >
                        Remove
                    </button>
                </div>
            ))}

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

export default FriendsList;