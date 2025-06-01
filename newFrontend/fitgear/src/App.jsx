import { Routes, Route } from 'react-router-dom'
import ManagePage from './pages/ManagePage'
import Users from './pages/UsersManage'
import Anouncements from './pages/AnouncementsManage'
import MainPage from './pages/MainPage'
import EditAnnouncement from './pages/EditAnnouncement'
import CategoriesManage from './pages/CategoriesManage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ProtectedRoute from './api/ProtectedRoute.jsx'
import EditUser from './pages/EditUser.jsx'
import BookingsManage from './pages/BookingsManage.jsx'

import './App.css'

  function App() {
    return (
      <>
      <Routes>
        <Route path="/" element={<MainPage />}/>
        <Route path="/login" element={<LoginPage />}/>
        <Route path="/Register" element={<RegisterPage />}/>
        <Route path="/manage" element={<ProtectedRoute requiredRole="Administrator"><ManagePage /></ProtectedRoute>}>
          <Route path="users" element={<Users />}>
            <Route path="edit/:id" element={<EditUser />} />
          </Route>
          <Route path="anouncements" element={<Anouncements />}>
            <Route path="edit/:id" element={<EditAnnouncement />} />
          </Route> 
          <Route path="bookings" element={<BookingsManage />} />
          <Route path="categories" element={<CategoriesManage />} />
        </Route>
      </Routes>
      </>
    );
  }

export default App
