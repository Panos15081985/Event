
import { Link } from "react-router-dom"
function Navigator(){
    return(
        <div className="Navigator">
            <Link
                to="/createEvent"
            >Create your event
            </Link>
            <Link
                to="/Admin"
            >Admin
            </Link>
        </div>
    )
}
export default Navigator;