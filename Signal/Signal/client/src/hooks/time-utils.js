export function parseDate(date) {
    const now = new Date();
    
     if (isNaN(date.getTime())) {
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


export function formatHour(date) {
    return new Intl.DateTimeFormat(undefined, {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    }).format(date);
}

export function formatByYear(date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    
    return `${year}/${month}/${day}`;    
}

export function formatByStrYear(prop) {
    const date = new Date(prop);
   
    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    }).format(date);
}

// ChatList component's time formatter
export function getRelativeTime(dateString) {
    const dateStr = new Date(dateString);  
    
    const date = parseDate(dateStr);
    const time = formatHour(dateStr);
    const dayInFull = formatByYear(dateStr);
    
    if (date.isToday()) {  
        return time;
    } else if (date.isYesterday()) { 
        return "Yesterday";
    } else {
        return dayInFull;
    }
}    

// ContactBar formatting last seen
export function formatLastSeen(dateString) {
    const dateStr = new Date(dateString);
    
    const date = parseDate(dateStr);
    const time = formatHour(dateStr);
    const day = formatByStrYear(dateStr);
  
    if (date.isToday()) {
        return `Last seen today at ${time}`;
    } else if (date.isYesterday()) {   
        return `Last seen yesterday at ${time}`;
    } else {
        return `last seen ${day} at ${time}`;
    }
}    


