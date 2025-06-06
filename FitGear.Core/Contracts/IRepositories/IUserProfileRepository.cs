using FitGear.Contracts;
using FitGear.Data;

namespace FitGear.Core.Contracts.IRepositories;

public interface IUserProfileRepository : IGenericRepository<User>
{
    IQueryable<User> GetQueryable();
    Task<User?> GetUserByIdIncludingConnectedTablesAsync(string userId);
}