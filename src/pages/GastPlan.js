import { useLocation } from "react-router-dom";
import { collection ,onSnapshot,doc,updateDoc} from "firebase/firestore";
import { useState , useEffect} from "react";
import db from "../Database/Config";
import Plan from "../components/Plan";
import { normalizeGuests } from "../guestData";

function GastPlan(){
  const {state} = useLocation();
  const daten = state?.Data;
  const gastIndex = daten.Index;
  const eventId = daten.data.EventDaten.EventId;
  const Gast = normalizeGuests(daten.data.Gast)[gastIndex];
  let[planOpen,setPlanOpen]=useState(false)
  let[EventId,setEventId]=useState("")
  let[numberOfCh,setNumberOfCh]=useState("")
  let[msg,setMsg]=useState("");
  let[saveDatabase,setSaveDatabase]=useState(false)
  let[onlyAdmin,setOnlyAdmin]=useState(false)
  let[RaumDaten,setRaumDaten]=useState("");
  let[gastList,setGastList]=useState([]);
  let[bookDaten,setBookDaten]=useState({
    Table:"",
    FreeChairs:"",
    TableNumber:"",
    Vorname:Gast.Vorname,
    Nachname:Gast.Nachname,
    Pass:Gast.Pass,
    Ticket:Gast.Ticket,
    Rticket:Gast.Rticket,
    IndexGastList:daten.Index,
    Position:Gast.Position
  })

  // A full table cannot be selected
  useEffect(() => {
    if (bookDaten.FreeChairs === 0) {
      alert("Der Tisch ist leider voll. Suchen Sie einen anderen Tisch aus.");
      setBookDaten((prev) => ({
        ...prev,
        Table: "",
        FreeChairs: "",
        TableNumber:""
      }));
    }
  }, [bookDaten.Table, bookDaten.FreeChairs]);

  useEffect(()=>{
    const eventsCollectionRef = collection(db, 'Events');
    const eventDocRef = doc(eventsCollectionRef, eventId);
    const unsubscribe = onSnapshot(eventDocRef, (snapshot) => {
      try {
        if (snapshot.exists()) {
          const gastData = normalizeGuests(snapshot.data().Gast);
          const raumData = snapshot.data().RaumDaten;
          setOnlyAdmin(raumData.OnlyAdmin===true)
          setEventId(snapshot.data().EventDaten.EventId)
          setRaumDaten(raumData)
          setGastList(gastData);
          const gast = gastData[gastIndex];
          if (gast) {
            setBookDaten((prev) => ({
              ...prev,
              Vorname:gast.Vorname,
              Nachname:gast.Nachname,
              Pass:gast.Pass,
              Ticket:gast.Ticket,
              Rticket:gast.Rticket,
              IndexGastList:gastIndex,
              Position:gast.Position
            }))
          }
        } else {
          console.log('Das angegebene Event-Dokument existiert nicht.');
          setGastList([]);
          setRaumDaten([]); // Setzen Sie die Gastliste auf ein leeres Array, wenn das Dokument nicht existiert
        }
      } catch (error) {
        console.error('Fehler beim Verarbeiten des Snapshot:', error);
      }
    });
    return () => {
      unsubscribe(); // Den Listener bei Bedarf deaktivieren, um mögliche Lecks zu vermeiden
    };
  },[eventId, gastIndex])


  let deleteFromPlan=()=>{
    const userConfirmed = window.confirm("Sind Sie sicher, dass Sie ALLE gebuchten Sitzplätze stornieren möchten?");
    if(userConfirmed){
      let NewList=[...RaumDaten.Chairs];
      let NewgastList=[...gastList]
      
      bookDaten.Position.Table.forEach(function(table,Tdix){
        let index = NewList.findIndex(item => item.Table === table);
        if(index===-1) return;
        NewList[index].Chairs.forEach(function(chair,cindex){
          if(chair.Pass===bookDaten.Pass && chair.Nachname===bookDaten.Nachname){
            NewList[index].Chairs[cindex].Vorname="";
            NewList[index].Chairs[cindex].Nachname="";
            NewList[index].Chairs[cindex].Pass="";
            NewList[index].Chairs[cindex].Status=true;
          }
        })
      })
      let Ticket = NewgastList[gastIndex].Ticket;
      NewgastList[gastIndex].Rticket=Ticket;
      NewgastList[gastIndex].Position.Table=[];
      NewgastList[gastIndex].Position.Tickets=[];
      setRaumDaten({
          ...RaumDaten,
          Chairs:NewList
      })
      setGastList(NewgastList)
      setPlanOpen(false)
      setMsg("Ihre Sitzplätze wurden storniert, speichern Sie Ihre Änderungen ab.")
      setSaveDatabase(true)
    }
  }

  let ImPlan=()=>{
    const anzahl = parseInt(numberOfCh);
    if(gastList[bookDaten.IndexGastList].Rticket!==0 && anzahl > 0){
      let newlistChairs=[...RaumDaten.Chairs]
      let newGastList=[...gastList]
      let bookTicket=0;
      let NumberOfChairs = anzahl
      let newRticket=newGastList[bookDaten.IndexGastList].Rticket
      newlistChairs[bookDaten.Table].Chairs.forEach(function(chair,cidx){
          if(chair.Status===true && NumberOfChairs!==0){
              bookTicket++
              NumberOfChairs--
              newlistChairs[bookDaten.Table].Chairs[cidx].Vorname=gastList[bookDaten.IndexGastList].Vorname;
              newlistChairs[bookDaten.Table].Chairs[cidx].Nachname=gastList[bookDaten.IndexGastList].Nachname;
              newlistChairs[bookDaten.Table].Chairs[cidx].Pass=gastList[bookDaten.IndexGastList].Pass;
              newlistChairs[bookDaten.Table].Chairs[cidx].Status=false;
              
          }
      })
      newGastList[bookDaten.IndexGastList].Rticket=newRticket-bookTicket
      let PositionTableGast= newGastList[bookDaten.IndexGastList].Position.Table;
      let PositionTicketsGast= newGastList[bookDaten.IndexGastList].Position.Tickets;
      let PositionTable=newlistChairs[bookDaten.Table].Table;
      let ExistTable=PositionTableGast.findIndex(Table=>Table===PositionTable);
      if(ExistTable!==-1){
        let existTicket= PositionTicketsGast[ExistTable];
        PositionTicketsGast[ExistTable]=existTicket+bookTicket
      }
      else{
        PositionTicketsGast.push(bookTicket)
        PositionTableGast.push(PositionTable) 
      }
      setRaumDaten({
          ...RaumDaten,
          Chairs:newlistChairs
      })
      setGastList(newGastList)
      if(newGastList[gastIndex].Rticket===0){
        setMsg("Sie haben alle Tickets erfolgreich gebucht, speichern Sie Ihre Änderungen ab.");
      }
      else{
        setMsg("Sitzplätze hinzugefügt. Sie können weitere Sitzplätze buchen oder Ihre Änderungen speichern.");
      }
      setSaveDatabase(true)
      setBookDaten({
        ...bookDaten,
        Table:""
      })
      setNumberOfCh("");
    }
  }
    
  let NumberOfChairs=(value)=>{
    if(value===""){
      setNumberOfCh("");
      return;
    }
    const number = parseInt(value);
    if(gastList[gastIndex].Rticket===0){
      alert("Sie haben keine Tickets mehr ")
      setBookDaten({
        ...bookDaten,
        Table:""
      })     
    }
    else if(!Number.isInteger(number) || number < 1){
      alert("Bitte geben Sie eine Zahl größer als 0 ein")
      setNumberOfCh("");
    }
    else if(number > gastList[gastIndex].Rticket){
      alert("Sie haben nicht so viele Tickets");
      setNumberOfCh("");
    }
    else if(number > bookDaten.FreeChairs){
      alert("Es gibt nicht so viele freie Stühle an diesem Tisch")
    }
    else{
      setNumberOfCh(String(number))
    }
  }

  let gastSave= async()=>{
    const eventsCollectionRef = collection(db, 'Events');
    const eventDocRef = doc(eventsCollectionRef,EventId);
    try {
      // Das aktualisierte Dokument in die Datenbank schreiben
      await updateDoc(eventDocRef, { Gast: gastList ,RaumDaten:RaumDaten });
      alert("Ihre Änderungen sind gespeichert")
      setSaveDatabase(false)
      setPlanOpen(false)
      setMsg("")
    } catch (error) {
      console.error('Fehler beim Speichern:', error);
      alert("Die Änderungen konnten nicht gespeichert werden")
    }
  }

  let booking=()=>{
    if(gastList[gastIndex].Rticket!==0){
      setMsg("Suchen Sie einen Tisch aus, wo Sie Ihre Sitzplätze reservieren möchten");
      setPlanOpen(true)
    }
    else{
      setMsg("Wenn Sie neue Sitzplätze möchten, müssen Sie zuerst Ihre gebuchten Sitzplätze stornieren");
    }
  }

  return(
      <div className="gastPlanCont">
        {gastList.length!==0 && 
          <div>
              <h1>{daten.data.EventDaten.NameEvent}</h1>
              <div className="w3-container">
                <ul className="w3-ul w3-card">
                  <li>Nachname: {gastList[gastIndex].Nachname}</li>
                  <li>Vorname: {gastList[gastIndex].Vorname}</li>
                  <li>Ihre Tickets: {gastList[gastIndex].Ticket}</li>
                  {gastList[gastIndex].Position.Table.length!==0 ?<li>
                    Ihre gebuchten Sitzplätze
                {gastList[gastIndex].Position.Table.map((Table,Idx)=>{
                  return(
                    <p key={Idx}>Tisch: {Table} gebuchte Sitzplätze: {gastList[gastIndex].Position.Tickets[Idx]}</p>
                  )
                })}</li>:<li>Keine gebuchten Sitzplätze</li>}
                </ul>
              </div>
              <p className="gastPlanText"> Kontaktieren Sie den Veranstalter, wenn Sie weitere Fragen mit Ihrem Sitzplatz haben. </p>
              {!onlyAdmin && <div className="onlyAdmin">
                <p className="gastPlanText">Sie haben die Möglichkeit Ihre Sitzplätze zu reservieren oder Ihre gebuchten Sitzplätze zu stornieren und neue zu reservieren.</p>
                <div className="onlyAdminButton">
                  {gastList[gastIndex].Ticket !== gastList[gastIndex].Rticket &&<button className="eventButton" onClick={deleteFromPlan}>stornieren</button>}
                  {gastList[gastIndex].Rticket!==0 &&<button className="eventButton" onClick={booking}>reservieren</button>}
                </div>
                {saveDatabase && <div className="saveDatabase">
                  {!planOpen && msg && <p>{msg}</p>}
                  <p>Speichern Sie bitte Ihre Änderungen bevor Sie die Seite verlassen</p>
                  <button className="eventButton" onClick={gastSave}>Änderungen speichern</button>
                </div>}
               
            	</div>}
            </div>}
          {planOpen && 
          <div className="gastPlanOpen">
            <p className="gastPlanText">{msg}</p>
            <div className="planOpenPlan">
              <Plan
              setBookDaten={setBookDaten}
              RaumDaten={RaumDaten}
              bookDaten={bookDaten}
              />
            </div>
            {bookDaten.Table!=="" && 
            <div className="gastPlanSet">
              <p>Wie viele Sitzplätze möchten Sie an Tisch Nummer: {bookDaten.TableNumber} reservieren?</p>
              <input
                placeholder="Anzahl Sitzplätze"
                type="number"
                min="1"
                onChange={(e)=>{NumberOfChairs(e.target.value)}}
                value={numberOfCh}
              />
              {numberOfCh!=="" && <div style={{marginTop: "20px"}}>
              <button className="eventButton" onClick={ImPlan}>hinzufügen</button>
              </div>}
              
            </div>}
          </div>}
      </div>
    )
}
export default GastPlan;