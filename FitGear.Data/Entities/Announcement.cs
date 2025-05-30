namespace FitGear.Data;

public class Announcement
{
    public int Id { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public int QuantityAvailable { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public decimal PricePerDay { get; set; }
    public string? Url { get; set; }
    public bool? IsDeleted { get; set; } = false;

    public IList<Booking>? Bookings { get; set; } = new List<Booking>();
    public IList<Review>? Reviews { get; set; } = new List<Review>();
    public int CategoryId { get; set; }
    public Category Category { get; set; }
}