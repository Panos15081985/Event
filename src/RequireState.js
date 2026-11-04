import { Navigate, useLocation } from "react-router-dom";

// Pages that need data from the previous page (location.state).
// If the page is opened directly (e.g. refresh or typed URL), go back to the start page.
function RequireState({ stateKey, children }) {
    const { state } = useLocation();
    if (!state || !state[stateKey]) {
        return <Navigate to="/" replace />;
    }
    return children;
}
export default RequireState;
