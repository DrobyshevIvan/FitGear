using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FitGear.Data.Configurations;

public class ReviewConfiguration : IEntityTypeConfiguration<Review>
{
    public void Configure(EntityTypeBuilder<Review> builder)
    {
        builder.Property(r => r.CreatedAt)
            .HasDefaultValueSql("GETDATE()");

        builder.Property(r => r.Rating)
            .IsRequired();
        
        builder.HasOne(r => r.User)
            .WithMany(u => u.Reviews)
            .HasForeignKey(r => r.UserId)
            .OnDelete(DeleteBehavior.Restrict); // запретит удаление пользователя, если у него есть связанные отзывы
        
        builder.HasOne(r => r.Announcement)
            .WithMany(a => a.Reviews)
            .HasForeignKey(r => r.AnnouncementId)
            .OnDelete(DeleteBehavior.Restrict); // запретит удаление объявления, если у него есть связанные отзывы
    }
}