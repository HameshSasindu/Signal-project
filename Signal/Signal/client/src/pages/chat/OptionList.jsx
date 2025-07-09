import { useAuth } from '@hooks/auth';
import { useSocket } from '@hooks/socket';
import { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { Icon, RenderPortal } from '@globals';
import { Reply } from './Reply';
import { deleteMessage } from '@store/messages';
import { useNavigate } from 'react-router-dom';

const OptionItem = ({ icon, tag, onClick }) => {
    return (
        <div className="option" onClick={onClick}>
            <Icon name={icon} />
            <p>{tag}</p>
        </div>   
    );
}

function OptionList({ msg, setView }) {
    const socket = useSocket();
    const auth = useAuth();
    
    const dispatch = useDispatch();
    
    const isOwnMessage = (auth.phone === msg.sender);
        
    const deleteMsg = useCallback(() => {
        const isConfirmed = window.confirm("Are you to delete this message? it can't be restored.");
        
        if(isConfirmed) {
            socket.emit("delete_message", msg);                
            if(isOwnMessage) {
                dispatch(deleteMessage(msg.id));
            }
        }
                
    }, [socket, msg, dispatch, isOwnMessage]); 
      

    return (
        <div className="optionList" onClick={preventClose}>
            { isOwnMessage ?
            (<>
                <OptionItem
                    icon={"trash"}
                    tag={"Delete Message"}
                    onClick={deleteMsg}
                />
                <OptionItem
                    icon={"information-circle"}
                    tag={"Info"}
                    onClick={() => setView('info')}
                />
                <OptionItem
                    icon={"pencil"}
                    tag={"Edit Message"}
                    onClick={() => setView('edit')}
                />
            </>
            ) : (<>
                <OptionItem
                    icon={"information-circle"}
                    tag={"Info"}
                    onClick={() => setView("info")}
                />
            </>)
            }   
        </div>
    );       
}

const preventClose = (e) => e.stopPropagation();

export default function Options({ msg, onClose }) {
    const socket = useSocket();
    const auth = useAuth();
    
    const [view, setView] = useState('options');
   
    const navigate = useNavigate();    
    
    const InfoMsg = () => {
        return(
            <div className="msgInfo">
                <p>Delivered: {msg.delivered}</p> 
                <p>Read: {msg.read}</p> 
            </div>
        );
    };
    
    return(
        <RenderPortal onClose={onClose}>  
            <div className="option-con">
                <div className="msg-con">
                    <Reply msg={msg} />
                </div>
                { view === "info" && <InfoMsg/>}
                { view === "options" && <OptionList msg={msg} setView={setView} />}  
            </div>
        </RenderPortal>
    );
}

