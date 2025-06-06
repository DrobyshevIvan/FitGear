using System.ComponentModel.DataAnnotations;

namespace HotelListing.API.Core.Models.Users;

public class ApiUserDto : LoginDto
{
    
    public string? FirstName { get; set; }
    
    public string? LastName { get; set; }
}