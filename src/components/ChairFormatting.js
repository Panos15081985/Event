import { useState } from "react";

function ChairFormatting(props){
    const setUnsavedChanges=props.setUnsavedChanges;
    const chairsProTable=props.chairsProTable;
    const RaumDaten=props.RaumDaten;
    const setRaumDaten=props.setRaumDaten;
    const gastList=props.gastList;
    const setGastList=props.setGastList;
    const bookDaten=props.bookDaten;
    let setExternWindowTable=props.setExternWindowTable;
    let[indexGast,setIndexGast]=useState("")
    let searchGast=(pass)=>{
        let index = gastList.findIndex(item => item.Pass === pass);
        setIndexGast(index)
        return index
    }
 
    let deleteDaten=(cidx,chair)=>{
        if(chair.Pass!==""){
            let Chairs=RaumDaten.Chairs;
            let newGastList=[...gastList]
            let newlistTable=[...Chairs];
            let Table = Chairs[bookDaten.Table].Table
            let indegastOfList = gastList.findIndex(item => item.Pass === chair.Pass);
            let indexPosTable = gastList[indegastOfList].Position.Table.findIndex(item => item === Table)
            let Rticket =gastList[indegastOfList].Rticket
            let PosTicket = gastList[indegastOfList].Position.Tickets[indexPosTable]
            newGastList[indegastOfList].Rticket=Rticket+1;
            newGastList[indegastOfList].Position.Tickets[indexPosTable]=PosTicket-1
            if(newGastList[indegastOfList].Position.Tickets[indexPosTable]===0){
                newGastList[indegastOfList].Position.Tickets.splice(indexPosTable,1);
                newGastList[indegastOfList].Position.Table.splice(indexPosTable,1)
            }
            let Empty={
                Nachname:"",
                Vorname:"",
                Pass:"",
                Status:true
            }
            newlistTable[bookDaten.Table].Chairs[cidx]=Empty;
            setGastList(newGastList)
            setRaumDaten({
                ...RaumDaten,
                Chairs:newlistTable
            })
            setUnsavedChanges(true)
        }
    }

    let edit=(cidx)=>{
        if(indexGast!==-1 && indexGast!==""){
            if(gastList[indexGast].Rticket>0){
                let newGastList=[...gastList];
                let Rticket=newGastList[indexGast].Rticket;
                newGastList[indexGast].Rticket=Rticket-1;
                let Chairs=RaumDaten.Chairs;
                let newlistTable=[...Chairs];
                newlistTable[bookDaten.Table].Chairs[cidx].Nachname=newGastList[indexGast].Nachname;
                newlistTable[bookDaten.Table].Chairs[cidx].Vorname=newGastList[indexGast].Vorname;
                newlistTable[bookDaten.Table].Chairs[cidx].Pass=newGastList[indexGast].Pass;
                newlistTable[bookDaten.Table].Chairs[cidx].Status=false;
                let Table = Chairs[bookDaten.Table].Table
                let indexPosTable = newGastList[indexGast].Position.Table.findIndex(item => item === Table)
                if(indexPosTable===-1){
                    newGastList[indexGast].Position.Table.push(Table)
                    newGastList[indexGast].Position.Tickets.push(1)
                }
                else{
                    let Ticket = newGastList[indexGast].Position.Tickets[indexPosTable];
                    newGastList[indexGast].Position.Tickets[indexPosTable]=Ticket+1
                }
                setGastList(newGastList)
                setRaumDaten({
                    ...RaumDaten,
                    Chairs:newlistTable
                })
                setIndexGast("")
                setUnsavedChanges(true)
            }
            else{
                alert("Sie haben keine Ticket mehr")
            }
        }
    }
    
    return(
        <div >
             <div className="closeWindowCont">
                <div 
                    onClick={()=>{setExternWindowTable(false)}}
                    className="closeWindow">x
                </div>
            </div>
            <p>Tisch: {RaumDaten.Chairs[bookDaten.Table].Table}</p>
            <div className="chairFormatting">
                {chairsProTable.map((chair,cidx)=>{
                    let Chair="";
                    chair.Pass!==""?
                        Chair= <div key={cidx} className="chairFormattingChair">
                                    <div><img src="foto/chair.png" style={{width:"30px"}}/> : {cidx+1}</div>
                                    <p> {chair.Nachname} </p>
                                    <p> {chair.Pass} </p>
                                    <button className="eventButton" onClick={()=>{deleteDaten(cidx,chair)}}>delete</button>
                                </div>
                        :Chair=<div key={cidx} className="chairFormattingChair">
                                    <div><img src="foto/chair.png" style={{width:"30px"}}/> : {cidx+1}</div>
                                    <input
                                        placeholder="Pass von Gast"
                                        onChange={(event)=>{searchGast(event.target.value)}}
                                    />
                                    <button className="eventButton" onClick={()=>{edit(cidx,chair)}}>edit</button>
                                </div>
                    return Chair
                })}
            </div>
        </div>
    )
}
export default ChairFormatting;