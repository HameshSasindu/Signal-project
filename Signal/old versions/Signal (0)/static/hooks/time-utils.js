const formatTime = (iso) => {
        const date = new Date(iso);
        return new Intl.DateTimeFormat(undefined, {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        }).format(date);
}    

function dayCheck(date) {
    const now = new Date();
    
     if (isNaN(dateStr.getTime())) {
        return "--:--";
    }
    
    const diffInMilliseconds = now - date;
    const diffInSeconds = diffInMilliseconds / 1000;
    const diffInMinutes = diffInSeconds / 60;
    const diffInHours = diffInMinutes / 60;
    const diffInDays = diffInHours / 24;
        
    function isToday() {    
        if(diffInDays < 1 && now.getDate() === date.getDate() && now.getMonth() === date.getMonth() && now.getFullYear() === date.getFullYear()) {
            return true;
        }
    }
    
    function isYesterday() {  
        if(diffInDays < 2 && now.getDate() - date.getDate() === 1 && now.getMonth() === date.getMonth() && now.getFullYear() === date.getFullYear()) {
            return true;
        }
    }
    
    return {
        isToday: isToday,
        isYesterday: isYesterday
    };
}


function formatByHour(date) {
    const hour = date.getHours().toString().padStart(2, '0');
    const minute = date.getMinutes().toString().padStart(2, '0');
    
    return { hour, minute };      
}

function formatByYear(date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    
    return { year, month, day };    
}

// ChatList component's time formatter
export function getRelativeTime(dateString) {
    const dateStr = new Date(dateString);  
    
    const date = dayCheck(dateStr);
    const { hour, minute } = formatByHour(dateStr);
    const { year, month, date } = formatByYear(dateStr);
    
    if (date.isToday()) {  
        return `${hour}:${minute}`;
    } else if (date.isYesterday()) { 
        return "Yesterday";
    } else {
        return `${year}/${month}/${day}`;
    }
}    

// ContactBar formatting last seen
export function formatLastSeen(dateString) {
    const dateStr = new Date(dateString);
    
    const date = dayCheck(dateStr);
    const { hour, minute } = formatByHour(dateStr);
    const { year, month, date } = formatByYear(dateStr);
  
    if (date.isToday()) {
        return `Last seen today at ${hour}:${minute}`;
    } else if (date.isYesterday()) {   
        return `Last seen yesterday at ${hour}:${minute}`;
    } else {
        return `last seen ${year}/${month}/${day} at ${hour}:${minute}`;
    }
}    


