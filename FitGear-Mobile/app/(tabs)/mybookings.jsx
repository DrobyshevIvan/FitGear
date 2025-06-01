// app/(tabs)/mybookings.jsx
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, View } from 'react-native';
import BookingCard from '../../components/EquipmentCards/BookingCard';
import { useAuth } from '../context/AuthContext';
import { useBooking } from '../context/BookingContext';
import { useProduct } from '../context/ProductContext';

export default function MyBookings() {
  const { bookingHistory, isLoadingHistory, getUserBookingHistory } = useBooking();
  const { announcements } = useProduct();
  const { authState } = useAuth();
  
  const [activeBookings, setActiveBookings] = useState([]);

  useEffect(() => {
    // Wait for authentication and userProfile to be available
    if (authState.authenticated && authState.accessToken && authState.userProfile?.id) {
      getUserBookingHistory().catch((error) => {
        console.error('Failed to load booking history:', error);
        Alert.alert('Error', 'Failed to load your bookings. Please try again.');
      });
    }
  }, [authState.authenticated, authState.accessToken, authState.userProfile?.id]);

  useEffect(() => {
    if (bookingHistory.length > 0 && announcements.length > 0) {
      // Filter for active bookings only
      const active = bookingHistory.filter(booking => 
        booking.status?.toLowerCase() === 'active'
      );
      
      // Enrich bookings with announcement details
      const bookingsWithDetails = active.map(booking => {
        const announcement = announcements.find(ann => ann.id === booking.announcementId);
        return announcement ? { ...booking, announcement } : null;
      }).filter(Boolean);
      
      setActiveBookings(bookingsWithDetails);
    } else if (bookingHistory.length > 0) {
      // If announcements not loaded yet, just filter for active bookings
      const active = bookingHistory.filter(booking => 
        booking.status?.toLowerCase() === 'active'
      );
      setActiveBookings(active);
    }
  }, [bookingHistory, announcements]);

  const renderBookingItem = ({ item }) => (
    <View style={styles.cardContainer}>
      <BookingCard 
        booking={item} 
        announcement={item.announcement} 
      />
    </View>
  );

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>No Active Bookings</Text>
      <Text style={styles.emptyText}>
        You don't have any active bookings at the moment.
      </Text>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <Text style={styles.pageTitle}>My Active Bookings</Text>
      <Text style={styles.countText}>
        {activeBookings.length} ongoing reservation{activeBookings.length !== 1 ? 's' : ''}
      </Text>
    </View>
  );

  if (isLoadingHistory) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Loading your bookings...</Text>
      </View>
    );
  }

  if (!authState.authenticated) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Please log in to view your bookings</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={activeBookings}
        renderItem={renderBookingItem}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyList}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerContainer: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  countText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  listContainer: {
    flexGrow: 1,
  },
  cardContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  separator: {
    height: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
});
