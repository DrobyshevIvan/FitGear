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
            .OnDelete(DeleteBehavior.Restrict); // запретит удаление пользователя, если у него есть связанные бронирования
        
        builder.HasOne(b => b.Announcement)
            .WithMany(a => a.Bookings)
            .HasForeignKey(b => b.AnnouncementId)
            .OnDelete(DeleteBehavior.Restrict); // запретит удаление объявления, если у него есть связанные бронирования.
        
        builder.Property(b => b.Status)
            .HasConversion<string>();
    }
}