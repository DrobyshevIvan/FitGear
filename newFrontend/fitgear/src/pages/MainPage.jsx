import { Outlet } from 'react-router-dom';
import Header from '../components/header';

export default function MainPage() {
  return (
    <div className='flex flex-col'>
      <Header />
      <div className='flex pt-15 justify-center'>
        MAIN PAGE
      </div>
    </div>
  );
}