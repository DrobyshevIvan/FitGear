using FitGear.Core.Filters;
using FitGear.Core.Models.Review;

namespace FitGear.Contracts;

public interface IReviewService
{
    Task<GetReviewDto> CreateReviewAsync(int announcementId, string userId, CreateReviewDto announcementDto);
    Task<IEnumerable<GetReviewDto>> GetReviewAsync(ReviewFilter reviewFilter);
    Task<GetReviewDto> GetReviewByIdAsync(int id);
    Task<bool> DeleteReviewAsync(int id);
    Task<bool> ReviewExistsAsync(int id);
}