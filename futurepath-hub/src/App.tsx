import { Navigate, Route, Routes } from 'react-router-dom'
import { Home } from './pages/Home'
import { JobRoles } from './pages/JobRoles'
import { Login } from './pages/Login'
import { Mentors } from './pages/Mentors'
import { Messages } from './pages/Messages'
import { MentorDashboard } from './pages/MentorDashboard'
import { MentorRegister } from './pages/MentorRegister'
import { Specializations } from './pages/Specializations'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Navigate to="/mentor-register" replace />} />
      <Route path="/mentor-register" element={<MentorRegister />} />
      <Route path="/mentor-dashboard" element={<MentorDashboard />} />
      <Route path="/specializations" element={<Specializations />} />
      <Route path="/roles/:specId" element={<JobRoles />} />
      <Route path="/mentors" element={<Mentors />} />
      <Route path="/messages/:mentorId" element={<Messages />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
