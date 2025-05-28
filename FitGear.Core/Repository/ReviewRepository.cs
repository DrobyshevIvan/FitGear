using FitGear.Core.Contracts.IRepositories;
using FitGear.Data;

namespace FitGear.Repository;

public class ReviewRepository : GenericRepository<Review>, IReviewRepository
{
    private readonly FitGearDbContext _context;

    public ReviewRepository(FitGearDbContext context) : base(context)
    {
        _context = context;
    }
    
    public IQueryable<Review> AsQueryable()
    {
        return _context.Reviews.AsQueryable();
    }
}