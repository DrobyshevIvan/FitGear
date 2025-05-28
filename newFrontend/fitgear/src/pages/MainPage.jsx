import { Outlet } from 'react-router-dom';
import Header from '../components/header';
import background from '../assets/background.jpg';
import secondPhoto from '../assets/secondPhoto.jpg';
import bikePhoto from '../assets/bike.png';
import ballsPhoto from '../assets/balls.png';
import tentPhoto from '../assets/tent.png';
import weightPhoto from '../assets/weight.png';


export default function MainPage() {
  return (
    <div className='flex flex-col'>
      <Header />
      <div className='relative w-full h-screen min-h-screen sm:min-h-[700px] md:min-h-[800px] lg:min-h-[900px]'>
        <div
          style={{ backgroundImage: `url(${background})`}}
          className='absolute inset-0 bg-cover bg-center z-0 bg-position-md bg-position-lg'
        />
        <div className="relative z-10 flex w-full h-full justify-center items-center px-4 md:px-8 ">
          <div className='absolute md:left-15 lg:left-[-150px] md:top-0 h-1/3 md:h-full w-full md:w-[75vw] lg:w-[55vw] bg-white z-20 shadow-lg md:transform md:-skew-x-15 select-none'></div>

          <div className="relative z-30 bg-transparent w-full lg:w-[55vw] -translate-x-0 lg:-translate-x-20 text-center lg:text-left">
            <h1 className="text-3xl md:text-[3rem] lg:text-[4rem] font-medium mb-4 w-full lg:w-[45%] fade-in">FitGear for you</h1>
            <p className="mb-6 text-2xl md:text-3xl lg:text-5xl w-full lg:w-[40%] fade-in">Rent sports gear easily, quickly, and safely</p>
            <button className="fade-in select-none px-8 py-3 ml-[-7px] text-2xl rounded-full font-medium button-slide-color cursor-pointer">
                <span>Download →</span>
            </button>
          </div>
        </div>
      </div>
      <div className='w-full flex flex-col text-white gap-10 h-[500px] sm:min-h-[450px] bg-main'>
        <h2 className='text-5xl mt-12 select-none'>Find any equipment</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mx-10">
          <div className="text-center py-4 select-none">
            <img src={ballsPhoto} alt="" className='max-h-[200px] object-contain mx-auto hover:opacity-75 cursor-pointer'/>
            <p className='text-2xl mt-8'>Football</p>
          </div>
          <div className="text-center py-4 select-none">
            <img src={weightPhoto} alt="" className='max-h-[200px] object-contain mx-auto hover:opacity-75 cursor-pointer'/>
            <p className='text-2xl mt-8'>Fitness</p>
          </div>
          <div className="text-center py-4 select-none">
            <img src={bikePhoto} alt="" className='max-h-[200px] object-contain mx-auto hover:opacity-75 cursor-pointer'/>
            <p className='text-2xl mt-8'>Cycling</p>
          </div>
          <div className="text-center py-4 select-none">
            <img src={tentPhoto} alt="" className='max-h-[200px] object-contain mx-auto hover:opacity-75 cursor-pointer'/>
            <p className='text-2xl mt-8'>Camping</p>
          </div>
        </div>
      </div>
      <div className='relative w-full h-screen min-h-screen sm:min-h-[700px] md:min-h-[800px] lg:min-h-[900px]'>
        
      </div>
    </div>
  );
}