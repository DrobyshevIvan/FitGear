import { useState } from 'react'
import { Routes, Navigate, Route } from 'react-router-dom'
import SideBar from './components/sideBar'
import ManagePage from './pages/ManagePage'
import Users from './pages/UsersManage'
import Anouncements from './pages/AnouncementsManage'

import './App.css'

function App() {
  return (
    <>
    <div className='flex'>
      <SideBar />
      <div className='flex-1 ml-4'>
        <Routes>
          <Route path="/" element={<Navigate to="/manage" />}/>

          <Route path="/manage" element={<ManagePage />}>
            <Route path="users" element={<Users />}/>
            <Route path="anouncements" element={<Anouncements />}/>
          </Route>
        </Routes>
      </div>
    </div>
    </>
  );
}

export default App
