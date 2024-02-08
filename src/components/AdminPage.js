import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function AdminPage(){
    const navigate=useNavigate();
    const {state} = useLocation();
    const EventDaten=state && state.Daten

    return(
        <div className="settings_Con">
            <h1>{EventDaten.NameEvent}</h1>
            <h3 className="settings_ConTitle">Einstellungen</h3>
            <div className="settings" >
                <div className="options" style={{ backgroundImage: 'url("foto/Raum.png")' }}>
                    <h2 style={{ backgroundColor:"rgb(188,107,26"}}>Raummanagment</h2>
                    <div 
                        className="Thema" 
                        style={{ background:"linear-gradient(to right,rgb(188,107,26),rgb(32,91,99"}}
                        onClick={()=>{ navigate("../Raummanagment",{ state: { Daten: EventDaten } })}}
                    >
                        <h3>Raummanagment</h3>
                        <p>Beginnen Sie mit der Gestaltung Ihres Veranstaltungsortes, 
                            indem Sie die Anordnung von Tischen, Stühlen und die 
                            Tanzfläche mit unserem Raummanagement festlegen. Bestimmen 
                            Sie die Anzahl der Tische und Stühle sowie den Bereich für 
                            die Tanzfläche nach Ihren Wünschen.</p>
                    </div>
                </div>
                <div className="options" style={{ backgroundImage: 'url("foto/Gast.png")' }}>
                    <h2 style={{ backgroundColor:"rgb(169,137,116"}}>Gastmanagment</h2>
                    <div 
                        className="Thema" 
                        style={{ background:"linear-gradient(to right,rgb(169,137,116),rgb(208,180,156"}}
                        onClick={()=>{ navigate("../Gastmanagment",{ state: { Daten: EventDaten } })}}
                    >
                        <h3>Gastmanagment</h3>
                        <p>Nachdem Sie Ihren Veranstaltungsraum gestaltet haben, können Sie nun 
                            Ihre Gäste hinzufügen und ihnen die Freiheit überlassen, ihre eigenen 
                            Sitzplätze auszuwählen, oder Sie können die Sitzplätze selbst bestimmen.</p>
                    </div>
                </div>
                <div className="options" style={{ backgroundImage: 'url("foto/Event.png")' }}>
                    <h2 style={{ backgroundColor:"rgb(185,32,26"}}>Eventmanagment</h2>
                    <div 
                        className="Thema" 
                        style={{ background:"linear-gradient(to right,rgb(185,32,26),rgb(190,190,190"}}
                        onClick={()=>{ navigate("../Eventmanagment",{ state: { Daten: EventDaten } })}}
                    >
                        <h3>Eventmanagment</h3>
                        <p>Sie haben die Möglichkeit, bei Ihrem Eventmanagment das Datum, die Uhrzeit
                             zu ändern, Ihr Passwort und Ihre E-Mail zu aktualisieren. Zusätzlich besteht
                              die Option, Ihr gesamtes Event zu stornieren.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default AdminPage;