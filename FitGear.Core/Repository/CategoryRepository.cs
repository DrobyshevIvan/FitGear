using FitGear.Core.Contracts.IRepositories;
using FitGear.Data;

namespace FitGear.Repository;

public class CategoryRepository : GenericRepository<Category>, ICategoryRepository
{
    private readonly FitGearDbContext _context;

    public CategoryRepository(FitGearDbContext context) : base(context)
    {
        _context = context;
    }
}