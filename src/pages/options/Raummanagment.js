import { useState } from "react";
import { useNavigate,useLocation} from "react-router-dom";

// Positions are stored as "<row><column>" (e.g. "03"), so the grid
// is limited to 10 x 10 to keep every position unique.
const MAX_SIZE = 10;

function Raummanagment(){
    const {state} = useLocation();
    const EventDaten=state && state.Daten
    const navigate=useNavigate();
    const [OrizonTables,setOrizonTables]=useState("5");
    const[VerticalTables,setVerticalTables]=useState("5")
    const rows = Math.min(Math.max(parseInt(OrizonTables) || 0, 0), MAX_SIZE);
    const cols = Math.min(Math.max(parseInt(VerticalTables) || 0, 0), MAX_SIZE);
    const OrizonArray = Array.from({ length: rows });
    const VerticalArray = Array.from({ length: cols }, (_, index) => index);
    const [checkbox1, setCheckbox1] = useState(true);
    const [checkbox2, setCheckbox2] = useState(false);
    const[roundTable, setRoundTable]=useState(false)
    const[DanceFloor,setDanceFloor] = useState([]);
    const[TablePosition,setTablePosition]=useState([]);

    // Remove positions that are outside the grid after a size change
    let changeSize=(value,setSize,isRow)=>{
        setSize(value);
        const size = Math.min(Math.max(parseInt(value) || 0, 0), MAX_SIZE);
        const inside = (pos) => Number(isRow ? pos[0] : pos[1]) < size;
        setDanceFloor(prev => prev.filter(inside));
        setTablePosition(prev => prev.filter(inside));
    }

    let raumPosition=(tr,td)=>{
        let pos=tr+""+td
        let existD=DanceFloor.includes(pos)
        let existT=TablePosition.includes(pos)
        if(checkbox1){
            if(existD)
                setDanceFloor(prev => prev.filter(item => item !== pos))
            else if(existT)
                alert("Bitte such den Tisch aus und danach kannst du den Tisch löschen")
            else
                setDanceFloor(prev => [...prev,pos])
        }
        else if(checkbox2){
            if(existT)
                setTablePosition(prev => prev.filter(item => item !== pos))
            else if(existD)
                alert("Bitte such die Bühne aus und danach kannst du die Bühne löschen")
            else
                setTablePosition(prev => [...prev,pos])
        }
    }

    let handelCheckbox=()=>{
        setCheckbox1(!checkbox1)
        setCheckbox2(!checkbox2)
    }

    let fertig=()=>{
        if(rows===0 || cols===0){
            alert(`Die Raumfläche muss zwischen 1 und ${MAX_SIZE} liegen`)
            return;
        }
        if(TablePosition.length===0){
            alert("Bitte zeichnen Sie mindestens einen Tisch")
            return;
        }
        let RaumDaten={
            Raum:{
                horizontal:rows,
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

    let cellStyle=(pos)=>{
        if(DanceFloor.includes(pos))
            return { backgroundColor:"rgb(222, 198, 171)", border:"none" };
        if(TablePosition.includes(pos))
            return { backgroundColor:"rgb(101, 67, 33)" };
        return undefined;
    }

    let cellText=(pos)=>{
        if(DanceFloor.includes(pos)) return "Bühne";
        if(TablePosition.includes(pos)) return "Tisch";
        return "";
    }

    return(
        <div>
            <h1 className="raum_name">{EventDaten.NameEvent}</h1>
            <h3 className="settings_ConTitle">Raummanagment</h3>
            <p className="raum_Text">Geben Sie die Größe der Raumfläche an (maximal {MAX_SIZE} x {MAX_SIZE}).
            Anschliessend können Sie die Bereiche der Tische/Bühne festlegen durch
            Anklicken der einzelnen Quadrate.
            </p>
            <div className="raum_cont">
                <div className="raum_options">
                    <div className="raum_input">
                        <h3>Raumfläche</h3>
                        <input
                            placeholder="Reihen"
                            type="number"
                            min="1"
                            max={MAX_SIZE}
                            onChange={(event)=>{changeSize(event.target.value,setOrizonTables,true)}}
                            value={OrizonTables}
                        />
                        <input
                            placeholder="Spalten"
                            type="number"
                            min="1"
                            max={MAX_SIZE}
                            onChange={(event)=>{changeSize(event.target.value,setVerticalTables,false)}}
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
                                                const pos=Trdx+""+Tddx;
                                                return(
                                                    <td key={Tddx} style={cellStyle(pos)} onClick={()=>{raumPosition(Trdx,Tddx)}}>{cellText(pos)}</td>
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
