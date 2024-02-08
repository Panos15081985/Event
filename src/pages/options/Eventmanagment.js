import { useState } from "react";
import { useNavigate,useLocation} from "react-router-dom";
import db from "../../Database/Config";
import { collection, doc, deleteDoc,getFirestore,updateDoc } from 'firebase/firestore';

function Eventmanagment(){

    const navigate=useNavigate();
    const {state} = useLocation();
    const EventDaten=state && state.Daten;
    let [Event,setEvent]=useState(EventDaten)
    let[Daten,setDaten]=useState(false)
    let[oldPass,setOldPass]=useState(false)
    let[emailPass,setEmailPass]=useState(false)
    let[delEvent,setDelEvent]=useState(false)

    let deleteEvent=()=>{
        const userConfirmed = window.confirm("Sind Sie sicher, dass Sie das Event komplett stornieren möchten?");
        if(userConfirmed){
            const firestore = getFirestore();
            const eventId = Event.EventId;
            const eventDocRef = doc(firestore, 'Events', eventId);
            deleteDoc(eventDocRef)
            .then(() => {
                console.log('Event erfolgreich gelöscht.');
                navigate("../")
            })
            .catch((error) => {
                console.error('Fehler beim Löschen des Dokuments:', error);
            });
        }
    }

    let SaveDaten= async()=>{
        const confirmed = window.confirm("Es scheint, als ob Sie Ihr Projekt abgeschlossen haben und nun Ihre Änderungen sichern möchten, bevor Sie zum Hauptmenü zurückkehren.")
        if(confirmed){
            const eventsCollectionRef = collection(db, 'Events');
            const eventDocRef = doc(eventsCollectionRef, Event.EventId);
            try {
                // Das aktualisierte Dokument in die Datenbank schreiben
                await updateDoc(eventDocRef, { EventDaten:Event });
                alert("Daten gespeichert")
            
            
            } catch (error) {
                console.error('Fehler beim Hinzufügen des Gasts:', error);
            } 
        }
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
            <h1 className="raum_name">{EventDaten.NameEvent}</h1>
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
                            onChange={(e) => {
                                const inputValue = e.target.value;
                                const selectedDate = new Date(inputValue);
                                const day = String(selectedDate.getDate()).padStart(2, '0');
                                const month = String(selectedDate.getMonth() + 1).padStart(2, '0'); // Monate sind nullbasiert, deshalb +1
                                const year = selectedDate.getFullYear();
                                const formattedDate = `${day}-${month}-${year}`;
                                setEvent({ ...Event, Date: formattedDate });
                            }}
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
                        onChange={(e)=>{e.target.value===Event.Password && PassDaten(1)}}
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
                        onChange={(e)=>{e.target.value===Event.Password && deleteEvent()}}
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