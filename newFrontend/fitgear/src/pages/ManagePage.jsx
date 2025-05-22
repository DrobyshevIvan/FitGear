import { NavLink, Outlet } from 'react-router-dom';
import SideBar from '../components/sideBar';

export default function ManagePage() {
  return (
    <>
    <div className='flex'>
        <SideBar />
        <div className='ml-[380px] py-6 w-full mt-6'>
            <h2 className='text-4xl font-medium mb-10 text-left'>Manage</h2>
            
            <div className='flex gap-4 my-6 border-b'>
                <NavLink to="users" className={({ isActive }) => `text-2xl px-4 py-2 ${isActive ? 'bg-[#FFD50099] rounded-lg' : 'bg-white-800'}`}>Users</NavLink>
                <NavLink to="anouncements" className={({ isActive }) => `text-2xl px-4 py-2 ${isActive ? 'bg-[#FFD50099] rounded-lg' : 'bg-white-800'}`}>Anouncements</NavLink>
            </div>
            <Outlet />
        </div>
    </div>
    </>
  )
}
