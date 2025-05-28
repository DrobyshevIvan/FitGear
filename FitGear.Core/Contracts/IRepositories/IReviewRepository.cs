using FitGear.Contracts;
using FitGear.Data;

namespace FitGear.Core.Contracts.IRepositories;

public interface IReviewRepository : IGenericRepository<Review>
{
    IQueryable<Review> AsQueryable();
}