using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using FitGear.Contracts;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FitGear.Data;
using FitGear.Models.Booking;

namespace FitGear.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookingsController : ControllerBase
    {
        private readonly IBookingRepository _bookingRepository;
        private readonly IMapper _mapper;

        public BookingsController(IBookingRepository bookingRepository, IMapper mapper)
        {
            _bookingRepository = bookingRepository;
            _mapper = mapper;
        }

        // GET: api/Bookings
        [HttpGet]
        public async Task<ActionResult<IEnumerable<GetBookingDto>>> GetBookings()
        {
            var bookings = await _bookingRepository.GetAllAsync();
            var records = _mapper.Map<List<GetBookingDto>>(bookings);
            return Ok(records);
        }

        // GET: api/Bookings/5
        [HttpGet("{id}")]
        public async Task<ActionResult<GetBookingDto>> GetBooking(int id)
        {
            var booking = await _bookingRepository.GetAsync(id);

            if (booking == null)
            {
                return NotFound();
            }

            return Ok(_mapper.Map<GetBookingDto>(booking));
        }

        // PUT: api/Bookings/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutBooking(int id, UpdateBookingDto bookingDto)
        {
            if (id != bookingDto.Id)
            {
                return BadRequest();
            }

            var booking = await _bookingRepository.GetAsync(id);

            if (booking == null)
            {
                return NotFound();
            }
            
            _mapper.Map(bookingDto, booking);
            
            try
            {
                await _bookingRepository.UpdateAsync(booking);
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await BookingExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Bookings
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Booking>> PostBooking(CreateBookingDto createBookingDto)
        {
            var booking = _mapper.Map<Booking>(createBookingDto);
            await _bookingRepository.AddAsync(booking);

            return CreatedAtAction("GetBooking", new { id = booking.Id }, booking);
        }

        // DELETE: api/Bookings/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBooking(int id)
        {
            var booking = await _bookingRepository.GetAsync(id);
            if (booking == null)
            {
                return NotFound();
            }

            await _bookingRepository.DeleteAsync(id);

            return NoContent();
        }

        private Task<bool> BookingExists(int id)
        {
            return _bookingRepository.Exists(id);
        }
    }
}
