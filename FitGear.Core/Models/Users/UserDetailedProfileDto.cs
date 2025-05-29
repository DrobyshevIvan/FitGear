using FitGear.Core.Models.Review;
using FitGear.Models.Booking;
using FitGear.Models.Payment;

namespace HotelListing.API.Core.Models.Users;

public class UserDetailedProfileDto
{
    public string Id { get; set; }
    public string Email { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public IList<string> Roles { get; set; }
    public string PhoneNumber { get; set; }
    public List<GetBookingDto> Bookings { get; set; }
    public List<GetPaymentDto> Payments { get; set; }
    public List<GetReviewDto> Reviews { get; set; }
}