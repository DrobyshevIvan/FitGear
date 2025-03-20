using AutoMapper;
using FitGear.Data;
using FitGear.Models.Announcement;

namespace FitGear.Configurations;

public class MapperConfig : Profile
{
    public MapperConfig()
    {
        CreateMap<Announcement, CreateAnnouncementDto>().ReverseMap();
        CreateMap<Announcement, GetAnnouncementDto>().ReverseMap();
        CreateMap<Announcement, UpdateAnnouncementDto>().ReverseMap();
    }
}