import axios from "axios";
import { createContext, useContext, useState } from "react";
import { API_URL, useAuth } from "./AuthContext";

interface BookingData {
    from: string;
    to: string;
    userId: string;
    announcementId: number;
}

interface BookingResponse {
    id: number;
    from: string;
    to: string;
    userId: string;
    announcementId: number;
    totalHours: number;
    totalPrice: number;
    status: string;
}

interface PaymentData {
    id?: number;
    amount: number;
    userId: string;
    bookingId: number;
}

interface PaymentResponse {
    id: number;
    amount: number;
    userId: string;
    bookingId: number;
    status: string;
    paymentUrl?: string;
}

interface ProcessPaymentResponse {
    id: number;
    status: string;
    processedAt: string;
    message?: string;
}

interface BookingContextType {
    isLoadingBooking: boolean;
    isLoadingPayment: boolean;
    isProcessingPayment: boolean;
    createBooking: (bookingData: BookingData) => Promise<BookingResponse>;
    createPayment: (paymentData: PaymentData) => Promise<PaymentResponse>;
    processPayment: (paymentId: number) => Promise<ProcessPaymentResponse>;
    calculateHours: (fromDate: Date, toDate: Date) => number;
    calculateTotalPrice: (hours: number, pricePerHour: number) => number;
}

const BookingContext = createContext<BookingContextType | null>(null);

export const useBooking = () => {
    const context = useContext(BookingContext);
    if (!context) {
        throw new Error("useBooking must be used within a BookingProvider");
    }
    return context;
};

export const BookingProvider = ({ children }: { children: React.ReactNode }) => {
    console.log("BookingProvider: Initializing...");

    const { authState } = useAuth();
    const [isLoadingBooking, setIsLoadingBooking] = useState(false);
    const [isLoadingPayment, setIsLoadingPayment] = useState(false);
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);

    const createBooking = async (bookingData: BookingData): Promise<BookingResponse> => {
        console.log("BookingProvider: Creating booking...", bookingData);
        setIsLoadingBooking(true);

        try {
            if (!authState.authenticated || !authState.accessToken) {
                throw new Error("User not authenticated");
            }

            const response = await axios.post(
                `${API_URL}/Bookings`,
                bookingData,
                {
                    headers: {
                        "Authorization": `Bearer ${authState.accessToken}`,
                        "X-Mobile-Client": "true",
                        "Content-Type": "application/json"
                    },
                }
            );

            console.log("BookingProvider: Booking created successfully", response.data);
            return response.data as BookingResponse;

        } catch (error: any) {
            console.error("BookingProvider: Failed to create booking:", error);

            if (error.response?.status === 401) {
                throw new Error("Session expired. Please login again.");
            }

            if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            }

            throw new Error(error.message || "Failed to create booking");
        } finally {
            setIsLoadingBooking(false);
        }
    };

    const createPayment = async (paymentData: PaymentData): Promise<PaymentResponse> => {
        console.log("BookingProvider: Creating payment...", paymentData);
        setIsLoadingPayment(true);

        try {
            if (!authState.authenticated || !authState.accessToken) {
                throw new Error("User not authenticated");
            }

            const response = await axios.post(
                `${API_URL}/Payment`,
                paymentData,
                {
                    headers: {
                        "Authorization": `Bearer ${authState.accessToken}`,
                        "X-Mobile-Client": "true",
                        "Content-Type": "application/json"
                    },
                }
            );

            console.log("BookingProvider: Payment created successfully", response.data);
            return response.data as PaymentResponse;

        } catch (error: any) {
            console.error("BookingProvider: Failed to create payment:", error);

            if (error.response?.status === 401) {
                throw new Error("Session expired. Please login again.");
            }

            if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            }

            throw new Error(error.message || "Failed to process payment");
        } finally {
            setIsLoadingPayment(false);
        }
    };

    // НОВА ФУНКЦІЯ: Обробка платежу
    const processPayment = async (paymentId: number): Promise<ProcessPaymentResponse> => {
        console.log("BookingProvider: Processing payment...", paymentId);
        setIsProcessingPayment(true);

        try {
            if (!authState.authenticated || !authState.accessToken) {
                throw new Error("User not authenticated");
            }

            const response = await axios.put(
                `${API_URL}/Payment/${paymentId}/process`,
                {}, // Порожнє тіло запиту, оскільки PUT endpoint приймає тільки ID в URL
                {
                    headers: {
                        "Authorization": `Bearer ${authState.accessToken}`,
                        "X-Mobile-Client": "true",
                        "Content-Type": "application/json"
                    },
                }
            );

            console.log("BookingProvider: Payment processed successfully", response.data);
            return response.data as ProcessPaymentResponse;

        } catch (error: any) {
            console.error("BookingProvider: Failed to process payment:", error);

            if (error.response?.status === 401) {
                throw new Error("Session expired. Please login again.");
            }

            if (error.response?.status === 404) {
                throw new Error("Payment not found.");
            }

            if (error.response?.status === 400) {
                throw new Error(error.response.data?.message || "Payment cannot be processed at this time.");
            }

            if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            }

            throw new Error(error.message || "Failed to process payment");
        } finally {
            setIsProcessingPayment(false);
        }
    };

    const calculateHours = (fromDate: Date, toDate: Date): number => {
        const diffInMs = toDate.getTime() - fromDate.getTime();
        const diffInHours = Math.ceil(diffInMs / (1000 * 60 * 60));
        return Math.max(diffInHours, 0);
    };

    const calculateTotalPrice = (hours: number, pricePerHour: number): number => {
        const totalHours = Math.max(hours, 1);
        return totalHours * pricePerHour;
    };

    const value: BookingContextType = {
        isLoadingBooking,
        isLoadingPayment,
        isProcessingPayment,
        createBooking,
        createPayment,
        processPayment,
        calculateHours,
        calculateTotalPrice,
    };

    console.log("BookingProvider: Current state:", {
        isLoadingBooking,
        isLoadingPayment,
        isProcessingPayment,
        authenticated: authState.authenticated,
    });

    return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
};
