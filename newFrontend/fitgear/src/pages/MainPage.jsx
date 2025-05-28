import { Outlet } from 'react-router-dom';
import Header from '../components/header';
import background from '../assets/background.jpg';


export default function MainPage() {
  return (
    <div className='flex flex-col'>
      <Header />
      <div className='relative w-full h-screen'>
        <div
          style={{ backgroundImage: `url(${background})`}}
          className='absolute inset-0 bg-cover bg-center z-0 bg-position-md bg-position-lg'
        />

        <div className="relative z-10 flex h-full w-full justify-center items-center">
          <div className='absolute md:left-[-150px] top-0 h-full w-[55vw] bg-white z-20 shadow-lg transform md:-skew-x-15 select-none'></div>

          <div className="relative z-30 bg-transparent w-full lg:w-[55vw] -translate-y-32 -translate-x-0 lg:-translate-x-20 text-center lg:text-left">
            <h1 className="text-3xl md:text-[3rem] lg:text-[4rem] font-medium mb-4 w-full lg:w-[45%] fade-in">FitGear for you</h1>
            <p className="mb-6 text-2xl md:text-3xl lg:text-5xl w-full lg:w-[40%] fade-in">Rent sports gear easily, quickly, and safely</p>
            <button className="fade-in select-none px-8 py-3 ml-[-7px] text-2xl rounded-full font-medium button-slide-color cursor-pointer">
                <span>Download →</span>
            </button>
          </div>
        </div>
      </div>


      <div>
        <h2>Stop</h2>
      </div>
    </div>
  );
}