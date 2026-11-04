import { useState } from "react";
import { useNavigate,useLocation} from "react-router-dom";
import db from "../../Database/Config";
import { collection, doc, deleteDoc, getDocs, query, where, updateDoc } from 'firebase/firestore';
import { formatDate, toInputDate } from "../../dateFormat";

function Eventmanagment(){

    const navigate=useNavigate();
    const {state} = useLocation();
    const EventDaten=state && state.Daten;
    let [Event,setEvent]=useState(EventDaten)
    let[Daten,setDaten]=useState(false)
    let[oldPass,setOldPass]=useState(false)
    let[emailPass,setEmailPass]=useState(false)
    let[delEvent,setDelEvent]=useState(false)
    let[saved,setSaved]=useState(EventDaten)

    let deleteEvent=()=>{
        const userConfirmed = window.confirm("Sind Sie sicher, dass Sie das Event komplett stornieren möchten?");
        if(userConfirmed){
            const eventDocRef = doc(db, 'Events', EventDaten.EventId);
            deleteDoc(eventDocRef)
            .then(() => {
                alert('Event erfolgreich gelöscht.');
                navigate("../")
            })
            .catch((error) => {
                console.error('Fehler beim Löschen des Dokuments:', error);
                alert("Das Event konnte nicht gelöscht werden")
            });
        }
    }

    // Checks that no other event already uses this value (name or e-mail)
    let isTaken= async(field,value)=>{
        const q = query(collection(db, 'Events'), where(`EventDaten.${field}`, "==", value));
        const snapshot = await getDocs(q);
        return snapshot.docs.some(d => d.id !== EventDaten.EventId);
    }

    let SaveDaten= async()=>{
        if(Event.NameEvent.trim()==="" || Event.Email.trim()==="" || Event.Password===""){
            alert("Name, E-Mail und Passwort dürfen nicht leer sein.")
            return;
        }
        const confirmed = window.confirm("Möchten Sie Ihre Änderungen speichern?")
        if(confirmed){
            const eventDocRef = doc(collection(db, 'Events'), EventDaten.EventId);
            try {
                if(Event.NameEvent!==EventDaten.NameEvent && await isTaken("NameEvent",Event.NameEvent)){
                    alert("Der Name für das Event ist bereits vergeben. Bitte wählen Sie einen anderen Namen.")
                    return;
                }
                if(Event.Email!==EventDaten.Email && await isTaken("Email",Event.Email)){
                    alert("Die E-Mail ist bereits vergeben. Bitte wählen Sie eine andere E-Mail.")
                    return;
                }
                await updateDoc(eventDocRef, { EventDaten:Event });
                setSaved(Event)
                alert("Daten gespeichert")
            } catch (error) {
                console.error('Fehler beim Speichern:', error);
                alert("Die Daten konnten nicht gespeichert werden")
            }
        }
    }

    let backToMenu=()=>{
        navigate("../AdminPage",{ state: { Daten: saved } })
    }

    let PassDaten=(pass)=>{
       if(!oldPass){
        setOldPass(!oldPass)
       }
       else if(pass===1){
        setEmailPass(!emailPass)
       }
       else{
        setOldPass(!oldPass)
        setEmailPass(false)
       }
    }
    
    return(
        <div className="eventmanagmentCont">
            <h1 className="raum_name">{saved.NameEvent}</h1>
            <button className="eventButton" onClick={backToMenu}>zurück zum Menu</button>
            <h3 className="settings_ConTitle">Eventmanagment</h3>
            <p> Beim Eventmanagement haben Sie die Möglichkeit, die Informationen zu Ihrer Veranstaltung 
                nach Bedarf zu ändern. Sie können den Veranstaltungsnamen, die Uhrzeit 
                sowie Ihr Passwort und Ihre E-Mail-Adresse ändern. 
                Darüber hinaus besteht die Option, Ihr gesamtes Projekt zu stornieren.</p>
            <div className="eventmanagment">
                <div className="eventmanagmentOptions">
                    <h2>Options</h2>
                    <button className="eventButton" onClick={()=>{setDaten(!Daten)}}>Event-Daten ändern</button>
                    {Daten && <div className="eventmanagmentInputs">
                        <input
                            placeholder="Event-Name"
                            value={Event.NameEvent}
                            type="text"
                            onChange={(e) => {setEvent({...Event,NameEvent:e.target.value}) }}
                        />
                        <input
                            placeholder="Datum"
                            type="date"
                            value={toInputDate(Event.Date)}
                            onChange={(e) => { setEvent({ ...Event, Date: formatDate(e.target.value) }); }}
                        />
                        <input
                            placeholder="Uhrzeit"
                            value={Event.Time}
                            type="time"
                            onChange={(e) => { setEvent({...Event,Time:e.target.value})  }}
                        />
                        </div>}
                    <button className="eventButton" onClick={PassDaten}>Password/E-Mail ändern</button>
                    {oldPass && <div className="eventmanagmentInputs">
                        <input
                        placeholder="altes Passwort"
                        type="password"
                        onChange={(e)=>{e.target.value===saved.Password && PassDaten(1)}}
                        />
                    </div>}
                    {emailPass && <div className="eventmanagmentInputs">
                        <input
                            placeholder=" Neues Passwort"
                            type="password"
                            onChange={(e) => { setEvent({ ...Event, Password: e.target.value }); }}
                        />
                        <input
                            placeholder="Neue E-Mail"
                            type="email"
                            onChange={(e) => { setEvent({ ...Event, Email: e.target.value }); }}
                        />
                    </div>}
                    <button className="eventButton" onClick={()=>{setDelEvent(!delEvent)}}>Event stornieren</button>
                    {delEvent && <div className="eventmanagmentInputs">
                        <input
                        placeholder="Passwort"
                        type="password"
                        onChange={(e)=>{e.target.value===saved.Password && deleteEvent()}}
                        />
                    </div>}
                    <button className="eventButton" onClick={SaveDaten}>Änderungen speichern</button>
                </div>
                <div className="eventmanagmentDaten w3-container">
                    <div style={{width:"100%"}}>
                        <h2>Dein Event</h2>
                        <ul className="w3-ul w3-card" >
                            <li>Name: {Event.NameEvent}</li>
                            <li>Datum: {Event.Date}</li>
                            <li>Uhrzeit: {Event.Time}</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Eventmanagment;