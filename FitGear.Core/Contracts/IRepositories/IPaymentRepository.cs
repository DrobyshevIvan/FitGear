using FitGear.Data;

namespace FitGear.Contracts;

public interface IPaymentRepository : IGenericRepository<Payment>
{
    Task<IEnumerable<Payment>> GetByUserIdAsync(string userId);
    Task<Payment> GetWithDetailsAsync(int id);
}