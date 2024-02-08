import {useState} from 'react'
import db from "../Database/Config"
import { collection ,query, where, getDocs,addDoc,doc,updateDoc} from "firebase/firestore";
import { useNavigate } from "react-router-dom";

function CreateEvent(){
    
    const navigate=useNavigate();
    let[mobileDisplay,setMobileDisplay]=useState(false);
    let[eventDaten,setEventDaten]=useState({
        NameEvent:"",
        Email:"",
        Date:"",
        Time:"",
        Password:""
    })
    let create= async ()=>{
        if(
            eventDaten.NameEvent!=="" && 
            eventDaten.Email!=="" &&
            eventDaten.Date!=="" &&
            eventDaten.Time!=="" &&
            eventDaten.Password!=="")
        {
            try{
                const collectionRef = collection(db,"Events");
                const q1 = query(collectionRef,
                     where("EventDaten.NameEvent", "==", eventDaten.NameEvent)
                );
                const q2 = query(collectionRef,
                     where( "EventDaten.Email","==", eventDaten.Email) 
                );
                const querySnapshot1 = await getDocs(q1);
                const querySnapshot2 = await getDocs(q2);
                if (querySnapshot1.empty && querySnapshot2.empty){
                    const RefDocument =await addDoc(collectionRef, { 
                        EventDaten: eventDaten,
                        RaumDaten:"",
                        Gast:""
                    });
                    let newData={
                        ...eventDaten,
                        EventId:RefDocument.id
                    }
                    await updateDoc(doc(collectionRef,RefDocument.id),{"EventDaten":newData})
                    alert("create Complete ")
                    navigate("../Admin")
                }
                else{
                   if(!querySnapshot1.empty)
                    alert("Der Name für das Event ist bereits vergeben. Bitte wählen Sie einen anderen Namen.")
                   else
                    alert("Der Email für das Event ist bereits vergeben. Bitte wählen Sie einen anderen Email.")
                }
            }
            catch(error){
                console.log(error)
            }
        }
        else{alert("Bitte füllen Sie alle erforderlichen Felder aus.")}
    }

    return(
        <div className="Login_Cont">
            <div className="Login_Text">
                <h1 style={{fontSize:"70px"}}>Event</h1>
                <p style={{marginTop:"0%"}}>Geben Sie bitte den Namen, das Datum und die Uhrzeit Ihres Events ein.
                     Zudem benötigen wir Ihre E-Mail-Adresse sowie ein Passwort, damit nur
                      Sie Zugriff auf die Daten Ihres Events haben.</p>
            </div>
            <div className="Form_Cont">
                <p onClick={()=>{setMobileDisplay(!mobileDisplay)}} className="Form_Cont_P">Daten deins Event</p>
                <div className={!mobileDisplay ? "Login_Form" : "Login_Form_none"}>
                    <div className="windowX">
                        <p onClick={()=>{setMobileDisplay(!mobileDisplay)}}>x</p>
                    </div>
                    <p className="Login_p">Daten deins Event</p>
                    <input
                        className="Login_inp"
                        placeholder="Name von Event"
                        type="text"
                        onChange={(e) => { setEventDaten({ ...eventDaten, NameEvent: e.target.value }); }}
                    />
                    <input
                        className="Login_inp"
                        placeholder="Datum"
                        type="date"
                        onChange={(e) => {
                            const selectedDate = new Date(e.target.value);
                            const day = String(selectedDate.getDate()).padStart(2, '0');
                            const month = String(selectedDate.getMonth() + 1).padStart(2, '0'); // Monate sind nullbasiert, deshalb +1
                            const year = selectedDate.getFullYear();
                            const formattedDate = `${day}-${month}-${year}`;
                            setEventDaten({ ...eventDaten, Date: formattedDate });
                        }}
                    />
                    <input
                        className="Login_inp"
                        placeholder="Uhr"
                        type="time"
                        onChange={(e) => { setEventDaten({ ...eventDaten, Time: e.target.value }); }}
                    />
                    <input
                        className="Login_inp"
                        placeholder="Email"
                        type="email"
                        onChange={(e) => { setEventDaten({ ...eventDaten, Email: e.target.value }); }}
                    />
                    <input
                        className="Login_inp"
                        placeholder="Password"
                        type="password"
                        onChange={(e) => { setEventDaten({ ...eventDaten, Password: e.target.value }); }}
                    /> 
                    <button className="eventButton"  onClick={create}>Create</button>          
                </div>
            </div>
        </div>
    )
}
export default CreateEvent;