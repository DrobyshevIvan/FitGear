using FitGear.Data.Configurations;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace FitGear.Data;

public class FitGearDbContext : IdentityDbContext<User>
{
    public FitGearDbContext(DbContextOptions<FitGearDbContext> options) : base(options)
    {
    }
    
    public DbSet<Announcement> Announcements { get; set; }
    public DbSet<Booking> Bookings { get; set; }
    public DbSet<Review> Reviews { get; set; }
    public DbSet<Notification> Notifications { get; set; }
    public DbSet<Payment> Payments { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.ApplyConfiguration(new BookingConfiguration());
        modelBuilder.ApplyConfiguration(new RoleConfiguration());
        modelBuilder.ApplyConfiguration(new AnnouncementConfiguration());
        modelBuilder.ApplyConfiguration(new UserConfiguration());
        modelBuilder.ApplyConfiguration(new ReviewConfiguration());
        modelBuilder.ApplyConfiguration(new NotificationConfiguration());
        modelBuilder.ApplyConfiguration(new PaymentConfiguration());
    }
}

public class FitGearDbContextFactory : IDesignTimeDbContextFactory<FitGearDbContext>
{
    public FitGearDbContext CreateDbContext(string[] args)
    {
        IConfiguration config = new ConfigurationBuilder()
            .SetBasePath(Directory.GetCurrentDirectory())
            .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
            .Build();
        
        var optionsBuilder = new DbContextOptionsBuilder<FitGearDbContext>();
        var conn = config.GetConnectionString("FitGearDbConnectionString");
        optionsBuilder.UseSqlServer(conn);
        return new FitGearDbContext(optionsBuilder.Options);
    }
}