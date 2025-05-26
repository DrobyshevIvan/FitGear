import { useState } from 'react'
import { Routes, Navigate, Route } from 'react-router-dom'
import ManagePage from './pages/ManagePage'
import Users from './pages/UsersManage'
import Anouncements from './pages/AnouncementsManage'
import MainPage from './pages/MainPage'
import EditAnnouncement from './pages/EditAnnouncement'

import './App.css'

function App() {
  return (
    <>
    <Routes>
      <Route path="/" element={<MainPage />}/>

      <Route path="/manage" element={<ManagePage />}>
        <Route path="users" element={<Users />} />
        <Route path="anouncements" element={<Anouncements />}>
          <Route path="edit/:id" element={<EditAnnouncement />} />
        </Route> 
      </Route>
    </Routes>
    </>
  );
}

export default App
