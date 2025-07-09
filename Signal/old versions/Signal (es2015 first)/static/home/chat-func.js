export function orderLatestMessages(messages, currentUser) {
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

export function getRelativeTime(dateString) {
  const now = new Date();
  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    return "--:--";
  }  

  const diffInMilliseconds = now - date;
  const diffInSeconds = diffInMilliseconds / 1000;
  const diffInMinutes = diffInSeconds / 60;
  const diffInHours = diffInMinutes / 60;
  const diffInDays = diffInHours / 24;

  if (diffInDays < 1 && now.getDate() === date.getDate() && now.getMonth() === date.getMonth() && now.getFullYear() === date.getFullYear()) {
  
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  } else if (diffInDays < 2 && now.getDate() - date.getDate() === 1 && now.getMonth() === date.getMonth() && now.getFullYear() === date.getFullYear()) { 
    return "Yesterday";
  } else {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}/${month}/${day}`;
  }
}    


export function formatLastSeen(dateString) {
  const now = new Date();
  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    return "--:--";
  }  

  const diffInMilliseconds = now - date;
  const diffInSeconds = diffInMilliseconds / 1000;
  const diffInMinutes = diffInSeconds / 60;
  const diffInHours = diffInMinutes / 60;
  const diffInDays = diffInHours / 24;
  
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
    
  if (diffInDays < 1 && now.getDate() === date.getDate() && now.getMonth() === date.getMonth() && now.getFullYear() === date.getFullYear()) {
    return `Last seen today at ${hours}:${minutes}`;
  } else if (diffInDays < 2 && now.getDate() - date.getDate() === 1 && now.getMonth() === date.getMonth() && now.getFullYear() === date.getFullYear()) {   
    return `Last seen yesterday at ${hours}:${minutes}`;
  } else {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `last seen ${year}/${month}/${day} at ${hours}:${minutes}`;
  }
}    


