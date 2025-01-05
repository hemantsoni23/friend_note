import React, { useState } from 'react';
import MessageModal from '../components/MessageModal';
import { acceptFriendRequest, rejectFriendRequest } from '../utils/friendRequestsAPI';

const FriendRequests = ({ sentRequests, receivedRequests, refreshUser }) => {
    const [view, setView] = useState('received'); 
    const [modalInfo, setModalInfo] = useState({
        show: false,
        text: '',
        button1_text: '',
        button2_text: '',
        handleAction: null,
    });

    const handleAcceptRequest = async (requestId) => {
        try {
            const response = await acceptFriendRequest(requestId);
            setModalInfo({
                show: true,
                text: response?.message,
                button1_text: '',
                button2_text: 'Close',
                handleAction: () => setModalInfo({ ...modalInfo, show: false }),
            });
            refreshUser();
        } catch (error) {
            console.error('Error handling accept request:', error);
        }
    };

    const handleRejectRequest = async (requestId) => {
        try {
            const response = await rejectFriendRequest(requestId);
            setModalInfo({
                show: true,
                text: response?.message,
                button1_text: '',
                button2_text: 'Close',
                handleAction: () => setModalInfo({ ...modalInfo, show: false }),
            });
            refreshUser();
        } catch (error) {
            console.error('Error handling reject request:', error);
        }
    };

    return (
        <div>
            <div className="flex gap-4 mb-4">
                <button
                    className={`px-4 py-2 rounded-md ${
                        view === 'received' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                    onClick={() => setView('received')}
                >
                    Received Requests
                </button>
                <button
                    className={`px-4 py-2 rounded-md ${
                        view === 'sent' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                    onClick={() => setView('sent')}
                >
                    Sent Requests
                </button>
            </div>

            {view === 'received' ? (
                <>
                    <h3 className="text-lg font-semibold mb-2">Received Requests</h3>
                    {receivedRequests.length > 0 ? (
                        receivedRequests.map((request) => (
                            <div
                                key={request.senderId._id}
                                className="p-4 border-b flex items-center justify-between gap-4"
                            >
                                <div>
                                    <p className="font-medium">{request.senderId.name}</p>
                                    <p className="text-sm text-muted">{request.senderId.username}</p>
                                </div>
                                {
                                    request.status === 'pending' ?
                                    (
                                        <div className="flex gap-2">
                                            <button
                                                className="px-4 py-2 bg-green-500 text-white text-sm rounded-md hover:bg-green-600 transition"
                                                onClick={() => handleAcceptRequest(request._id)}
                                            >
                                                Accept
                                            </button>
                                            <button
                                                className="px-4 py-2 bg-red-500 text-white text-sm rounded-md hover:bg-red-600 transition"
                                                onClick={() => handleRejectRequest(request._id)}
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    ) :
                                    (<p className="text-gray-500">Status: {request.status.toString().toUpperCase()}</p>)
                                }
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500">No received requests.</p>
                    )}
                </>
            ) : (
                <>
                    <h3 className="text-lg font-semibold mb-2">Sent Requests</h3>
                    {sentRequests.length > 0 ? (
                        sentRequests.map((request) => (
                            <div
                                key={request?.receiverId._id}
                                className="p-4 border-b flex items-center justify-between gap-4"
                            >
                                <div>
                                    <p className="font-medium">{request.receiverId.name}</p>
                                    <p className="text-sm text-muted">{request.receiverId.username}</p>
                                </div>
                                <p className="text-gray-500">Status: {request.status}</p>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500">No sent requests.</p>
                    )}
                </>
            )}

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

export default FriendRequests;
