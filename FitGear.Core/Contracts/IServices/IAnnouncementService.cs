using FitGear.Data;
using FitGear.Models.Announcement;

namespace FitGear.Contracts;

public interface IAnnouncementService
{
    Task<GetAnnouncementDto> CreateAnnouncementAsync(CreateAnnouncementDto announcementDto);
    Task<IEnumerable<GetAnnouncementDto>> GetAnnouncementsAsync();
    Task<GetAnnouncementDto> GetAnnouncementByIdAsync(int id);
    Task<bool> DeleteAnnouncementAsync(int id);
    Task<bool> UpdateAnnouncementAsync(int id, UpdateAnnouncementDto updateBookingDto);
    Task<bool> AnnouncementExistsAsync(int id);
}