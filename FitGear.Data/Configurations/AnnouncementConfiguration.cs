using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FitGear.Data.Configurations;

public class AnnouncementConfiguration : IEntityTypeConfiguration<Announcement>
{
    public void Configure(EntityTypeBuilder<Announcement> builder)
    {
        builder.Property(a => a.PricePerDay)
            .HasColumnType("decimal(18, 2)");
        
        builder.Property(a => a.CreatedAt)
            .HasDefaultValueSql("GETDATE()");

        builder.Property(a => a.UpdatedAt)
            .HasDefaultValueSql("GETDATE()");
        builder.HasOne(a => a.Category)
            .WithMany(c => c.Announcements)
            .HasForeignKey(a => a.CategoryId)
            .OnDelete(DeleteBehavior.Restrict); // запретит удаление категории, если у нее есть связанные объявления
        builder.Property(a => a.IsDeleted)
            .HasDefaultValue(false);
    }
}