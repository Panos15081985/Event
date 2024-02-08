import { useLocation } from "react-router-dom";
import { collection ,onSnapshot,doc,updateDoc} from "firebase/firestore";
import { useState , useEffect} from "react";
import db from "../Database/Config";
import Plan from "../components/Plan";

function GastPlan(){
  const {state} = useLocation();
  const daten = state?.Data;
  const Gast=daten.data.Gast[0]
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

  useEffect(() => {
    if (gastList.length !== 0) {
      if (bookDaten.FreeChairs === 0) {
        alert("Der Tisch ist leider voll. Suchen Sie einen anderen Tisch aus.");
        setBookDaten({
          ...bookDaten,
          Table: "",
          FreeChairs: "",
          TableNumber:""
        });
      } 
    }
  }, [bookDaten.Table]);

  useEffect(()=>{
    const eventsCollectionRef = collection(db, 'Events');
    const eventDocRef = doc(eventsCollectionRef, daten.data.EventDaten.EventId);
    const unsubscribe = onSnapshot(eventDocRef, (snapshot) => {
      try {
        if (snapshot.exists()) {
          const gastData = snapshot.data().Gast;
          const raumData = snapshot.data().RaumDaten;
          const EventId = snapshot.data().EventDaten.EventId;
          if(raumData.OnlyAdmin===true){
            setOnlyAdmin(true)
          }
          setEventId(EventId)
          setRaumDaten(raumData)
          setGastList(gastData || []);
          setBookDaten({
            ...bookDaten,
            Vorname:gastData[daten.Index].Vorname,
            Nachname:gastData[daten.Index].Nachname,
            Pass:gastData[daten.Index].Pass,
            Ticket:gastData[daten.Index].Ticket,
            Rticket:gastData[daten.Index].Rticket,
            IndexGastList:daten.Index,
            Position:gastData[daten.Index].Position
          })
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
  },[])


  let deleteFromPlan=()=>{
    const userConfirmed = window.confirm("Sind Sie sicher, dass Sie ALLE gebuchten Sitzplätze stornieren möchten?");
    if(userConfirmed){
      let NewList=[...RaumDaten.Chairs];
      let NewgastList=[...gastList]
      
      bookDaten.Position.Table.forEach(function(table,Tdix){
        let index = NewList.findIndex(item => item.Table === table);
        NewList[index].Chairs.forEach(function(chair,cindex){
          if(chair.Pass===bookDaten.Pass && chair.Nachname===bookDaten.Nachname){
            NewList[index].Chairs[cindex].Vorname="";
            NewList[index].Chairs[cindex].Nachname="";
            NewList[index].Chairs[cindex].Pass="";
            NewList[index].Chairs[cindex].Status=true;
          }
        })
      })
      let Ticket = NewgastList[daten.Index].Ticket;
      NewgastList[daten.Index].Rticket=Ticket;
      NewgastList[daten.Index].Position.Table=[];
      NewgastList[daten.Index].Position.Tickets=[];
      setRaumDaten({
          ...RaumDaten,
          Chairs:NewList
      })
      setGastList(NewgastList)
    }
  }

  let ImPlan=()=>{
    if(gastList[bookDaten.IndexGastList].Rticket!==0){
      let newlistChairs=[...RaumDaten.Chairs]
      let newGastList=[...gastList]
      let bookTicket=0;
      let NumberOfChairs = numberOfCh
      console.log(newlistChairs)
      console.log(newGastList)
      let newRticket=newGastList[bookDaten.IndexGastList].Rticket
      console.log(newRticket)
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
      if(gastList[daten.Index].Rticket===0){
        setMsg("Sie haben alle Tickets erfolgreich gebucht, speichern Sie Ihre Änderungen ab.");
        setSaveDatabase(true)
      }
      setBookDaten({
        ...bookDaten,
        Table:""
      })
      setNumberOfCh("");
    }
  }
    
  let NumberOfChairs=(number)=>{
    if(gastList[daten.Index].Rticket===0){
      alert("Sie haben keine Tickets mehr ")
      setBookDaten({
        ...bookDaten,
        Table:""
      })     
    }
    else if(number > gastList[daten.Index].Rticket){
      alert("Sie haben nicht so viele Tickets");
      setNumberOfCh("");
    }
    else if(number==="0"){
      alert("Die Sitzplätze können nicht 0 sein")
    }
    else if(number > bookDaten.FreeChairs){
      alert("Es gibt nicht so viele freie Stühle an diesem Tisch")
    }
    else{
      setNumberOfCh(number)
    }
  }

  let gastSave= async()=>{
    const eventsCollectionRef = collection(db, 'Events');
    const eventDocRef = doc(eventsCollectionRef,EventId);
    try {
        // Das aktualisierte Dokument in die Datenbank schreiben
      await updateDoc(eventDocRef, { Gast: gastList ,RaumDaten:RaumDaten });
    } catch (error) {
        console.error('Fehler beim Hinzufügen des Gastes:', error);
      } 
    
    alert("Ihre Sitzplätze sind gebucht")
    setSaveDatabase(false)
    setPlanOpen(false)
  }

  let booking=()=>{
    if(gastList[daten.Index].Rticket!==0){
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
                  <li>Nachname: {gastList[daten.Index].Nachname}</li>
                  <li>Vorname: {gastList[daten.Index].Vorname}</li>
                  <li>Ihre Tickets: {gastList[daten.Index].Ticket}</li>
                  {gastList[daten.Index].Position.Table.length!==0 ?<li>
                    Ihre gebuchten Sitzplätze
                {gastList[daten.Index].Position.Table.map((Table,Idx)=>{
                  return(
                    <p key={Idx}>Tisch: {Table} gebuchte Sitzplätze: {gastList[daten.Index].Position.Tickets[Idx]}</p>
                  )
                })}</li>:<li>Keine gebuchten Sitzplätze</li>}
                </ul>
              </div>
              <p className="gastPlanText"> Kontaktieren Sie den Veranstalter, wenn Sie weitere Fragen mit Ihrem Sitzplatz haben. </p>
              {!onlyAdmin && <div className="onlyAdmin">
                <p className="gastPlanText">Sie haben die Möglichkeit Ihre Sitzplätze zu reservieren oder Ihre gebuchten Sitzplätze zu stornieren und neue zu reservieren.</p>
                <div className="onlyAdminButton">
                  {gastList[daten.Index].Ticket !== gastList[daten.Index].Rticket &&<button className="eventButton" onClick={deleteFromPlan}>stornieren</button>}
                  {gastList[daten.Index].Rticket!==0 &&<button className="eventButton" onClick={booking}>reservieren</button>}
                </div>
                {saveDatabase && <div className="saveDatabase">
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