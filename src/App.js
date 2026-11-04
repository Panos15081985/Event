import './App.css';
import Login from './pages/Login';
import CreateEvent from './pages/CreateEvent';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Admin from './pages/Admin';
import AdminPage from './components/AdminPage';
import Raummanagment from './pages/options/Raummanagment';
import Gastmanagment from './pages/options/Gastmanagment';
import Eventmanagment from './pages/options/Eventmanagment';
import Saal from './components/Saal';
import GastPlan from './pages/GastPlan';
import RequireState from './RequireState';

function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path='/' element={<Login/>}/>
        <Route path='/CreateEvent' element={<CreateEvent/>}/>
        <Route path='/Admin' element={<Admin/>}/>
        <Route path='/AdminPage' element={<RequireState stateKey="Daten"><AdminPage/></RequireState>}/>
        <Route path='/Raummanagment' element={<RequireState stateKey="Daten"><Raummanagment/></RequireState>}/>
        <Route path='/Gastmanagment' element={<RequireState stateKey="Daten"><Gastmanagment/></RequireState>}/>
        <Route path='/Eventmanagment' element={<RequireState stateKey="Daten"><Eventmanagment/></RequireState>}/>
        <Route path='/GastPlan' element={<RequireState stateKey="Data"><GastPlan/></RequireState>}/>
        <Route path='/Saal' element={<RequireState stateKey="RaumDaten"><Saal/></RequireState>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
