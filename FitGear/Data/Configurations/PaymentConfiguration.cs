using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FitGear.Data.Configurations;

public class PaymentConfiguration : IEntityTypeConfiguration<Payment> 
{
    public void Configure(EntityTypeBuilder<Payment> builder)
    {
        builder.Property(p => p.Amount)
            .HasColumnType("decimal(18, 2)");
        
        builder.Property(p => p.CreatedAt)
            .HasDefaultValueSql("GETDATE()");
        
        builder.HasOne(p => p.User)
            .WithMany(u => u.Payments)
            .HasForeignKey(p => p.UserId)
            .OnDelete(DeleteBehavior.Restrict); // запретит удаление пользователя, если у него есть связанные платежи
        
        builder.HasOne(p => p.Booking)
            .WithOne(b => b.Payment)
            .HasForeignKey<Payment>(p => p.BookingId)
            .OnDelete(DeleteBehavior.Restrict); // запретит удаление бронирования, если у него есть связанный платеж
        
        builder.Property(p => p.Status)
            .HasConversion<string>();
    }
}