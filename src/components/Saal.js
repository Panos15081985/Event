import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import db from "../Database/Config";
import { useNavigate } from "react-router-dom";
import { collection,doc,getDoc,updateDoc} from "firebase/firestore";
function Saal(){
    const navigate=useNavigate();
    const {state} = useLocation();
    const daten = state.RaumDaten;
    const data = daten.Raum
    const eventData = daten.EventData;
    const [onlyAdmin,setOnlyAdmin]=useState(false);
    // One entry per row of the room (the row count comes from Raummanagment)
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const horizontalArray = Array.from({ length: Number(data.horizontal) }, (_, index) => alphabet[index]);
   
    const[chairsTable,setChairsTable]=useState("")
    const[chairSeparate,setChairSeparate]=useState(false)
    const[chairProTable,setChairProTable]=useState([]);
    useEffect(()=>{
        setChairProTable([])
        setChairsTable("")
    },[chairSeparate])
  

    const emptyChairs=(count)=>Array.from({length:count}, () => ({
        Vorname: "",
        Nachname: "",
        Pass: "",
        Status: true
    }))

    let chairFunction=(value,table)=>{
        const chair = parseInt(value);
        const valid = Number.isInteger(chair) && chair > 0;
        if(chairSeparate){
            // Replace the entry of this table instead of adding a duplicate
            setChairProTable((prev)=>{
                const others = prev.filter(item => item.Table !== table);
                return valid ? [...others,{ Ch:chair, Table:table, Chairs:emptyChairs(chair) }] : others;
            })
        }
        else{
            setChairsTable(value)
            setChairProTable(valid
                ? data.Table.map((table) => ({ Ch:chair, Table:table, Chairs:emptyChairs(chair) }))
                : [])
        }
    }
    
    let ok= async ()=>{
        const missing = data.Table.filter(table => !chairProTable.some(item => item.Table === table));
        if(missing.length!==0){
            alert("Bitte geben Sie für jeden Tisch die Anzahl der Stühle ein (eine Zahl größer als 0)")
            return;
        }
        let Data={
            Chairs:chairProTable,
            DanceFloor:data.dance,
            Tables:data.Table,
            Rows:horizontalArray,
            cells:data.vertical,
            OnlyAdmin:onlyAdmin,
            RoundTable:data.RoundTable
        }
    
        try{
            const collectionRef = collection(db,"Events");
            const eventRef = doc(collectionRef,data.EventId);
            // A new plan replaces all tables, so existing seat bookings of guests are reset
            const snapshot = await getDoc(eventRef);
            const gaeste = Array.isArray(snapshot.data()?.Gast) ? snapshot.data().Gast : [];
            const hasBookings = gaeste.some(gast => gast.Position && gast.Position.Table.length !== 0);
            if(hasBookings && !window.confirm("Der neue Plan ersetzt den alten. Alle gebuchten Sitzplätze der Gäste werden zurückgesetzt. Fortfahren?")){
                return;
            }
            const resetGaeste = gaeste.map(gast => ({
                ...gast,
                Rticket: gast.Ticket,
                Position: { Table: [], Tickets: [] }
            }));
            await updateDoc(eventRef,{"RaumDaten":Data, "Gast":resetGaeste});
            navigate("../AdminPage",{ state: { Daten: eventData } })
        }
        catch(error){
            console.error(error)
            alert("Der Plan konnte nicht gespeichert werden")
        }
 
      
    }
    return(
        <div className="raum_cont">
            <div className="raum_options">
                <div>
                    {!chairSeparate && <div>
                        <p>Wie viele Stühle hat jeden Tisch:</p>
                        <input
                        placeholder="Stühle"
                        type="number"
                        min="1"
                        onChange={(event)=>{chairFunction(event.target.value)}}
                        value={chairsTable}
                    /></div>}
                </div>
                <div className="raum_checkbox">
                    <div>
                        <p> Hat Jeden Tisch unterschiedlische Stühle?</p>
                        <input
                        type="checkbox"
                        checked={chairSeparate}
                        onChange={()=>{setChairSeparate(!chairSeparate)}}
                        />
                        <label>Ja</label>
                    </div>
                    <div>
                        <p>Wer soll die Stühle buchen können:</p>
                        <input
                            type="checkbox"
                            checked={onlyAdmin}
                            onChange={()=>{setOnlyAdmin(!onlyAdmin)}}
                            />
                        <label>Nur Veranstalter</label>
                    </div>
                </div>
                <div className="event_button" style={{textAlign:"center"}}>
                    <button className="eventButton" onClick={()=>{ok()}}>Mein Plan ist fertig</button>
                </div>
            </div>
            <div  className="chairs_plan">
                <div style={{marginTop:"20px"}}>
                    <table>
                        <tbody>
                            {horizontalArray.map((tr,trix)=>{
                            let nummerDanceFloor=true
                                return(
                                    <tr key={trix}>
                                        {data.vertical.map((td,tdix)=>{
                                            let pos=trix+""+tdix;
                                            let dance=data.dance.includes(pos);
                                            let Table=data.Table.includes(pos)
                                            let table=<td key={tdix} className="tdEmpty"></td>
                                            let numT=0
                                            if(dance && nummerDanceFloor===true){
                                                data.dance.forEach((number) => {
                                                if(number[0]===pos[0]){
                                                    numT+=1
                                                }
                                                
                                                })
                                                table= <td key={tdix} colSpan={numT} className="danceFloor">Dancefloor</td>
                                                nummerDanceFloor=false
                                            }
                                            else if(dance){table=""}
                                            else if(Table){
                                                table= <td key={tdix} className={data.RoundTable ? "roundTable" : "tableKomplet"}>Tisch{chairSeparate ?
                                                                                <div className="chairsInput">
                                                                                    <label>Stühle:</label>
                                                                                    <input
                                                                                        placeholder="Zahl"
                                                                                        type="number"
                                                                                        min="1"
                                                                                        onBlur={(event)=>{chairFunction(event.target.value,pos)}}
                                                                                    /> 
                                                                                </div>   
                                                                               
                                                                                :<div>
                                                                                    Stühle:{chairsTable}
                                                                                </div>  }</td>
                                            }
                                            return table
                                        })}
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
export default Saal;