import { useState } from "react";
import db from "../Database/Config";
import { useNavigate } from "react-router-dom";
import { collection,getDocs,query,where} from "firebase/firestore";
function Login(){

    const navigate=useNavigate();
    let[mobileDisplay,setMobileDisplay]=useState(false);
    let[gastDaten,setGastDaten]=useState({
        EventName:"",
        Name:"",
        Password:""
    })

    let Login=()=>{
        const collectionRef = collection(db, "Events");
        const q = query(collectionRef, where("EventDaten.NameEvent", "==", gastDaten.EventName))
        getDocs(q)
        .then((querySnapshot) => {
            if (querySnapshot.empty) {
            // Keine übereinstimmenden Dokumente gefunden
            console.log('Falsche Name von Event');
            } else {
            // Verarbeiten Sie die übereinstimmenden Dokumente
            querySnapshot.forEach((doc) => {
                let index = doc.data().Gast.findIndex(item => item.Pass === gastDaten.Password && item.Nachname === gastDaten.Name);
                if(index===-1)
                    alert("Falsche Nachname oder Password")
                else{
                    let Data={
                        data:doc.data(),
                        Index:index
                    }
                    navigate("../GastPlan",{ state: {Data}})
                }
            });
            }
        })
        .catch((error) => {
            console.error('Fehler beim Ausführen der Abfrage:', error);
        });
    }

    return(
        <div className="Login_Cont">
            <div className="Login_Nav">
               <p onClick={()=>{navigate("../CreateEvent")}}>Erstelle dein Event</p>
               <p onClick={()=>{navigate("../Admin")}}>Admin</p>
            </div>
            <div className="Login_Text">
                <h1>Event</h1>
                <div className="Login_spans">
                <h3>
                    <span> Organisiere </span>
                    <span> dein </span>
                    <span> Event </span>
                    <span> und </span>
                    <span> gestalte </span>
                    <span> den </span>
                    <span>Sitzplan</span>
                    <span>für</span>
                    <span>deine</span>
                    <span>Gäste</span>
                    <span>oder </span>
                    <span>gestalte</span>
                    <span>deinen </span>
                    <span>Raum</span>
                    <span>und</span>
                    <span>lass</span>
                    <span>deine</span>
                    <span>Gäste</span>
                    <span>selbst</span>
                    <span>wählen,</span>
                    <span>wo</span>
                    <span>sie</span>
                    <span>sitzen</span>
                    <span>möchten.</span>
                </h3>
                </div>
            </div>
            <div className="Form_Cont">
            <p onClick={()=>{setMobileDisplay(!mobileDisplay)}} className="Form_Cont_P">Ich bin Eingeladen</p>
                <div className={!mobileDisplay ? "Login_Form" : "Login_Form_none"}>
                    <div className="windowX">
                        <p onClick={()=>{setMobileDisplay(!mobileDisplay)}}>x</p>
                    </div>
                    <p className="Login_p">Ich bin Eingeladen</p>
                    <input
                        className="Login_inp"
                        placeholder="Name von Event"
                        onChange={(e)=>{setGastDaten({
                            ...gastDaten,
                            EventName:e.target.value
                        })}}
                    />
                    <input
                        className="Login_inp"
                        placeholder="Nachname"
                        onChange={(e)=>{setGastDaten({
                            ...gastDaten,
                            Name:e.target.value
                        })}}
                    />
                    <input
                        className="Login_inp"
                        placeholder="Password Event"
                        onChange={(e)=>{setGastDaten({
                            ...gastDaten,
                            Password:e.target.value
                        })}}
                    />
                    <button className="eventButton"  onClick={Login}>Login</button>
                </div>
            </div>
        </div>
    )
}
export default Login;