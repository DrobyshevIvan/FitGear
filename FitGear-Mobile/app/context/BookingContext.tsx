//bookingcontext.tsx
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

interface BookingDetails {
    from: string;
    to: string;
    id: number;
    userId: string;
    announcementId: number;
    status: string;
}

// Новий інтерфейс для історії бронювань
interface BookingHistoryItem {
    id: number;
    userId: string;
    announcementId: number;
    status: string;
    from: string;
    to: string;
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

interface PaymentDetails {
    id: number;
    amount: number;
    status: string;
    createdAt: string;
    userId: string;
    bookingId: number;
    userName: string;
}

interface ProcessPaymentResponse {
    id: number;
    status: string;
    processedAt: string;
    message?: string;
}

interface DeletePaymentResponse {
    success: boolean;
    message?: string;
}

interface BookingContextType {
    isLoadingBooking: boolean;
    isLoadingPayment: boolean;
    isProcessingPayment: boolean;
    isDeletingPayment: boolean;
    isLoadingHistory: boolean;
    bookingHistory: BookingHistoryItem[];
    createBooking: (bookingData: BookingData) => Promise<BookingResponse>;
    createPayment: (paymentData: PaymentData) => Promise<PaymentResponse>;
    processPayment: (paymentId: number) => Promise<ProcessPaymentResponse>;
    deletePayment: (paymentId: number) => Promise<DeletePaymentResponse>;
    getBookingDetails: (bookingId: number) => Promise<BookingDetails>;
    getPaymentDetails: (paymentId: number) => Promise<PaymentDetails>;
    getUserBookingHistory: () => Promise<void>;
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
    const [isDeletingPayment, setIsDeletingPayment] = useState(false);
    const [isLoadingHistory, setIsLoadingHistory] = useState(false);
    const [bookingHistory, setBookingHistory] = useState<BookingHistoryItem[]>([]);

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

