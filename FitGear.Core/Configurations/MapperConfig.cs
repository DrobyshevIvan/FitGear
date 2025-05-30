using AutoMapper;
using FitGear.Core.Models.Category;
using FitGear.Core.Models.Review;
using FitGear.Data;
using FitGear.Models.Announcement;
using FitGear.Models.Booking;
using FitGear.Models.Payment;
using HotelListing.API.Core.Models.Users;

namespace FitGear.Configurations;

public class MapperConfig : Profile
{
    public MapperConfig()
    {
        CreateMap<CreateAnnouncementDto, Announcement>()
            .ForMember(dest => dest.Category, opt => opt.Ignore())
            .ReverseMap();
        CreateMap<Announcement, GetAnnouncementDto>().ReverseMap();
        CreateMap<Announcement, UpdateAnnouncementDto>().ReverseMap();
        CreateMap<Announcement, GetDetailedAnnouncementDto>().ReverseMap();

        CreateMap<Booking, CreateBookingDto>().ReverseMap();
        CreateMap<Booking, GetBookingDto>().ReverseMap();
        CreateMap<Booking, UpdateBookingDto>().ReverseMap();

        CreateMap<Payment, CreatePaymentDto>().ReverseMap();
        CreateMap<Payment, GetPaymentDto>().ReverseMap();

        CreateMap<User, ApiUserDto>().ReverseMap();
        CreateMap<User, UserProfileDto>().ReverseMap();
        CreateMap<User, UpdateUserProfileDto>().ReverseMap();
        CreateMap<User, UserDetailedProfileDto>().ReverseMap();
        
        CreateMap<Category, CategoryDto>().ReverseMap();
        CreateMap<Category, UpdateCategoryDto>().ReverseMap();
        
        CreateMap<Review, CreateReviewDto>().ReverseMap();
        CreateMap<Review, GetReviewDto>()
            .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.User.UserName))
            .ReverseMap();
        CreateMap<Review, UpdateReviewDto>().ReverseMap();
    }
}