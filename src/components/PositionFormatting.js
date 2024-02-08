import { useState } from "react";
import ChairFormatting from "./ChairFormatting";
import Plan from "./Plan";


function PositionFormatting(props){
    const setUnsavedChanges=props.setUnsavedChanges
    const RaumDaten=props.RaumDaten;
    const setRaumDaten=props.setRaumDaten;
    const gastList=props.gastList;
    const setGastList=props.setGastList
    let[externWindowTable,setExternWindowTable]=useState(false);
    let[bookDaten,setBookDaten]=useState({
        Table:"",
        FreeChairs:"",
        Vorname:"",
        Nachname:"",
        Pass:"",
        Rticket:"",
        IndexGastList:""
    });
    let[book,setBook]=useState(false)
    let[chairsProTable,setChairsProTable]=useState([]);
    let Chairs=[]
    if(RaumDaten!==""){
        Chairs= RaumDaten.Chairs
    }
    
    let booking=()=>{
        if(bookDaten.FreeChairs!==0 && bookDaten.Table!==""){
            setBook(true)
        }
        else if(bookDaten.FreeChairs===0){
            alert("es gibt keinen freien Platz")
        }
        else{
            alert("Suchen Sie ein Tisch aus")
        }
    }
    let searchGastList=(pass)=>{
        let index = gastList.findIndex(item => item.Pass === pass);
        if(index!==-1 && gastList[index].Rticket > 0){
            setBookDaten({
                ...bookDaten,
                Vorname:gastList[index].Vorname,
                Nachname:gastList[index].Nachname,
                Pass:gastList[index].Pass,
                Rticket:gastList[index].Rticket,
                IndexGastList:index
            })
        }

        else if( index!==-1 && gastList[index].Rticket === 0){alert("Sie haben keine Ticket mehr")}
      
    }

    let ImPlan=()=>{
        if( bookDaten.Pass!==""){
                let newlistChairs=[...Chairs]
                let newGastList=[...gastList]
                let bookTicket=0;
                let newRticket=newGastList[bookDaten.IndexGastList].Rticket
                newlistChairs[bookDaten.Table].Chairs.forEach(function(chair,cidx){
                    if(chair.Status===true && newRticket>bookTicket){
                        bookTicket++
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
                PositionTicketsGast.push(bookTicket)
                PositionTableGast.push(PositionTable) 
                setRaumDaten({
                    ...RaumDaten,
                    Chairs:newlistChairs
                })
                setGastList(newGastList)
                setBook(!book)
                setBookDaten({
                    Table:"",
                    FreeChairs:"",
                    Vorname:"",
                    Nachname:"",
                    Pass:"",
                    Rticket:"",
                    IndexGastList:""
                })
                setUnsavedChanges(true)
                alert("booking coplete")
        }
        else{alert("Falsche Password")}
    }

    let cancelation=()=>{
        if(bookDaten.Table!==""){
            let table=Chairs[bookDaten.Table];
            let Chair=table.Chairs;
            setChairsProTable(Chair)
            setExternWindowTable(true)
            setUnsavedChanges(true)
        }
        else(alert("Suchen Sie ein Tisch aus"))
    }
    let PlanEntleeren=()=>{
        const userConfirmed = window.confirm("Sind Sie sicher, dass Sie komplet das plan entleeren möchten?");
        if(userConfirmed){
            let NewList=[...Chairs];
            let NewgastList=[...gastList]
            NewList.forEach(function(Table,tindex){
                Table.Chairs.forEach(function(chair,cindex){
                    NewList[tindex].Chairs[cindex].Vorname=""
                    NewList[tindex].Chairs[cindex].Nachname=""
                    NewList[tindex].Chairs[cindex].Pass=""
                    NewList[tindex].Chairs[cindex].Status=true
                })
            })
            NewgastList.forEach(function(gast,gidx){
                let ZTicket =NewgastList[gidx].Ticket;
                NewgastList[gidx].Rticket=ZTicket;
                NewgastList[gidx].Position={Table:[],Tickets:[]}
            })
            setBookDaten({})
            setGastList(NewgastList)
            setRaumDaten({
                ...RaumDaten,
                Chairs:NewList
            })
            setUnsavedChanges(true)
        }
    }
  
    return(
        <div className="position">
            <div className="positionMenu1">
                {bookDaten.Table!=="" &&<div className="positionMenu2">
                    <p>Tisch Nummer: {bookDaten.TableNumber}</p>
                    {!book &&<button className="eventButton" onClick={()=>{booking()}}>Tisch reservieren</button>}
                    {book &&
                        <div >
                            <input
                            placeholder="Password"
                            onChange={(event)=>{searchGastList(event.target.value)}}
                            />
                            <button className="eventButton" onClick={ImPlan}>Im Plan hinzufügen</button>
                        </div>
                    }
                    <button className="eventButton" onClick={()=>{cancelation()}}>Stühle reservieren</button>
                </div>}
                <button className="eventButton" onClick={PlanEntleeren}>Plan entleeren</button>
            </div>
            <p className="positionFormattingText">Wählen Sie erst einen Tisch aus, den Sie verwalten möchten. 
                Sie haben die Möglichkeit entweder sämtliche Tickets eines Gastes auf einmal zu buchen, durch 
                Drücken der Option <span>'Tisch reservieren'</span>oder aber die Stühle an einem Tisch einzeln 
                zu buchen, durch Drücken der Option <span>'Stühle reservieren'</span>.</p>
            {RaumDaten!=="" && <div className="positionPlan"><Plan 
                                    RaumDaten={RaumDaten} 
                                    setBookDaten={setBookDaten} 
                                    bookDaten={bookDaten}
                                    /> </div>}
                {externWindowTable && <div className="chairFormattingContainer">
                    <ChairFormatting
                    chairsProTable={chairsProTable}
                    gastList={gastList}
                    setGastList={setGastList}
                    RaumDaten={RaumDaten}
                    setRaumDaten={setRaumDaten}
                    bookDaten={bookDaten}
                    setExternWindowTable={setExternWindowTable}
                    setUnsavedChanges={setUnsavedChanges}
                 />
                </div>}
        </div>
    )
}
export default PositionFormatting;