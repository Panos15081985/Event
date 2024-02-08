import { useEffect, useState } from "react";
import { useNavigate,useLocation} from "react-router-dom";
import { collection, onSnapshot,doc,updateDoc} from "firebase/firestore";
import db from "../../Database/Config";
import PositionFormatting from "../../components/PositionFormatting";

function Gastmanagment(){
    const navigate = useNavigate();
    const {state} = useLocation();
    const EventDaten=state && state.Daten;
    const[gastDaten,setGastDaten]=useState({
        Vorname:"",
        Nachname:"",
        Ticket:"",
        Rticket:"",
        Pass:"",
        Position:{
            Table:[],
            Tickets:[]
        }
    });
    let[gastList,setGastList]=useState([]);
    let[searchG,setSearchG]=useState({Index:-1});
    let[RaumDaten,setRaumDaten]=useState("")
    let[showGuestList,setShowGuestList]=useState(false);
    const [unsavedChanges, setUnsavedChanges] = useState(false);

    useEffect(()=>{
        const eventsCollectionRef = collection(db, 'Events');
        const eventDocRef = doc(eventsCollectionRef, EventDaten.EventId);
        const unsubscribe = onSnapshot(eventDocRef, (snapshot) => {
          try {
            if (snapshot.exists()) {
              const gastData = snapshot.data().Gast;
              const raumData = snapshot.data().RaumDaten
              setRaumDaten(raumData)
              setGastList(gastData || []);
            } else {
              console.log('Das angegebene Event-Dokument existiert nicht.');
              setGastList([]); // Setzen Sie die Gastliste auf ein leeres Array, wenn das Dokument nicht existiert
            }
          } catch (error) {
            console.error('Fehler beim Verarbeiten des Snapshot:', error);
          }
        });
        return () => {
          unsubscribe(); // Den Listener bei Bedarf deaktivieren, um mögliche Lecks zu vermeiden
        };
    },[EventDaten.EventId])

    useEffect(() => {
        const handleBeforeUnload = (event) => {
          if (unsavedChanges) {
            const message = 'Sie haben möglicherweise ungespeicherte Änderungen. Wollen Sie die Seite wirklich verlassen?';
            event.returnValue = message;
            return message;
          }
        };
        const handlePopState = () => {
          if (unsavedChanges && window.confirm('Sie haben möglicherweise ungespeicherte Änderungen. Wollen Sie die Seite wirklich verlassen?')) {
            navigate('/AdminPage'); // Navigieren Sie zur AdminPage, wenn der Benutzer bestätigt
          }
        };
    
        window.addEventListener('beforeunload', handleBeforeUnload);
        window.addEventListener('popstate', handlePopState);
    
        return () => {
          window.removeEventListener('beforeunload', handleBeforeUnload);
          window.removeEventListener('popstate', handlePopState);
        };
      }, [unsavedChanges, navigate]);
    
    let randomPass=()=>{
        let length=7
        const characters = 'ABCDEFGHIJKLMNPQRSTUVWXYZ123456789';
        let randomId = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            randomId += characters.charAt(randomIndex);
        }
        setGastDaten({
            ...gastDaten,
            Pass:randomId
        })
    }

    let GastsList=()=>{
        if(
            gastDaten.Vorname!==""&&
            gastDaten.Nachname!==""&&
            gastDaten.Ticket!==""&&
            gastDaten.Pass!==""
        ){
            setGastList([
                ...gastList,
                gastDaten
            ])
            setGastDaten({
                Vorname:"",
                Nachname:"",
                Ticket:"",
                Rticket:"",
                Pass:"",
                Position:{
                    Table:[],
                    Tickets:[]
                }
            })
            setUnsavedChanges(true)
        }
        else{
            alert("alle Felder auffühlen")
        }
    }

    let gastSave= async()=>{
        const confirmed = window.confirm("Es scheint, als ob Sie Ihr Projekt abgeschlossen haben und nun Ihre Änderungen sichern möchten, bevor Sie zum Menü zurückkehren.")
        if(confirmed){
            const eventsCollectionRef = collection(db, 'Events');
            const eventDocRef = doc(eventsCollectionRef, EventDaten.EventId);
            try {
                // Das aktualisierte Dokument in die Datenbank schreiben
                await updateDoc(eventDocRef, { Gast: gastList ,RaumDaten:RaumDaten });
            } catch (error) {
                console.error('Fehler beim Hinzufügen des Gasts:', error);
            }
            setUnsavedChanges(false)
        } 
    }

    let search=(Nachname)=>{
        let index = gastList.findIndex(item => item.Nachname === Nachname);
        console.log(index)
        index!==-1?
        setSearchG({
            Vorname:gastList[index].Vorname,
            Nachname:gastList[index].Nachname,
            Ticket:gastList[index].Ticket,
            Rticket:gastList[index].Rticket,
            Pass:gastList[index].Pass,
            Position:gastList[index].Position,
            Index:index
        })
        :setSearchG({
            msg:"Kein Ergebniss",
            Index:index
        })

    }

    let edit=(gastNum)=>{
        alert("Die Daten vom Gast werden bei Import Gäste laden. Sie können die Daten ändern und wieder in der Liste hinzufügen")
        setGastDaten({
            Vorname: gastList[gastNum].Vorname,
            Nachname: gastList[gastNum].Nachname,
            Ticket: gastList[gastNum].Ticket,
            Rticket:gastList[gastNum].Rticket,
            Pass: gastList[gastNum].Pass,
            Position:gastList[gastNum].Position
        })
        deleteGast(gastNum)
        setUnsavedChanges(true)
    }

    let deleteGast=(gastNum)=>{
        let NewList=[...gastList];
        let Chairs=RaumDaten.Chairs
        let newlistChairs=[...Chairs]
        if(NewList[gastNum].Position.Table.length!==0){
            alert("Die Daten von Gast werden automatisch von Plan gelöscht werden")
            NewList[gastNum].Position.Table.forEach(tableNumber => {
                let index = newlistChairs.findIndex(item => item.Table === tableNumber);
                newlistChairs[index].Chairs.forEach(function(chair,cindex){
                    if(chair.Pass===NewList[gastNum].Pass){
                        let Empty={
                            Nachname:"",
                            Vorname:"",
                            Pass:"",
                            Status:true
                        }
                        newlistChairs[index].Chairs[cindex]=Empty
                    }
                })
            });
        }
        setRaumDaten({
            ...RaumDaten,
            Chairs:newlistChairs
        })
        NewList.splice(gastNum,1);
        setGastList(NewList)
        setSearchG({Index:-1})
        setUnsavedChanges(true)
    }

    let backToMenu=()=>{
        const confirmed = window.confirm("Es scheint, als ob Sie Ihr Projekt abgeschlossen haben und nun Ihre Änderungen sichern möchten, bevor Sie zum Menü zurückkehren.")
        if(confirmed)
            navigate("../AdminPage",{ state: { Daten: EventDaten } })
    }
   
    return(
        <div className="guestCont">
            <h1 className="raum_name">{EventDaten.NameEvent}</h1>
            <div className="guestContGeneralText">
                <button className="eventButton" onClick={backToMenu}>zurück zum Menu</button>
                <h3 className="settings_ConTitle">Gastmanagment</h3>
                <p>Sie haben die Möglichkeit, Ihre Gäste in die Gästeliste zu importieren und ein Passwort zu
                generieren, damit sie ihren Sitzplatz finden oder diesen selbstständig buchen können. Zudem
                können Sie Ihre Tische nach Bedarf verwalten. Vergessen Sie nicht, Ihr Projekt zu speichern, 
                bevor Sie die Seite verlassen, um sicherzustellen, dass alle vorgenommenen Änderungen gesichert sind</p>
            </div>
            <div className="sucheGuest">
                <div className="sucheInput">
                    <p>Suche</p>
                    <input
                        placeholder="Suche nach Nachname"
                        onChange={(event)=>{search(event.target.value)}}
                    />
                </div>
                <div className="SucheCont">
                    {searchG.Index===-1 ? <p>{searchG.msg}</p>
                        : <div className="sucheTable">
                            <table className="guestTable">
                                <tbody>
                                    <tr>
                                        <td>Vorname</td>
                                        <td>Nachname</td>
                                        <td>Ticket</td>
                                        <td>RestTicket</td>
                                        <td>Password</td>
                                        <td>Tisch<br/>Tickets</td>
                                    </tr>
                                    <tr>
                                        <td>{searchG.Vorname}</td>
                                        <td>{searchG.Nachname}</td>
                                        <td>{searchG.Ticket}</td>
                                        <td>{searchG.Rticket}</td>
                                        <td>{searchG.Pass}</td>
                                        <td><div className="gastListTdTables">{searchG.Position.Table.map((Table,tabidx)=>{
                                            return(<p key={tabidx}>{Table}</p>)
                                            })}</div>
                                            <div className="gastListTdTables"> {searchG.Position.Tickets.map((ticket,ticidx)=>{
                                                            return(<p key={ticidx}>{ticket}</p>)
                                                    })} </div>
                                        </td>
                                        <td className="deleteGuest" onClick={()=>{deleteGast(searchG.Index)}}>x</td>
                                        <td className="editGuest" onClick={()=>{edit(searchG.Index)}}>edit</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    }
                </div>
            </div>
            <div className="guestPlan">
                <div>  
                    <div className="guestOptions">
                        <div className="importGuest">
                            <p>Import Gäste</p>
                            <input
                                placeholder="Vorname"
                                onChange={(event)=>{
                                    setGastDaten({
                                        ...gastDaten,
                                        Vorname:event.target.value
                                    })
                                }}
                                value={gastDaten.Vorname}
                            />
                            <input
                                placeholder="Nachname"
                                onChange={(event)=>{
                                    setGastDaten({
                                        ...gastDaten,
                                        Nachname:event.target.value
                                    })
                                }}
                                value={gastDaten.Nachname}
                            />
                            <input
                                placeholder="Tickets/Einlandungen"
                                onChange={(event)=>{
                                    setGastDaten({
                                        ...gastDaten,
                                        Ticket:event.target.value,
                                        Rticket:event.target.value
                                    })
                                }}
                                value={gastDaten.Ticket}
                            />
                            <p className="guestOptionsTextPass">Erzeugen Sie ein Password für den Gast</p>
                            <div className="guestPass">
                                <button onClick={randomPass}>Password: </button>
                                <p>{gastDaten.Pass}</p>
                            </div>
                            <div  className="event_button">
                                <button className="eventButton" onClick={GastsList}>In der Liste hinzufügen</button>
                            </div>
                            <div style={{marginTop:"20px"}}>
                                <input
                                    type="checkbox"
                                    checked={showGuestList}
                                    onChange={()=>{setShowGuestList(!showGuestList)}}
                                    />
                                <label style={{marginLeft:"5px"}}>Gastliste ansehen</label>
                            </div>
                        </div>
                        <div className="guestSave">
                            <p>Projekt Speichern</p>
                            <button className="eventButton" onClick={gastSave}>Speichern</button>
                        </div>
                    </div>
                </div>
                <div className="positionFormatting">
                {showGuestList && <div className="guestList">
                <div className="closeWindowCont">
                    <div 
                        onClick={()=>{setShowGuestList(!showGuestList)}}
                        className="closeWindow">x
                    </div>
                </div>
                <div className="guestListTable">
                    <table className="guestTable">
                        <tbody>
                            <tr>
                                <td>Vorname</td>
                                <td>Nachname</td>
                                <td>Ticket</td>
                                <td>RestTicket</td>
                                <td>Password</td>
                                <td>Tisch<br/>Stühle</td>
                            </tr>
                            {gastList.map((Gast,gidx)=>{
                            return(
                                <tr key={gidx}>
                                    <td>{Gast.Vorname}</td>
                                    <td>{Gast.Nachname}</td>
                                    <td>{Gast.Ticket}</td>
                                    <td>{Gast.Rticket}</td>
                                    <td>{Gast.Pass}</td>
                                    <td><div className="gastListTdTables">{Gast.Position.Table.map((Table,tabidx)=>{
                                            return(<p key={tabidx}>{Table}</p>)
                                            })}</div>
                                            <div className="gastListTdTables"> {Gast.Position.Tickets.map((ticket,ticidx)=>{
                                                    return(<p key={ticidx}>{ticket}</p>)
                                            })} </div>
                                    </td>
                                    <td className="deleteGuest w3-padding w3-xlarge w3-text-white " onClick={()=>{deleteGast(gidx)}}><i className="fa fa-trash"></i></td>
                                    <td className="editGuest" onClick={()=>{edit(gidx)}}>edit</td>
                                </tr>
                            )
                        })}
                        </tbody>
                    </table>
                </div>
            </div>}
                    <PositionFormatting 
                        RaumDaten = {RaumDaten}
                        setRaumDaten = {setRaumDaten} 
                        gastList={gastList}
                        setGastList={setGastList}
                        setUnsavedChanges={setUnsavedChanges}
                    />
                </div>
            </div> 
        </div>
        
    )}
export default Gastmanagment;        
           
            

        
