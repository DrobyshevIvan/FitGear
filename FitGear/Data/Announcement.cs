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

    public IList<Booking>? Bookings { get; set; } = new List<Booking>();
}