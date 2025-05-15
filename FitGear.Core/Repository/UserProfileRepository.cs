using FitGear.Core.Contracts.IRepositories;
using FitGear.Data;

namespace FitGear.Repository;

public class UserProfileRepository : GenericRepository<User>, IUserProfileRepository
{
    private readonly FitGearDbContext _context;

    public UserProfileRepository(FitGearDbContext context) : base(context)
    {
        _context = context;
    }
}