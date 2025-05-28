using AutoMapper;
using FitGear.Contracts;
using FitGear.Core.Contracts.IRepositories;
using FitGear.Core.Extenstions;
using FitGear.Core.Filters;
using FitGear.Core.Models.Review;
using FitGear.Data;
using Microsoft.EntityFrameworkCore;

namespace FitGear.Services;

public class ReviewService : IReviewService
{
    private readonly IReviewRepository _reviewRepository;
    private readonly IMapper _mapper;
    private readonly IAnnouncementsRepository _announcementsRepository;

    public ReviewService(IReviewRepository reviewRepository,
        IMapper mapper,
        IAnnouncementsRepository announcementsRepository)
    {
        _reviewRepository = reviewRepository;
        _mapper = mapper;
        _announcementsRepository = announcementsRepository;
    }
    
    public async Task<GetReviewDto> CreateReviewAsync(int announcementId, string userId, CreateReviewDto createReviewDto)
    {
        var announcement = await _announcementsRepository.GetAsync(announcementId);
        if (announcement == null)
        {
            throw new KeyNotFoundException($"Announcement with id {announcementId} not found");
        }
        
        // Перевіряємо, чи користувач вже залишив відгук на це оголошення
        var existingReview = await _reviewRepository.AsQueryable()
            .FirstOrDefaultAsync(r => r.AnnouncementId == announcementId && r.UserId == userId);
        if (existingReview != null)
        {
            throw new Exception("User has already reviewed this announcement");
        }
        
        var review = new Review
        {
            Rating = createReviewDto.Rating,
            Comment = createReviewDto.Comment,
            UserId = userId,
            AnnouncementId = announcementId,
        };
        
        await _reviewRepository.AddAsync(review);
        
        var createdReview = await _reviewRepository
            .AsQueryable()
            .Include(r => r.User)
            .FirstOrDefaultAsync(r => r.Id == review.Id);
        
        return _mapper.Map<GetReviewDto>(review);
    }

    public async Task<IEnumerable<GetReviewDto>> GetReviewAsync(ReviewFilter reviewFilter)
    {
        
        var reviews = await _reviewRepository
            .AsQueryable()
            .Include(r => r.User)
            .ToListAsync();
        
        if (reviewFilter != null)
        {
            reviews = reviews.AsQueryable().Filter(reviewFilter).ToList();
        }
        
        return _mapper.Map<IEnumerable<GetReviewDto>>(reviews);
    }

    public async Task<GetReviewDto> GetReviewByIdAsync(int id)
    {
        throw new NotImplementedException();
    }

    public async Task<bool> DeleteReviewAsync(int id)
    {
        var review = await _reviewRepository.GetAsync(id);
        if (review == null)
        {
            return false; // Review not found
        }

        await _reviewRepository.DeleteAsync(id);
        return true; // Review deleted successfully
    }

    public async Task<bool> ReviewExistsAsync(int id)
    {
        throw new NotImplementedException();
    }
}