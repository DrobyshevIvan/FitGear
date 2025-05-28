using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using FitGear.Contracts;
using FitGear.Core.Filters;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FitGear.Data;
using FitGear.Models.Booking;
using Microsoft.AspNetCore.Authorization;

namespace FitGear.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookingsController : ControllerBase
    {
        private readonly IBookingService _bookingService;

        public BookingsController(IBookingService bookingService)
        {
            _bookingService = bookingService;
        }

        // GET: api/Bookings
        [HttpGet]
        [Authorize]
        public async Task<ActionResult<IEnumerable<GetBookingDto>>> GetBookings([FromQuery] BookingFilter bookingFilter)
        {
            var bookings = await _bookingService.GetBookingsAsync(bookingFilter);
            return Ok(bookings);
        }

        // GET: api/Bookings/5
        [HttpGet("{id}")]
        [Authorize]
        public async Task<ActionResult<GetBookingDto>> GetBooking(int id)
        {
            var booking = await _bookingService.GetBookingByIdAsync(id);

            if (booking == null)
            {
                return NotFound();
            }

            return Ok(booking);
        }

        // PUT: api/Bookings/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        [Authorize(Roles = "Administrator, Moderator")]
        public async Task<IActionResult> PutBooking(int id, UpdateBookingDto bookingDto)
        {
            var isUpdated = await _bookingService.UpdateBookingAsync(id, bookingDto);
            if (!isUpdated)
            {
                return NotFound();
            }

            return NoContent();
        }

        // POST: api/Bookings
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        [Authorize]
        public async Task<ActionResult<Booking>> PostBooking(CreateBookingDto createBookingDto)
        {
            var booking = await _bookingService.CreateBookingAsync(createBookingDto);
            if (booking == null)
            {
                return NotFound(new {message = "Announcement not found"});
            }
            
            return CreatedAtAction("GetBooking", new { id = booking.Id }, booking);
        }

        // DELETE: api/Bookings/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "Administrator, Moderator")]
        public async Task<IActionResult> DeleteBooking(int id)
        {
            var isDeleted = await _bookingService.DeleteBookingAsync(id);
            if (!isDeleted)
            {
                return NotFound();
            }

            return NoContent();
        }

        private Task<bool> BookingExists(int id)
        {
            return _bookingService.BookingExistsAsync(id);
        }
    }
}
