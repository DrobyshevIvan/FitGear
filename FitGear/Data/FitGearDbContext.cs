using FitGear.Data.Configurations;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace FitGear.Data;

public class FitGearDbContext : IdentityDbContext<User>
{
    public FitGearDbContext(DbContextOptions<FitGearDbContext> options) : base(options)
    {
    }
    
    public DbSet<Announcement> Announcements { get; set; }
    public DbSet<Booking> Bookings { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.ApplyConfiguration(new BookingConfiguration());
        modelBuilder.ApplyConfiguration(new RoleConfiguration());
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