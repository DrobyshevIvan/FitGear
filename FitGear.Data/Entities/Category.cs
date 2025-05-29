namespace FitGear.Data;

public class Category
{
    public int Id { get; set; }
    public string Name { get; set; }
    public IList<Announcement> Announcements { get; set; } = new List<Announcement>();
}