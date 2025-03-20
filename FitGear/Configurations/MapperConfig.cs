using AutoMapper;
using FitGear.Data;
using FitGear.Models.Announcement;
using FitGear.Models.Booking;

namespace FitGear.Configurations;

public class MapperConfig : Profile
{
    public MapperConfig()
    {
        CreateMap<Announcement, CreateAnnouncementDto>().ReverseMap();
        CreateMap<Announcement, GetAnnouncementDto>().ReverseMap();
        CreateMap<Announcement, UpdateAnnouncementDto>().ReverseMap();

        CreateMap<Booking, CreateBookingDto>().ReverseMap();
        CreateMap<Booking, GetBookingDto>().ReverseMap();
        CreateMap<Booking, UpdateBookingDto>().ReverseMap();
    }
}