import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Loader } from '@globals';
import { useQuery } from '@tanstack/react-query';

export function ProfileSec({profile}) {
    const [showModal, setShowModal] = useState(false);
    
    const EditPrompt = ({ ItemToUpdate, value }) => {
        return (
            <div className="prompt-bg">
                <div className="prompt">
                    <legend>{ItemToUpdate}
                        <input type="text" value={value}/>
                    </legend>
                    <button>Update</button>
                </div>                
            </div>
        );
    };
    
    const ProfileItem = ({ name, editable }) => {        
        const data =  {
            Name: profile.name,
            Bio: profile.bio,
            Phone: profile.phone
        };
        const handleEdit = () => setShowModal(true);
        return(
            <div className="profile-item">
               <div className="names">
                   <small>{name}</small>  
                   <p>{data[name]}</p>  
               </div>               
              {editable && <div className="icon" onClick={handleEdit}><Icon name={"pencil"}/></div> }
              {editable && showModal && <EditPrompt ItemToUpdate={name} value={data[name]}/> }
           </div>     
        )
    }

   return (
       <div className="profileSec">
           <div className="pic relative">
               <img src="https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg" /> 
               <div className="icon"><Icon name={"camera-outline"} /></div>
           </div>
     
           <ProfileItem name={"Name"} editable={true}/>
           <ProfileItem name={"Bio"} editable={true}/>
           <ProfileItem name={"Phone"} editable={false}/>
         
        </div>   
    );
}


export default function Settings() {
     const [d, setD] = useState([]);
     const dispatch = useDispatch();
     
     const { isLoading, data, error } = useQuery({
        queryKey: ['settings'],
        queryFn: async () => {
            try {
                const res = await axios.get("/api/settings", {withCredentials: true});
                dispatch(settingsSlice.actions.load(res.data));
                setD(res.data);
            } catch(error) {
                throw new Error(error);
            }
        }
    });
    
    if(isLoading) return <Loader />;
    const profile =  {
        name: d.name,
        bio: d.bio,
        phone: d.phone
    };
    
    return(
        <div className="settings">
            <ProfileSec profile={profile} />  
        </div> 
    );
}
