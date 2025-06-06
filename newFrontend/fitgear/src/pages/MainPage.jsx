import Header from '../components/header';
import background from '../assets/background.jpg';
import bikePhoto from '../assets/bike.png';
import ballsPhoto from '../assets/balls.png';
import tentPhoto from '../assets/tent.png';
import weightPhoto from '../assets/weight.png';
import MapMenu from '../components/MapMenu';
import {Star, ArrowDown, Facebook, Instagram, Linkedin } from "lucide-react";
import Mobile from "../assets/mobile.png";
import Phone from "../assets/phone.png";
import { Link, Element } from 'react-scroll';



export default function MainPage() {
  return (
    <div className='flex flex-col'>
      <Header />
      <div className='relative w-full h-screen min-h-screen sm:min-h-[700px] md:min-h-[800px] lg:min-h-[900px]'>
        <div
          style={{ backgroundImage:  `linear-gradient(rgba(0, 0, 0, 0.1), rgba( 0, 0, 0, 0.4)), url(${background})` }}
          className='absolute inset-0 bg-cover bg-center z-0 bg-position-md bg-position-lg'
        />
        <div className="relative z-10 flex w-full h-full justify-center items-center px-4 md:px-8 ">
          <div className='absolute md:left-15 lg:left-[-150px] md:top-0 h-1/3 md:h-full w-full md:w-[75vw] lg:w-[55vw] bg-white z-20 shadow-lg md:transform md:-skew-x-15 select-none'></div>

          <div className="relative z-30 bg-transparent w-full lg:w-[55vw] -translate-x-0 lg:-translate-x-20 text-center lg:text-left">
            <h1 className="text-3xl md:text-[3rem] lg:text-[4rem] font-medium mb-4 w-full lg:w-[45%] fade-in">FitGear for you</h1>
            <p className="mb-6 text-2xl md:text-3xl lg:text-5xl w-full lg:w-[40%] fade-in">Rent sports gear easily, quickly, and safely</p>
            <Link to="Download" smooth={true} duration={800} offset={-70}>
              <button className="fade-in select-none px-8 py-3 ml-[-7px] text-2xl rounded-full font-medium button-slide-color cursor-pointer">
                <span>Download →</span>
              </button>
            </Link>
          </div>
        </div>
      </div>
      {/* Второе окно */}
      <Element name='about-us'>
        <section id="about-us-section" className='w-full flex flex-col px-4 md:flex-row  md:h-[400px] sm:min-h-[1000px] md:min-h-[600px] justify-center mx-auto py-12 items-center bg-gradient'>
          <div className='flex flex-col gap-8 text-center lg:text-left'>
            <h2 className='text-5xl lg:w-[40vw] '>Access 1,000+ pieces of equipment for every sport and season</h2>
            <p className='text-xl lg:w-[30vw]'>From mountain bikes and snowboards to kayaks, treadmills, and rollerblades —
              FitGear connects you with a huge selection of high-quality gear.
              Whether you’re planning a weekend trip or just want to try something new, we’ve got you covered.</p>
            <ul className='text-lg space-y-2'>
              <li className='flex gap-2'><span>{<Star />}</span> 1,000+ items of verified sports equipment</li>
              <li className='flex gap-2'><span>{<Star />}</span>60+ types of gear including outdoor, indoor, seasonal, and specialized items</li>
              <li className='flex gap-2'><span>{<Star />}</span>300+ trusted rental providers in cities, towns, and resorts</li>
            </ul>
          </div>
          <div>
            <img src={bikePhoto} alt="" className='h-[250px] md:width-[350px] md:h-[350px]' />
          </div>
        </section>
      </Element>
      {/* популярные категории */}
      <div className='w-full flex flex-col gap-10 h-[700px] md:h-[500px] min-h-[500px]'>
        <h2 className='text-5xl mt-16 select-none'>Popular categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mx-10">
          <div className="text-center py-4 select-none">
            <img src={ballsPhoto} alt="" className='max-h-[200px] object-contain mx-auto hover:opacity-75 cursor-pointer' />
            <p className='text-2xl mt-8'>Football</p>
          </div>
          <div className="text-center py-4 select-none">
            <img src={weightPhoto} alt="" className='max-h-[200px] object-contain mx-auto hover:opacity-75 cursor-pointer' />
            <p className='text-2xl mt-8'>Fitness</p>
          </div>
          <div className="text-center py-4 select-none">
            <img src={bikePhoto} alt="" className='max-h-[200px] object-contain mx-auto hover:opacity-75 cursor-pointer' />
            <p className='text-2xl mt-8'>Cycling</p>
          </div>
          <div className="text-center py-4 select-none">
            <img src={tentPhoto} alt="" className='max-h-[200px] object-contain mx-auto hover:opacity-75 cursor-pointer' />
            <p className='text-2xl mt-8'>Camping</p>
          </div>
        </div>
      </div>
      {/* Становитесь нашими партнерами */}
      <div className='w-full mt-10 flex justify-center h-[400px]'>
        <div className='w-full md:w-[55vw] flex flex-col bg-map text-center justify-center p-24 gap-6'>
          <h2 className='text-4xl'>Own sports gear? Want to earn money?</h2>
          <p className='text-2xl'>Join the innovative FitGear platform and start making profit from your sports equipment today.</p>
          <Link to="Contacts" smooth={true} duration={800} offset={-150}>
            <button className='text-xl px-4 py-2 bg-black border-2 border-transparent text-white w-[250px] cursor-pointer mx-auto hover:bg-white hover:text-black hover:border-gray-500'>Become a Partner</button>
          </Link>
        </div>
      </div>
      {/* как работает */}
      <div className='w-full mt-12 flex justify-center min-h-[600px] items-center'>
        <div>
          <div className='flex flex-col-reverse md:flex-row'>
            <div>
              <img src={Mobile} alt="" className="w-[350px] h-[350px] md:w-[500px] md:h-[500px] mx-auto"/>
            </div>
            <div className='flex flex-col items-center text-xl gap-2 lg:w-[500px]'>
              <h2 className='text-5xl font-medium border-b-5 pb-4'>How it works.</h2>
              <p className='text-2xl'>Simple. Fast. Reliable. Try FitGear today:</p>
              <p className='mt-4'>1. Download the FitGear app</p>
              <ArrowDown size={30} />
              <p>2. Register an Account</p>
              <ArrowDown size={30}/>
              <p>3. Choose Your Gear</p>
              <ArrowDown size={30}/>
              <p>4. Select dates and confirm booking</p>
              <ArrowDown size={30}/>
              <p>5. Pick up your gear</p>
            </div>
          </div>
        </div>
      </div>
      {/* карта */}
      <div className='w-full flex mt-12 justify-center sm:min-h-[550px]'>
        <MapMenu />
      </div>
      {/* Завантаження додатку */}
      <Element name='Download'>
        <div className='w-full flex mt-12 justify-center sm:min-h-[600px] py-12 relative bg-down'>
          <div className='flex flex-col w-full items-center'>
            <div className='flex flex-col md:flex-row z-10 items-center max-w-[1200px] w-full px-4'>
              <img src={Phone} alt="Phone preview" className='max-w-[600px] h-[600px] object-contain select-none' />
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  FitGear – Your Sports Equipment Rental App
                </h1>
                <p className="text-gray-500 text-xl md:text-2xl mb-8">
                  Find your favorite equipment nearby and rent it in a few taps. Easy. Fast. No hassle.
                </p>
                <p className="text-lg md:text-2xl whitespace-nowrap">Download the app</p>
                <div className='flex mt-4 justify-between gap-4'>
                  <button className='rounded-full px-6 py-3 w-[200px] cursor-pointer text-xl font-bold button-yellow transition'>
                    For Android
                  </button>
                  <button className='rounded-full px-6 py-3 w-[200px] cursor-pointer text-xl font-bold button-yellow transition'>
                    For ios
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Element>
      <Element name="Contacts">
        <footer className="bg-black text-white py-8 px-4 text-sm">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6 items-center">

            <div className="flex flex-col gap-2">
              <p className="text-base font-semibold">&copy; 2025 FitGear</p>
              <div className="flex gap-4 justify-center">
                <a href="#" className="hover:text-gray-400">Privacy Policy</a>
                <a href="#" className="hover:text-gray-400">Terms of Use</a>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <p><span className="font-semibold">Phone:</span> +38 (050) 123-45-67</p>
              <p><span className="font-semibold">Email:</span> info@fitgear.com</p>
            </div>

            <div className="flex gap-4 justify-center text-xl">
              <a href="#" aria-label="Instagram" className="hover:text-gray-400">
                <Instagram />
              </a>
              <a href="#" aria-label="Facebook" className="hover:text-gray-400">
                <Facebook />
              </a>
              <a href="#" aria-label="LinkedIn" className="hover:text-gray-400">
                <Linkedin />
              </a>
            </div>
          </div>
        </footer>
      </Element>
    </div>
  );
}