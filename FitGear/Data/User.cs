using Microsoft.AspNetCore.Identity;

namespace FitGear.Data;

public class User : IdentityUser
{
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public DateTime CreatedAt { get; set; }
    
    public IList<Booking> Bookings { get; set; } = new List<Booking>();
}