using AutoMapper;
using FitGear.Contracts;
using FitGear.Core.Extenstions;
using FitGear.Core.Filters;
using FitGear.Core.Sorting;
using FitGear.Data;
using FitGear.Models.Announcement;
using Microsoft.EntityFrameworkCore;

namespace FitGear.Services;

public class AnnouncementService : IAnnouncementService
{
    private readonly IAnnouncementsRepository _announcementsRepository;
    private readonly IMapper _mapper;

    public AnnouncementService(IAnnouncementsRepository announcementsRepository,
        IMapper mapper)
    {
        _announcementsRepository = announcementsRepository;
        _mapper = mapper;
    }
    
    public async Task<IEnumerable<GetAnnouncementDto>> GetAnnouncementsAsync(AnnouncementFilter filter, SortParams sortParams)
    {
        var query = _announcementsRepository.GetQueryable();
        
        if (filter != null)
        {
            query = query.Filter(filter);
        }
        
        if (sortParams != null)
        {
            query = query.Sort(sortParams);
        }
        
        var announcements = await query.ToListAsync();
        return _mapper.Map<List<GetAnnouncementDto>>(announcements);
    }

    // public async Task<IEnumerable<GetAnnouncementDto>> GetFilteredAnnouncementsAsync(AnnouncementFilter filter)
    // {
    //     var query = _announcementsRepository.GetQueryable();
    //
    //     query = query.Filter(filter);
    //     
    //     var announcements = await query.ToListAsync();
    //     
    //     return _mapper.Map<List<GetAnnouncementDto>>(announcements);
    // }
    
    public async Task<GetAnnouncementDto> GetAnnouncementByIdAsync(int id)
    {
        var announcement = await _announcementsRepository.GetAsync(id);
        return _mapper.Map<GetAnnouncementDto>(announcement);
    }
    
    public async Task<GetAnnouncementDto> CreateAnnouncementAsync(CreateAnnouncementDto announcementDto)
    {
        var announcement = _mapper.Map<Announcement>(announcementDto);
        await _announcementsRepository.AddAsync(announcement);
        return _mapper.Map<GetAnnouncementDto>(announcement);
    }
    
    public async Task<bool> UpdateAnnouncementAsync(int id, UpdateAnnouncementDto announcementDto)
    {
        if (id != announcementDto.Id)
        {
            return false;
        }

        var announcement = await _announcementsRepository.GetAsync(id);

        if (announcement == null)
        {
            return false;
        }

        _mapper.Map(announcementDto, announcement);
        await _announcementsRepository.UpdateAsync(announcement);
        return true;
    }

    public async Task<bool> AnnouncementExistsAsync(int id)
    {
        var announcement = await _announcementsRepository.GetAsync(id);
        return announcement != null;
    }

    public async Task<bool> DeleteAnnouncementAsync(int id)
    {
        var announcement = await _announcementsRepository.GetAsync(id);
        if(announcement == null)
        {
            return false;
        }
        
        await _announcementsRepository.DeleteAsync(id);
        return true;
    }
}