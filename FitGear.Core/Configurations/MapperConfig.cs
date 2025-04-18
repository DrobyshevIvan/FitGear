using AutoMapper;
using FitGear.Data;
using FitGear.Models.Announcement;
using FitGear.Models.Booking;
using FitGear.Models.Payment;

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

        CreateMap<Payment, CreatePaymentDto>().ReverseMap();
        CreateMap<Payment, GetPaymentDto>().ReverseMap();
    }
}