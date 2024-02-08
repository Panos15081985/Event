function Plan(props){
    let setBookDaten=props.setBookDaten;
    let bookDaten=props.bookDaten;
    let RaumDaten=props.RaumDaten;
    let Chairs=RaumDaten.Chairs;
    return(
        <div>
            <table>
                <tbody>
                    {RaumDaten.Rows.map((Tr,Ridx)=>{
                        let nummerDanceFloor=true
                        return(
                            <tr key={Ridx}>
                                {RaumDaten.cells.map((Td,Tdix)=>{
                                    let pos=Ridx+""+Tdix;
                                    let dance=RaumDaten.DanceFloor.includes(pos);
                                    let Table=RaumDaten.Tables.includes(pos)
                                    let table=<td className="tdEmpty" key={Tdix}></td>
                                    let numT=0
                                    if(dance && nummerDanceFloor===true){
                                        RaumDaten.DanceFloor.forEach((number) => {
                                        if(number[0]===pos[0]){
                                            numT+=1
                                        }
                                        })
                                        table= <td key={Tdix} colSpan={numT} className="danceFloor">Dancefloor</td>
                                        nummerDanceFloor=false
                                    }
                                    else if(dance){table=""}
                                    else if(Table){
                                        let index = Chairs.findIndex(item => item.Table === pos);
                                        let filterTable=Chairs[index].Chairs.filter(item =>item.Status === false);
                                        let freeChairs = Chairs[index].Ch - filterTable.length;
                                        table = <td 
                                                    key={Tdix}
                                                    style={{cursor:"pointer"}} 
                                                    className={RaumDaten.RoundTable ? "roundTable" : "tableKomplet"} 
                                                    onClick={()=>{setBookDaten({
                                                                                ...bookDaten,
                                                                                Table:index,
                                                                                FreeChairs:freeChairs,
                                                                                TableNumber:pos
                                                                                })}}
                                                >
                                                    <p>Tisch: {pos}</p> 
                                                    <p> <img alt="clip Art" src="foto/chair.png" style={{width:"30px"}}/>: {freeChairs}</p>
                                                </td>
                                    }
                                    return(
                                       table
                                    )
                                    
                                })}
                            </tr>
                        )
                    })}
                </tbody>
                </table>

        </div>
    )
}
export default Plan;