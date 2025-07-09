export interface Message {
    sender: string;
    receiver: string;
    message: string;
    timestamp: string;
    delivered: string || null;
    read: string || null;
}

export interface UserInfo = {
    name: string;
    phone: string;
    bio: string;
}