    const processPayment = async (paymentId: number): Promise<ProcessPaymentResponse> => {
        console.log("BookingProvider: Processing payment...", paymentId);
        setIsProcessingPayment(true);

        try {
            if (!authState.authenticated || !authState.accessToken) {
                throw new Error("User not authenticated");
            }

            const response = await axios.put(
                `${API_URL}/Payment/${paymentId}/process`,
                {},
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

    const deletePayment = async (paymentId: number): Promise<DeletePaymentResponse> => {
        console.log("BookingProvider: Deleting payment...", paymentId);
        setIsDeletingPayment(true);

        try {
            if (!authState.authenticated || !authState.accessToken) {
                throw new Error("User not authenticated");
            }

            const response = await axios.delete(
                `${API_URL}/Payment/${paymentId}/delete`,
                {
                    headers: {
                        "Authorization": `Bearer ${authState.accessToken}`,
                        "X-Mobile-Client": "true",
                    },
                }
            );

            console.log("BookingProvider: Payment deleted successfully", response.data);
           
            if (response.status === 200 || response.status === 204) {
                return { success: true, message: "Payment and booking deleted successfully" };
            }
           
            return response.data as DeletePaymentResponse;

        } catch (error: any) {
            console.error("BookingProvider: Failed to delete payment:", error);

            if (error.response?.status === 401) {
                throw new Error("Session expired. Please login again.");
            }

            if (error.response?.status === 404) {
                throw new Error("Payment not found.");
            }

            if (error.response?.status === 400) {
                throw new Error(error.response.data?.message || "Payment cannot be deleted at this time.");
            }

            if (error.response?.status === 403) {
                throw new Error("You don't have permission to delete this payment.");
            }

            if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            }

            throw new Error(error.message || "Failed to delete payment");
        } finally {
            setIsDeletingPayment(false);
        }
    };

    const getBookingDetails = async (bookingId: number): Promise<BookingDetails> => {
        console.log("BookingProvider: Getting booking details...", bookingId);

        try {
            if (!authState.authenticated || !authState.accessToken) {
                throw new Error("User not authenticated");
            }

            const response = await axios.get(
                `${API_URL}/Bookings/${bookingId}`,
                {
                    headers: {
                        "Authorization": `Bearer ${authState.accessToken}`,
                        "X-Mobile-Client": "true",
                    },
                }
            );

            console.log("BookingProvider: Booking details retrieved successfully", response.data);
            return response.data as BookingDetails;

        } catch (error: any) {
            console.error("BookingProvider: Failed to get booking details:", error);

            if (error.response?.status === 401) {
                throw new Error("Session expired. Please login again.");
            }

            if (error.response?.status === 404) {
                throw new Error("Booking not found.");
            }

            throw new Error(error.message || "Failed to get booking details");
        }
    };

    const getPaymentDetails = async (paymentId: number): Promise<PaymentDetails> => {
        console.log("BookingProvider: Getting payment details...", paymentId);

        try {
            if (!authState.authenticated || !authState.accessToken) {
                throw new Error("User not authenticated");
            }

            const response = await axios.get(
                `${API_URL}/Payment/${paymentId}`,
                {
                    headers: {
                        "Authorization": `Bearer ${authState.accessToken}`,
                        "X-Mobile-Client": "true",
                    },
                }
            );

            console.log("BookingProvider: Payment details retrieved successfully", response.data);
            return response.data as PaymentDetails;

        } catch (error: any) {
            console.error("BookingProvider: Failed to get payment details:", error);

            if (error.response?.status === 401) {
                throw new Error("Session expired. Please login again.");
            }

            if (error.response?.status === 404) {
                throw new Error("Payment not found.");
            }

            throw new Error(error.message || "Failed to get payment details");
        }
    };

    // Нова функція для отримання історії бронювань користувача
    const getUserBookingHistory = async (): Promise<void> => {
        console.log("BookingProvider: Getting user booking history...");
        setIsLoadingHistory(true);

        try {
            if (!authState.authenticated || !authState.accessToken || !authState.userProfile?.id) {
                throw new Error("User not authenticated");
            }

            const response = await axios.get(
                `${API_URL}/Bookings?UserId=${authState.userProfile.id}`,
                {
                    headers: {
                        "Authorization": `Bearer ${authState.accessToken}`,
                        "X-Mobile-Client": "true",
                    },
                }
            );

            console.log("BookingProvider: Booking history retrieved successfully", response.data);
            
            let historyData: BookingHistoryItem[];
            
            if (Array.isArray(response.data)) {
                historyData = response.data as BookingHistoryItem[];
            } else if (response.data.$values && Array.isArray(response.data.$values)) {
                historyData = response.data.$values as BookingHistoryItem[];
            } else {
                console.warn("BookingProvider: Unexpected booking history response format:", response.data);
                historyData = [];
            }

            // Сортуємо за датою from (найновіші спочатку)
            historyData.sort((a, b) => new Date(b.from).getTime() - new Date(a.from).getTime());
            
            setBookingHistory(historyData);

        } catch (error: any) {
            console.error("BookingProvider: Failed to get booking history:", error);

            if (error.response?.status === 401) {
                throw new Error("Session expired. Please login again.");
            }

            if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            }

            throw new Error(error.message || "Failed to get booking history");
        } finally {
            setIsLoadingHistory(false);
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
        isDeletingPayment,
        isLoadingHistory,
        bookingHistory,
        createBooking,
        createPayment,
        processPayment,
        deletePayment,
        getBookingDetails,
        getPaymentDetails,
        getUserBookingHistory,
        calculateHours,
        calculateTotalPrice,
    };

    console.log("BookingProvider: Current state:", {
        isLoadingBooking,
        isLoadingPayment,
        isProcessingPayment,
        isDeletingPayment,
        isLoadingHistory,
        bookingHistoryCount: bookingHistory.length,
        authenticated: authState.authenticated,
    });

    return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
};
