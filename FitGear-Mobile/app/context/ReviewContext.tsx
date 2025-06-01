import axios from "axios";
import { createContext, useCallback, useContext, useState } from "react";
import { API_URL, refreshToken, useAuth } from "./AuthContext";

interface Review {
    id: number;
    rating: number;
    comment: string;
    createdAt: string;
    userId: string;
    userName: string;
    announcementId: string;
}

interface CreateReviewData {
    rating: number;
    comment: string;
}

interface ReviewFilters {
    Rating?: number;
    Comment?: string;
    AnnouncementId?: string;
}

interface ReviewStats {
    averageRating: number;
    totalReviews: number;
}

interface ReviewContextType {
    reviews: Review[];
    isLoadingReviews: boolean;
    isCreatingReview: boolean;
    createReview: (announcementId: string, reviewData: CreateReviewData) => Promise<Review>;
    getReviews: (filters?: ReviewFilters) => Promise<Review[]>;
    getReviewsByAnnouncement: (announcementId: string) => Promise<Review[]>;
    calculateReviewStats: (announcementId: string) => Promise<ReviewStats>;
}

const ReviewContext = createContext<ReviewContextType | null>(null);

export const useReview = () => {
    const context = useContext(ReviewContext);
    if (!context) {
        throw new Error("useReview must be used within a ReviewProvider");
    }
    return context;
};

