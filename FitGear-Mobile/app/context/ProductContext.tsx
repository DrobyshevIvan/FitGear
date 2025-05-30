import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { API_URL, useAuth } from "./AuthContext";

interface Category{
    name: string;
}

interface Announcement {
    id: number;
    title: string;
    description: string;
    quantityAvailable: number;
    pricePerDay: number;
    isDeleted: number;
    url: string | null;
    categoryName: string;
}

interface ProductContextType{
    categories: Category[];
    selectedCategory: string | null;
    isLoadingCategories: boolean;
    announcements: Announcement[];
    isLoadingAnnouncements: boolean;
    searchQuery: string;
    getCategories: () => Promise<void>;
    setSelectedCategory: (category: string | null) => void;
    getAnnouncements: (params?: AnnouncementFilters) => Promise<void>;
    setSearchQuery: (query: string) => void;
    filteredAnnouncements: Announcement[];
}

interface AnnouncementFilters {
    title?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    orderBy?: string;
    sortDirection?: 'Ascending' | 'Descending';
    page?: number;
    size?: number;
}


const ProductContext = createContext<ProductContextType | null>(null);

export const useProduct = () => {
    const context = useContext(ProductContext);
    if(!context){
        throw new Error("useProduct must be used within a ProductProvider");
    }
    return context;
}

export const ProductProvider = ({ children } : {children: React.ReactNode}) => {
    console.log("ProductProvider: Initializing...");

    const {authState} = useAuth();
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [isLoadingCategories, setIsLoadingCategories] = useState(false);
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [isLoadingAnnouncements, setIsLoadingAnnouncements] = useState(false);
    const [searchQuery, setSearchQuery] = useState<string>('');

    const getCategories = async (): Promise<void> => {
        console.log("ProductProvider: Getting categories...");

        if(!authState.authenticated || !authState.accessToken){
            console.log("ProductProvider: User not authenticated, skipping categories load");
            return;
        }
        setIsLoadingCategories(true);
    
        try {
            const response = await axios.get(`${API_URL}/Category`, {
                headers: {
                    "X-Mobile-Client": true,
                    "Authorization": `Bearer ${authState.accessToken}`
                },
            });
            console.log("ProductProvider: Categories loaded successfully");
            console.log("ProductProvider: Raw response data:", response.data);
            
            // Обробляємо відповідь з $values обгорткою
            const categoriesData = response.data.$values ? response.data.$values as Category[] : response.data as Category[];
            console.log("ProductProvider: Processed categories:", categoriesData);
            
            setCategories(categoriesData);
        } catch (error: any){
            console.error("ProductProvider: Failed to get categories:", error);
            if (error.response?.status === 401){
                console.log("ProductProvider: Unauthorized, clearing categories");
                setCategories([]);
            } else{
                throw error;
            }
        } finally {
            setIsLoadingCategories(false);
        }
    
    };

    const getAnnouncements = async (params: AnnouncementFilters = {}): Promise<void> => {
        console.log("ProductProvider: Getting announcements...", params);

        if (!authState.authenticated || !authState.accessToken) {
            console.log("ProductProvider: User not authenticated, skipping announcements load");
            return;
        }

        setIsLoadingAnnouncements(true);

        try {
            // Формуємо параметри запиту
            const queryParams = new URLSearchParams();
            
            if (params.title) queryParams.append('Title', params.title);
            if (params.category) queryParams.append('Category', params.category);
            if (params.minPrice) queryParams.append('MinPricePerDay', params.minPrice.toString());
            if (params.maxPrice) queryParams.append('MaxPricePerDay', params.maxPrice.toString());
            if (params.orderBy) queryParams.append('OrderBy', params.orderBy);
            if (params.sortDirection) queryParams.append('SortDirection', params.sortDirection);
            if (params.page) queryParams.append('Page', params.page.toString());
            if (params.size) queryParams.append('Size', params.size.toString());

            const url = `${API_URL}/Announcements${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
            console.log("ProductProvider: Request URL:", url);

            const response = await axios.get(url, {
                headers: {
                    "X-Mobile-Client": true,
                    "Authorization": `Bearer ${authState.accessToken}`
                },
            });

            console.log("ProductProvider: Announcements loaded successfully");
            console.log("ProductProvider: Raw announcements data:", response.data);

            // Обробляємо відповідь з $values обгорткою
            const announcementsData = response.data.$values ? response.data.$values as Announcement[] : response.data as Announcement[];
            console.log("ProductProvider: Processed announcements:", announcementsData);

            // Групуємо по назві та залишаємо тільки унікальні (з найменшим ID)
            const uniqueAnnouncements = announcementsData.reduce((acc: Announcement[], current: Announcement) => {
                const existing = acc.find(item => item.title.toLowerCase() === current.title.toLowerCase());
                if (!existing) {
                    acc.push(current);
                } else if (current.id < existing.id) {
                    // Замінюємо на товар з меншим ID
                    const index = acc.indexOf(existing);
                    acc[index] = current;
                }
                return acc;
            }, []);

            console.log("ProductProvider: Unique announcements:", uniqueAnnouncements);
            setAnnouncements(uniqueAnnouncements);

        } catch (error: any) {
            console.error("ProductProvider: Failed to get announcements:", error);
            if (error.response?.status === 401) {
                console.log("ProductProvider: Unauthorized, clearing announcements");
                setAnnouncements([]);
            } else {
                throw error;
            }
        } finally {
            setIsLoadingAnnouncements(false);
        }
    };

     // Фільтровані оголошення базуючись на пошуку та вибраній категорії
     const filteredAnnouncements = announcements.filter(announcement => {
        const matchesSearch = searchQuery === '' || 
            announcement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            announcement.description.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesCategory = selectedCategory === null || 
            announcement.categoryName === selectedCategory;
        
        return matchesSearch && matchesCategory && announcement.isDeleted === 0;
    });


    useEffect(() => {
        if (authState.authenticated && authState.accessToken){
            getCategories();
            getAnnouncements();
        } else{
            setCategories([]);
            setAnnouncements([]);
            setSelectedCategory(null);
            setSearchQuery('');
        }
    }, [authState.authenticated, authState.accessToken]);

    useEffect(() => {
        if (authState.authenticated && authState.accessToken){
            const filters: AnnouncementFilters = {};
            if (selectedCategory){
                filters.category = selectedCategory;
            }
            getAnnouncements(filters);
        }
    }, [selectedCategory]);

    const value: ProductContextType = {
        categories,
        selectedCategory,
        isLoadingCategories,
        announcements,
        isLoadingAnnouncements,
        searchQuery,
        getCategories,
        setSelectedCategory,
        getAnnouncements,
        setSearchQuery,
        filteredAnnouncements,
    };

    console.log("ProductProvider: Current state:", {
        categoriesCount: categories.length,
        selectedCategory,
        isLoadingCategories,
        announcementsCount: announcements.length,
        filteredAnnouncementsCount: filteredAnnouncements.length,
        searchQuery,
    });
    return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
};