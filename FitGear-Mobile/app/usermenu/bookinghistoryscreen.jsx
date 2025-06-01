import { AntDesign } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BookingCard from '../../components/EquipmentCards/BookingCard';
import { Colors } from '../../constants/Colors';
import { useBooking } from '../context/BookingContext';
import { useProduct } from '../context/ProductContext';

export default function bookinghistoryscreen() {
    const router = useRouter();
    const { 
        bookingHistory, 
        isLoadingHistory, 
        getUserBookingHistory 
    } = useBooking();
    
    const { announcements } = useProduct();
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);

    // Групуємо бронювання за датами створення
    const groupBookingsByDate = (bookings) => {
        const grouped = {};
        
        bookings.forEach(booking => {
            const date = new Date(booking.from);
            const dateKey = date.toLocaleDateString('uk-UA', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            
            if (!grouped[dateKey]) {
                grouped[dateKey] = [];
            }
            grouped[dateKey].push(booking);
        });

        // Сортуємо групи за датою (найновіші спочатку)
        const sortedGroups = Object.keys(grouped)
            .sort((a, b) => {
                const dateA = new Date(grouped[a][0].from);
                const dateB = new Date(grouped[b][0].from);
                return dateB - dateA;
            })
            .map(dateKey => ({
                date: dateKey,
                bookings: grouped[dateKey].sort((a, b) => 
                    new Date(b.from) - new Date(a.from)
                )
            }));

        return sortedGroups;
    };

    const loadBookingHistory = async () => {
        try {
            setError(null);
            await getUserBookingHistory();
        } catch (err) {
            console.error('Failed to load booking history:', err);
            setError(err.message || 'Не вдалося завантажити історію бронювань');
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadBookingHistory();
        setRefreshing(false);
    };

    useEffect(() => {
        loadBookingHistory();
    }, []);

    // Знаходимо оголошення для кожного бронювання
    const getAnnouncementForBooking = (booking) => {
        return announcements.find(announcement => 
            announcement.id === booking.announcementId
        );
    };

    const groupedBookings = groupBookingsByDate(bookingHistory);

    const renderBookingItem = ({ item: booking }) => {
        const announcement = getAnnouncementForBooking(booking);
        return (
            <BookingCard 
                booking={booking} 
                announcement={announcement}
            />
        );
    };

    const renderDateSection = ({ item: section }) => (
        <View style={styles.dateSection}>
            <Text style={styles.dateHeader}>{section.date}</Text>
            {section.bookings.map(booking => (
                <View key={booking.id}>
                    {renderBookingItem({ item: booking })}
                </View>
            ))}
        </View>
    );

    const renderEmptyState = () => (
        <View style={styles.emptyContainer}>
            <AntDesign name="calendar" size={64} color="#ccc" />
            <Text style={styles.emptyTitle}>Історія бронювань порожня</Text>
            <Text style={styles.emptySubtitle}>
                Ваші майбутні та минулі бронювання з'являться тут
            </Text>
        </View>
    );

    const renderErrorState = () => (
        <View style={styles.errorContainer}>
            <AntDesign name="exclamationcircle" size={64} color="#F44336" />
            <Text style={styles.errorTitle}>Помилка завантаження</Text>
            <Text style={styles.errorSubtitle}>{error}</Text>
        </View>
    );

    if (isLoadingHistory && !refreshing) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Історія бронювань</Text>
                </View>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={Colors.PRIMARY} />
                    <Text style={styles.loadingText}>Завантаження...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity 
                    style={styles.backButton} 
                    onPress={() => router.back()}
                >
                    <AntDesign name="arrowleft" size={24} color="#2C2C2C" />
                </TouchableOpacity>
                <View style={styles.headerContent}>
                    <Text style={styles.headerTitle}>Історія бронювань</Text>
                    <Text style={styles.headerSubtitle}>
                        Усього бронювань: {bookingHistory.length}
                    </Text>
                </View>
            </View>

            {error ? (
                renderErrorState()
            ) : groupedBookings.length === 0 ? (
                renderEmptyState()
            ) : (
                <FlatList
                    data={groupedBookings}
                    renderItem={renderDateSection}
                    keyExtractor={(item) => item.date}
                    contentContainerStyle={styles.listContainer}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={[Colors.PRIMARY]}
                        />
                    }
                    showsVerticalScrollIndicator={false}
                />
            )}
        </SafeAreaView>
    );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    header: {
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingVertical: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    headerTitle: {
        fontSize: 24,
        fontFamily: 'nunito-bold',
        color: '#2C2C2C',
        marginBottom: 5,
    },
    headerSubtitle: {
        fontSize: 14,
        fontFamily: 'nunito-regular',
        color: '#666',
    },
    listContainer: {
        padding: 20,
        paddingBottom: 40,
    },
    dateSection: {
        marginBottom: 25,
    },
    dateHeader: {
        fontSize: 18,
        fontFamily: 'nunito-bold',
        color: Colors.PRIMARY,
        marginBottom: 15,
        backgroundColor: '#fff',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
        textAlign: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 15,
        fontSize: 16,
        fontFamily: 'nunito-medium',
        color: '#666',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    emptyTitle: {
        fontSize: 20,
        fontFamily: 'nunito-bold',
        color: '#2C2C2C',
        marginTop: 20,
        textAlign: 'center',
    },
    emptySubtitle: {
        fontSize: 16,
        fontFamily: 'nunito-regular',
        color: '#666',
        marginTop: 10,
        textAlign: 'center',
        lineHeight: 24,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    errorTitle: {
        fontSize: 20,
        fontFamily: 'nunito-bold',
        color: '#F44336',
        marginTop: 20,
        textAlign: 'center',
    },
    errorSubtitle: {
        fontSize: 16,
        fontFamily: 'nunito-regular',
        color: '#666',
        marginTop: 10,
        textAlign: 'center',
        lineHeight: 24,
    },

})