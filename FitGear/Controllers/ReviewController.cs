using System.Security.Claims;
using AutoMapper;
using FitGear.Contracts;
using FitGear.Core.Filters;
using FitGear.Core.Models.Review;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FitGear.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ReviewController : ControllerBase
{
    private readonly IReviewService _reviewService;
    private readonly IMapper _mapper;

    public ReviewController(IReviewService reviewService,
        IMapper mapper)
    {
        _reviewService = reviewService;
        _mapper = mapper;
    }

    // POST: api/Review/{announcementId}
    [HttpPost("{announcementId}")]
    [Authorize]
    public async Task<IActionResult> CreateReview(int announcementId, 
        [FromBody] CreateReviewDto createReviewDto)
    {
        var userId = User.Claims.FirstOrDefault(c => c.Type == "uid")?.Value;
        if(userId == null)
        {
            return Unauthorized("User ID not found in claims.");
        }
        
        try
        {
            var review = await _reviewService.CreateReviewAsync(
                announcementId,
                userId,
                createReviewDto);

            return CreatedAtAction(
                "GetReviews",
                new { announcementId, reviewId = review.Id },
                review);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ex.Message);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
    
    // GET: api/Review
    [HttpGet]
    [Authorize]
    public async Task<ActionResult<IEnumerable<GetReviewDto>>> GetReviews([FromQuery] ReviewFilter reviewFilter)
    {
        var reviews = await _reviewService.GetReviewAsync(reviewFilter);
        return Ok(reviews);
    }
    
    // DELETE: api/Review/{id}
    [HttpDelete("{id}")]
    [Authorize(Roles = "Administrator, Moderator")]
    public async Task<IActionResult> DeleteReview(int id)
    {
        var isDeleted = await _reviewService.DeleteReviewAsync(id);
        if (!isDeleted)
        {
            return NotFound();
        }
        
        return NoContent();
    }
}