
import './App.css';
import Login from './pages/Login';
import CreateEvent from './pages/CreateEvent';
import {BrowserRouter,Routes,Route} from "react-router-dom"
import Admin from './pages/Admin';
import AdminPage from './components/AdminPage';
import Raummanagment from './pages/options/Raummanagment';
import Gastmanagment from './pages/options/Gastmanagment';
import Eventmanagment from './pages/options/Eventmanagment';
import Saal from './components/Saal';
import GastPlan from './pages/GastPlan';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login/>}/>
        <Route path='/CreateEvent' element={<CreateEvent/>}/>
        <Route path='/Admin' element={<Admin/>}/>
        <Route path='/AdminPage' element={<AdminPage/>}/>
        <Route path='/Raummanagment' element={<Raummanagment/>}/>
        <Route path='/Gastmanagment' element={<Gastmanagment/>}/>
        <Route path='/Eventmanagment' element={<Eventmanagment/>}/>
        <Route path='/GastPlan' element={<GastPlan/>}/>
        <Route path='/Saal' element={<Saal/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
