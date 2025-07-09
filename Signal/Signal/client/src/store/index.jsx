import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { enableMapSet } from 'immer';
enableMapSet();


import AuthSlice from './auth';
import AllMessages from './messages';
import onlineSlice from './online';
import settingsSlice from './settings';
import typingSlice from './typing';

const store = configureStore({
    reducer: {
         auth: AuthSlice,
         messages: AllMessages,
         onlineUsers: onlineSlice,
         settings: settingsSlice,
         typing: typingSlice
    }
});

export default function ReduxProvider({ children }) {
    return (
        <Provider store={store}>
            { children }
        </Provider>
    ); 
}
