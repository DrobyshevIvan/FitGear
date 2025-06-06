using FitGear.Contracts;
using FitGear.Data.Enums;

namespace FitGear.Services;

public class BookingStatusUpdateService : BackgroundService
{
    private readonly ILogger<BookingStatusUpdateService> _logger;
    private readonly IServiceProvider _serviceProvider;
    private readonly TimeSpan _checkInterval = TimeSpan.FromMinutes(15);

    public BookingStatusUpdateService(ILogger<BookingStatusUpdateService> logger,
        IServiceProvider serviceProvider)
    {
        _logger = logger;
        _serviceProvider = serviceProvider;
    }
    
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            _logger.LogInformation($"Cheeking for bookings to update status at: {DateTime.UtcNow}");

            try
            {
                using var scope = _serviceProvider.CreateScope();
                var bookingRepository = scope.ServiceProvider.GetRequiredService<IBookingRepository>();
                
                var activeBookings = await bookingRepository.GetActiveBookingsAsync();
                var now = DateTime.UtcNow;

                foreach (var booking in activeBookings)
                {
                    if (booking.Status == BookingStatus.Active && now > booking.To)
                    {
                        _logger.LogInformation("Updating booking {BookingId} status from Active to Completed", booking.Id);
                        booking.Status = BookingStatus.Completed;
                        await bookingRepository.UpdateAsync(booking);
                    }
                    else if (booking.Status == BookingStatus.Confirmed && now >= booking.From)
                    {
                        _logger.LogInformation("Updating booking {BookingId} status from Confirmed to Active", booking.Id);
                        booking.Status = BookingStatus.Active;
                        await bookingRepository.UpdateAsync(booking);
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while updating booking status");
            }
            
            await Task.Delay(_checkInterval, stoppingToken);
        }
    }
}