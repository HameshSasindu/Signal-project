import { useState, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Socket } from "./../common.js";
import { Reply } from "./Reply.js";
import { useHashHandler } from "./../hooks/hash.js";

export default function OptionList({ msg }) {
    const socket = useContext(Socket);
    const User = useSelector((state) => state.messages.userData);
    const [stage, setStage] = useState(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    const deleteMsg = () => {
        const x = confirm("Are you to delete this message? it can't be restored.")
        if(x) {
            socket.emit("delete_message", msg);    
            if(User.phone === msg.sender) {
                dispatch(deleteMessage(msg.id));
            }
        }else {
            navigate(-1);
        }
        
    };   
    
    const InfoMsg = () => {
        return(
            <div className="msgInfo">
                <p>Delivered: {msg.delivered}</p> 
                <p>Read: {msg.read}</p> 
            </div>
        )   
    };
    
    const hashMap = {
        "#options": () => {setStage("options")},
        "#info": () => {setStage("info")},
        "": () => {setStage(null)}
    };
   
    useHashHandler(hashMap);
    
    return(
        stage && <div className="option-con">
            <div className="msg-con">
                <Reply msg={msg} />
            </div>
            { stage === "info" && <InfoMsg/>}
            { stage === "options" && <div className="optionList">
                { msg.sender === User.phone ?
                    (<>
                        <div className="option" onClick={deleteMsg}>
                           <Icon name="trash" />
                           <p>Delete Message</p>
                        </div>
                        <div className="option" onClick={() => navigate("#info")}>
                           <Icon name="information-circle" />
                           <p>Info</p>
                        </div>
                        <div className="option">
                           <Icon name={"pencil"} />
                           <p>Edit Message</p>
                        </div>
                   </>
                  ) : (
                    <>
                        <div className="option">
                           <Icon name="information" />
                           <p>Delete Message</p>
                        </div>
                    </>
                  )
            }
            </div> }
        </div>
    );
}

