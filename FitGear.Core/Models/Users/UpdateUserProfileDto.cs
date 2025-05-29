using System.ComponentModel.DataAnnotations;

namespace HotelListing.API.Core.Models.Users;

public class UpdateUserProfileDto
{
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    
    [RegularExpression(@"^\+380\d{9}$", ErrorMessage = "Phone number must be in format +380XXXXXXXXX")]
    public string? PhoneNumber { get; set; }
    public string? UserName { get; set; }
}