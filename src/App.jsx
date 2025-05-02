import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Dashboard from './pages/dashboard/Projects'
import TeamMembers from './pages/TeamMembers/TeamMembers'
import AccountSelection from './pages/AccountSelection/AccountSelection'
import LandingPage from './pages/LandingPage/LandingPage'

function App() {

  return (
    <div className="App">
      <div className='main'>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/team" element={<TeamMembers />} />
            <Route path="/projects" element={<Dashboard />} />
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  )
}

export default App
