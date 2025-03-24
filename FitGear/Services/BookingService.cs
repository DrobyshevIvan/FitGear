using AutoMapper;
using FitGear.Contracts;
using FitGear.Data;
using FitGear.Models.Booking;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;

namespace FitGear.Services;

public class BookingService : IBookingService
{
    private readonly IBookingRepository _bookingRepository;
    private readonly IAnnouncementsRepository _announcementsRepository;
    private readonly IMapper _mapper;

    public BookingService(IBookingRepository bookingRepository, 
        IAnnouncementsRepository announcementsRepository,
        IMapper mapper)
    {
        _bookingRepository = bookingRepository;
        _announcementsRepository = announcementsRepository;
        _mapper = mapper;
    }

    public async Task<Booking> CreateBookingAsync(CreateBookingDto createBookingDto)
    {
        var booking = _mapper.Map<Booking>(createBookingDto);
        var announcement = await _announcementsRepository.GetAsync(booking.AnnouncementId);
        if(announcement == null)
        {
            return null;
        }
        
        if(announcement.QuantityAvailable <= 0)
        {
            throw new InvalidOperationException("No available quantity for this announcement");
        }
        
        announcement.QuantityAvailable -= 1;
        await _announcementsRepository.UpdateAsync(announcement);
        await _bookingRepository.AddAsync(booking);

        return booking;
    }

    public async Task<IEnumerable<GetBookingDto>> GetBookingsAsync()
    {
        var bookings = await _bookingRepository.GetAllAsync();
        return _mapper.Map<List<GetBookingDto>>(bookings);
    }

    public async Task<GetBookingDto> GetBookingByIdAsync(int id)
    {
        var booking = await _bookingRepository.GetAsync(id);
        return _mapper.Map<GetBookingDto>(booking);
    }

    public async Task<bool> DeleteBookingAsync(int id)
    {
        var booking = await _bookingRepository.GetAsync(id);
        if (booking == null)
        {
            return false;
        }
        
        var announcement = await _announcementsRepository.GetAsync(booking.AnnouncementId);
        if(announcement == null)
        {
            return false;
        }
        
        announcement.QuantityAvailable += 1;
        await _announcementsRepository.UpdateAsync(announcement);
        await _bookingRepository.DeleteAsync(id);
        return true;
    }

    public async Task<bool> UpdateBookingAsync(int id, UpdateBookingDto updateBookingDto)
    {
        if(id != updateBookingDto.Id)
        {
            return false;
        }
        
        var booking = await _bookingRepository.GetAsync(id);
        
        if(booking == null)
        {
            return false;
        }
        
        _mapper.Map(updateBookingDto, booking);
        
        try
        {
            await _bookingRepository.UpdateAsync(booking);
        }
        catch (DbUpdateConcurrencyException)
        {
            if(!await BookingExistsAsync(id))
            {
                return false;
            }
            else
            {
                throw;
            }
        }

        return true;
    }

    public async Task<bool> BookingExistsAsync(int id)
    {
        return await _bookingRepository.Exists(id);
    }
}