import { Navigate, Route, Routes } from 'react-router-dom'
import { Home } from './pages/Home'
import { JobRoles } from './pages/JobRoles'
import { Login } from './pages/Login'
import { Mentors } from './pages/Mentors'
import { Messages } from './pages/Messages'
import { MentorRegister } from './pages/MentorRegister'
import { Register } from './pages/Register'
import { Specializations } from './pages/Specializations'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/mentor-register" element={<MentorRegister />} />
      <Route path="/specializations" element={<Specializations />} />
      <Route path="/roles/:specId" element={<JobRoles />} />
      <Route path="/mentors" element={<Mentors />} />
      <Route path="/messages/:mentorId" element={<Messages />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
