import { useState } from "react";
import { useNavigate } from "react-router-dom";
import db from "../Database/Config"
import { collection ,onSnapshot,query,where} from "firebase/firestore";

function Admin(){
    const navigate=useNavigate();
    let[mobileDisplay,setMobileDisplay]=useState(false);
    let[confirmDaten,setConfirmDaten]=useState({
        Email:"",
        Password:"",
    })
    let[msg,setMsg]=useState();

    let Login = async () => {
        try {
            const collectionRef = collection(db, "Events");
            const q = query(collectionRef, where("EventDaten.Email", "==", confirmDaten.Email), where("EventDaten.Password", "==", confirmDaten.Password));
            
            // Verwende onSnapshot, um Änderungen in der Sammlung zu überwachen
            const unsubscribe = onSnapshot(q, (snapshot) => {
                snapshot.forEach((doc) => {
                    const data = doc.data().EventDaten;
    
                    // Überprüfe, ob E-Mail und Passwort übereinstimmen
                    if (data.Email === confirmDaten.Email && data.Password === confirmDaten.Password) {
                      navigate("../AdminPage",{ state: { Daten: data } })
                    } else {
                        setMsg("Falsche Anmeldeinformationen");
                    }
                });
            });
        } catch (error) {
            console.error("Fehler bei der Anmeldung:", error);
        }
    };
  

    return(
        <div className="Login_Cont">
            <div className="Login_Text">
                <h1>Event</h1>
                <p>Nachdem Sie bereits Ihr Event erstellt haben, loggen Sie sich einfach ein, um die Verwaltung Ihres Events fortzusetzen.</p>
            </div>
            <div className="Form_Cont">
                <p onClick={()=>{setMobileDisplay(!mobileDisplay)}} className="Form_Cont_P">Veranstalter</p>
                <div className={!mobileDisplay ? "Login_Form w3-container w3-center w3-animate-top" : "Login_Form_none"} >
                    <div className="windowX">
                        <p onClick={()=>{setMobileDisplay(!mobileDisplay)}}>x</p>
                    </div>
                    <p className="Login_p">Veranstalter</p>
                    <input
                        className="Login_inp"
                        placeholder="Email"
                        type="email"
                        value={confirmDaten.Email}
                        onChange={(e)=>setConfirmDaten({...confirmDaten,Email:e.target.value})}
                    />
                    <input
                        className="Login_inp"
                        placeholder="Password"
                        type="password"
                        value={confirmDaten.Password}
                        onChange={(e)=>setConfirmDaten({...confirmDaten,Password:e.target.value})}
                    />
                    <button className="eventButton"  onClick={Login} >Admin</button>
                    <p>{msg}</p>
                </div>
            </div>
        </div>
    )
}
export default Admin;