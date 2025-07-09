export function useLatestMessages(messages, currentUser) {
    const latestMessagesByContact = {};
    
    messages.forEach(msg => {
        const isCurrentUserSender = msg.sender === currentUser;
        const contact = isCurrentUserSender ? msg.receiver : msg.sender;
        if (!latestMessagesByContact[contact] || new Date(msg.timestamp) > new Date(latestMessagesByContact[contact].timestamp)) {
            latestMessagesByContact[contact] = msg;
        }
    });

    const latestMessagesArray = Object.values(latestMessagesByContact);

    latestMessagesArray.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    return latestMessagesArray;
}

