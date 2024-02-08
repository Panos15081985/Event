import { useState } from "react";
import { useNavigate,useLocation} from "react-router-dom";

function Raummanagment(){
    const {state} = useLocation();
    const EventDaten=state && state.Daten
    const navigate=useNavigate();
    const [OrizonTables,setOrizonTables]=useState("5");
    const[VerticalTables,setVerticalTables]=useState("5")
    const OrizonArray = Array.from({ length: OrizonTables });
    const VerticalArray = Array.from({ length: VerticalTables }, (_, index) => index);
    const [checkbox1, setCheckbox1] = useState(true);
    const [checkbox2, setCheckbox2] = useState(false);
    const[roundTable, setRoundTable]=useState(false)
    const[DanceFloor,setDanceFloor] = useState([]);
    const[TablePosition,setTablePosition]=useState([]);
 
    let raumPosition=(tr,td,target)=>{
        let pos=tr+""+td
        let existD=DanceFloor.includes(pos)
        let existT=TablePosition.includes(pos)
        if(checkbox1){
            if(existD){
                const updatedDanceFloor = DanceFloor.filter(item => item !== pos);
                setDanceFloor(updatedDanceFloor)
                target.style.backgroundColor="rgb(222, 198, 171)";
                target.style.border="solid black 2px";
                target.innerHTML="";
            }
            else if(existT)
                alert("Bitte such den Tisch aus und danach kannst du den Tisch löschen")
            else{
                target.style.backgroundColor="rgb(222, 198, 171)";
                target.style.border="none";
                target.innerHTML="Bühne";
                setDanceFloor(prev => [
                    ...prev,pos
                ])
            }
        }
        else if(checkbox2){
            if(existT){
                const updatedTablePosition = TablePosition.filter(item => item !== pos);
                setTablePosition(updatedTablePosition)
                target.style.backgroundColor="rgb(222, 198, 171)";
                target.innerHTML="";
            }
            else if(existD)
                alert("Bitte such die Bühne aus und danach kannst du die Bühne löschen")
            else{
                target.style.backgroundColor="rgb(101, 67, 33)";
                target.innerHTML = "Tisch" 
                setTablePosition(prev => [
                    ...prev,pos
                ])
            }
        }
    }
   
    let handelCheckbox=()=>{
        setCheckbox1(!checkbox1)
        setCheckbox2(!checkbox2)
    }

let fertig=()=>{
    let RaumDaten={
        Raum:{
            horizontal:OrizonTables,
            vertical: VerticalArray,
            dance:DanceFloor,
            Table:TablePosition,
            EventId:EventDaten.EventId,
            RoundTable:roundTable
        },
        EventData:EventDaten
    }
    navigate("../Saal",{state: {RaumDaten}})
}

    return(
        <div>
            <h1 className="raum_name">{EventDaten.NameEvent}</h1>
            <h3 className="settings_ConTitle">Raummanagment</h3>
            <p className="raum_Text">Geben Sie die Größe der Raumfläche an. 
            Anschliessend können Sie die Bereiche der Tische/Bühne festlegen durch 
            Anklicken der einzelnen Quadrate.
            </p>
            <div className="raum_cont">
                <div className="raum_options">
                    <div className="raum_input">
                        <h3>Raumfläche</h3>
                        <input
                            placeholder="wie viel Tische"
                            onChange={(event)=>{setOrizonTables(event.target.value)}}
                            value={OrizonTables}
                        />
                        <input
                            placeholder="wie viel Tische"
                            onChange={(event)=>{setVerticalTables(event.target.value)}}
                            value={VerticalTables}
                        />
                    </div>
                    <div className="raum_checkbox">
                        <div>
                            <input
                                type="checkbox"
                                checked={checkbox1}
                                onChange={handelCheckbox}
                                />
                            <label>Bühne zeichnen</label>
                        </div>
                        <div>
                            <input
                                type="checkbox"
                                checked={checkbox2}
                                onChange={handelCheckbox}
                                />
                            <label>Tische zeichnen</label>
                        </div>
                        <div>
                            <p>Runde Tische?:</p>
                            <input
                                type="checkbox"
                                checked={roundTable}
                                onChange={()=>{setRoundTable(!roundTable)}}
                                />
                            <label>ja</label>
                    </div>
                        <div style={{textAlign:"center"}}>
                            <button className="eventButton"  onClick={fertig}>Weiter mit Sitzplätze</button>
                        </div>
                    </div>
                </div>
                <div className="raum_plan">
                    <div>
                        <table>
                            <tbody>
                                {OrizonArray.map((Tr,Trdx)=>{
                                    return(
                                        <tr key={Trdx}>
                                            {VerticalArray.map((Td,Tddx)=>{
                                                return(
                                                    <td key={Tddx} onClick={(event)=>{raumPosition(Trdx,Tddx,event.target)}}></td>
                                                )
                                            })}
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Raummanagment;
