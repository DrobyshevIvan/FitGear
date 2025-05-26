using Microsoft.AspNetCore.Identity;

namespace FitGear.Data;

public class User : IdentityUser
{
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? PhoneNumber { get; set; }
    public DateTime CreatedAt { get; set; }
    // public string? RefreshToken { get; set; }
    // public DateTime? RefreshTokenExpiresAtUtc { get; set; }
    
    public IList<Booking> Bookings { get; set; } = new List<Booking>();
    public IList<Review> Reviews { get; set; } = new List<Review>();
    public IList<Notification> Notifications { get; set; } = new List<Notification>();
    public IList<Payment> Payments { get; set; } = new List<Payment>();
}