export const ReviewProvider = ({ children }: { children: React.ReactNode }) => {
    console.log("ReviewProvider: Initializing...");

    const { authState } = useAuth();
    const [reviews, setReviews] = useState<Review[]>([]);
    const [isLoadingReviews, setIsLoadingReviews] = useState(false);
    const [isCreatingReview, setIsCreatingReview] = useState(false);

    const createReview = useCallback(async (announcementId: string, reviewData: CreateReviewData): Promise<Review> => {
        console.log("ReviewProvider: Creating review...", { announcementId, reviewData });
        setIsCreatingReview(true);

        try {
            if (!authState.authenticated || !authState.accessToken) {
                throw new Error("User not authenticated");
            }

            const response = await axios.post(
                `${API_URL}/Review/${announcementId}`,
                reviewData,
                {
                    headers: {
                        "Authorization": `Bearer ${authState.accessToken}`,
                        "X-Mobile-Client": "true",
                        "Content-Type": "application/json"
                    },
                }
            );

            console.log("ReviewProvider: Review created successfully", response.data);
            
            // Після створення review, оновлюємо список reviews для цього announcement
            await getReviewsByAnnouncement(announcementId);
            
            return response.data as Review;

        } catch (error: any) {
            console.error("ReviewProvider: Failed to create review:", error);

            if (error.response?.status === 401) {
                try {
                    console.log("ReviewProvider: Token might be expired, trying to refresh...");
                    await refreshToken();
                    
                    // Повторний запит після оновлення токену
                    const retryResponse = await axios.post(
                        `${API_URL}/Review/${announcementId}`,
                        reviewData,
                        {
                            headers: {
                                "Authorization": `Bearer ${authState.accessToken}`,
                                "X-Mobile-Client": "true",
                                "Content-Type": "application/json"
                            },
                        }
                    );
                    
                    console.log("ReviewProvider: Review created successfully after token refresh", retryResponse.data);
                    await getReviewsByAnnouncement(announcementId);
                    return retryResponse.data as Review;
                    
                } catch (refreshError) {
                    console.error("ReviewProvider: Token refresh failed:", refreshError);
                    throw new Error("Session expired. Please login again.");
                }
            }

            if (error.response?.status === 400) {
                throw new Error(error.response.data?.message || "Invalid review data. Please check your rating and comment.");
            }

            if (error.response?.status === 409) {
                throw new Error("You have already reviewed this item.");
            }

            if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            }

            throw new Error(error.message || "Failed to create review. Please try again.");
        } finally {
            setIsCreatingReview(false);
        }
    }, [authState.authenticated, authState.accessToken]);

    const getReviews = useCallback(async (filters: ReviewFilters = {}): Promise<Review[]> => {
        console.log("ReviewProvider: Getting reviews...", filters);
        setIsLoadingReviews(true);

        try {
            if (!authState.authenticated || !authState.accessToken) {
                console.log("ReviewProvider: User not authenticated, skipping reviews load");
                return [];
            }

            // Формуємо параметри запиту
            const queryParams = new URLSearchParams();
            
            if (filters.Rating) queryParams.append('Rating', filters.Rating.toString());
            if (filters.Comment) queryParams.append('Comment', filters.Comment);
            if (filters.AnnouncementId) queryParams.append('AnnouncementId', filters.AnnouncementId);

            const url = `${API_URL}/Review${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
            console.log("ReviewProvider: Request URL:", url);

            const response = await axios.get(url, {
                headers: {
                    "Authorization": `Bearer ${authState.accessToken}`,
                    "X-Mobile-Client": "true",
                },
            });

            console.log("ReviewProvider: Reviews loaded successfully", response.data);

            let reviewsData: Review[];
            
            if (Array.isArray(response.data)) {
                reviewsData = response.data as Review[];
            } else if (response.data.$values && Array.isArray(response.data.$values)) {
                reviewsData = response.data.$values as Review[];
            } else {
                console.warn("ReviewProvider: Unexpected reviews response format:", response.data);
                reviewsData = [];
            }

            setReviews(reviewsData);
            return reviewsData;

        } catch (error: any) {
            console.error("ReviewProvider: Failed to get reviews:", error);

            if (error.response?.status === 401) {
                try {
                    console.log("ReviewProvider: Token might be expired, trying to refresh...");
                    await refreshToken();
                    
                    // Повторний запит після оновлення токену
                    const queryParams = new URLSearchParams();
                    if (filters.Rating) queryParams.append('Rating', filters.Rating.toString());
                    if (filters.Comment) queryParams.append('Comment', filters.Comment);
                    if (filters.AnnouncementId) queryParams.append('AnnouncementId', filters.AnnouncementId);

                    const url = `${API_URL}/Review${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
                    
                    const retryResponse = await axios.get(url, {
                        headers: {
                            "Authorization": `Bearer ${authState.accessToken}`,
                            "X-Mobile-Client": "true",
                        },
                    });
                    
                    let reviewsData: Review[];
                    if (Array.isArray(retryResponse.data)) {
                        reviewsData = retryResponse.data as Review[];
                    } else if (retryResponse.data.$values && Array.isArray(retryResponse.data.$values)) {
                        reviewsData = retryResponse.data.$values as Review[];
                    } else {
                        reviewsData = [];
                    }
                    
                    setReviews(reviewsData);
                    return reviewsData;
                    
                } catch (refreshError) {
                    console.error("ReviewProvider: Token refresh failed:", refreshError);
                    return [];
                }
            }

            return [];
        } finally {
            setIsLoadingReviews(false);
        }
    }, [authState.authenticated, authState.accessToken]);

    const getReviewsByAnnouncement = useCallback(async (announcementId: string): Promise<Review[]> => {
        console.log("ReviewProvider: Getting reviews for announcement:", announcementId);
        
        try {
            const reviewsData = await getReviews({ AnnouncementId: announcementId });
            return reviewsData;
        } catch (error) {
            console.error("ReviewProvider: Failed to get reviews for announcement:", error);
            return [];
        }
    }, [getReviews]);

    const calculateReviewStats = useCallback(async (announcementId: string): Promise<ReviewStats> => {
        console.log("ReviewProvider: Calculating review stats for announcement:", announcementId);
        
        try {
            const reviewsData = await getReviewsByAnnouncement(announcementId);
            
            if (reviewsData.length === 0) {
                return {
                    averageRating: 0,
                    totalReviews: 0
                };
            }

            const totalRating = reviewsData.reduce((sum, review) => sum + review.rating, 0);
            const averageRating = Math.round((totalRating / reviewsData.length) * 10) / 10; // Округлюємо до 1 знака після коми

            return {
                averageRating,
                totalReviews: reviewsData.length
            };

        } catch (error) {
            console.error("ReviewProvider: Failed to calculate review stats:", error);
            return {
                averageRating: 0,
                totalReviews: 0
            };
        }
    }, [getReviewsByAnnouncement]);

    const value: ReviewContextType = {
        reviews,
        isLoadingReviews,
        isCreatingReview,
        createReview,
        getReviews,
        getReviewsByAnnouncement,
        calculateReviewStats,
    };

    console.log("ReviewProvider: Current state:", {
        reviewsCount: reviews.length,
        isLoadingReviews,
        isCreatingReview,
        authenticated: authState.authenticated,
    });

    return <ReviewContext.Provider value={value}>{children}</ReviewContext.Provider>;
};
