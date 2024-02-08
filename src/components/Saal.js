import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import db from "../Database/Config";
import { useNavigate } from "react-router-dom";
import { collection,doc,updateDoc} from "firebase/firestore";
function Saal(){
    const navigate=useNavigate();
    const {state} = useLocation();
    const daten = state.RaumDaten;
    const data = daten.Raum
    const eventData = daten.EventData;
    const [onlyAdmin,setOnlyAdmin]=useState(false);
    let maxNumber = Math.max(...data.Table.map(Number));
    let maxNumberstring=maxNumber.toString();
    let ziffern=maxNumberstring.split("");
    let horizontal= parseFloat(ziffern[0])
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const horizontalArray = Array.from({ length: horizontal+1 }, (_, index) => alphabet[index]);
   
    const[chairsTable,setChairsTable]=useState("")
    const[chairSeparate,setChairSeparate]=useState(false)
    const[chairProTable,setChairProTable]=useState([]);
    useEffect(()=>{
        setChairProTable([])
        setChairsTable("")
    },[chairSeparate])
  

    let chairFunction=(chair,table)=>{
        const Chairs= Array.from({length:chair}, (_, index) => index + 1)
        if(chairSeparate){
            let Table = {
                Ch:chair,
                Table:table,
                Chairs: Chairs.map((chair) => ({
                  Vorname: "",
                  Nachname: "",
                  Pass: "",
                  Status: true
                }))
              };
              console.log(Table)
              setChairProTable((prev)=>([
                ...prev,Table
              ]))
        }
        else{
            const Tables = data.Table.map((table) => ({
                Ch:chair,
                Table:table,
                Chairs: Chairs.map((Chair) => ({
                    Vorname: "",
                    Nachname: "",
                    Pass: "",
                    Status:true
                }))}
            ))
            setChairsTable(chair)
            setChairProTable(Tables)
        }
    }
    
    let ok= async ()=>{
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
        await updateDoc(doc(collectionRef,data.EventId),{"RaumDaten":Data});
        }
        catch(error){
            console.log(error)
        }
        
        navigate("../AdminPage",{ state: { Daten: eventData } })
 
      
    }
    return(
        <div className="raum_cont">
            <div className="raum_options">
                <div>
                    {!chairSeparate && <div>
                        <p>Wie viele Stühle hat jeden Tisch:</p>
                        <input
                        placeholder="Stühle"
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
                                            let table=<td className="tdEmpty"></td>
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