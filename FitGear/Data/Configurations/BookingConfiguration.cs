using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FitGear.Data.Configurations;

public class BookingConfiguration : IEntityTypeConfiguration<Booking>
{
    public void Configure(EntityTypeBuilder<Booking> builder)
    {
        builder.HasOne(b => b.User)
            .WithMany(u => u.Bookings)
            .HasForeignKey(b => b.UserId)
            .OnDelete(DeleteBehavior.Cascade); // При удалении удалятся все бронирования пользователя
        
        builder.HasOne(b => b.Announcement)
            .WithMany(a => a.Bookings)
            .HasForeignKey(b => b.AnnouncementId)
            .OnDelete(DeleteBehavior.Restrict); // запретит удаление объявления, если у него есть связанные бронирования.
    }
}