namespace FitGear.Data.Enums;

public enum BookingStatus
{
    Pending,     // Initial state when booking is created
    Confirmed,   // After payment is successful
    Active,      // During the rental period
    Completed,   // After rental period ends
    Cancelled,   // If user or owner cancels
    Rejected     // If owner rejects the booking
}