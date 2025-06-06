import { useNavigation } from '@react-navigation/native'
import { router } from 'expo-router'
import React, { useCallback, useEffect, useState } from 'react'
import { ActivityIndicator, FlatList, ScrollView, Text, View } from 'react-native'
import AnnouncementCard from '../../components/EquipmentCards/AnnouncementCard'
import Category from '../../components/Home/Category'
import Header from '../../components/Home/Header'
import { Colors } from '../../constants/Colors'
import { useProduct } from '../context/ProductContext'
import { useReview } from '../context/ReviewContext'



export default function home() {
  const navigation = useNavigation();
  const { announcements, isLoadingAnnouncements, getAnnouncements } = useProduct();
  const { calculateReviewStats } = useReview();
  
  const [topRatedAnnouncements, setTopRatedAnnouncements] = useState([]);
  const [isLoadingTopRated, setIsLoadingTopRated] = useState(false);

  const handleCategoryPress = (categoryName) => {
    console.log('Chosen category on home page:', categoryName);
    navigation.navigate('explore', { selectedCategory: categoryName });
  };

  const handleAnnouncementPress = (announcement) => {
    console.log('Navigate to announcement detail:', announcement.id);
    
    // Навігація через Expo Router
    router.push({
      pathname: '/forbookings/announcementdetail',
      params: {
        id: announcement.id.toString(),
        title: announcement.title,
        description: announcement.description,
        pricePerDay: announcement.pricePerDay.toString(),
        quantityAvailable: announcement.quantityAvailable.toString(),
        categoryName: announcement.categoryName,
        categoryId: announcement.categoryId.toString(),
        url: announcement.url || '',
        isDeleted: announcement.isDeleted?.toString() || '0'
      }
    });
  };

  const loadTopRatedAnnouncements = useCallback(async () => {
    if (!announcements || announcements.length === 0) return;
    
    console.log('Loading top rated announcements...');
    setIsLoadingTopRated(true);
    
    try {
      // Отримуємо рейтинги для всіх оголошень
      const announcementsWithRatings = await Promise.all(
        announcements.map(async (announcement) => {
          try {
            const stats = await calculateReviewStats(announcement.id.toString());
            return {
              ...announcement,
              reviewStats: stats
            };
          } catch (error) {
            console.error(`Failed to get stats for announcement ${announcement.id}:`, error);
            return {
              ...announcement,
              reviewStats: { averageRating: 0, totalReviews: 0 }
            };
          }
        })
      );

      // Сортуємо за рейтингом (спочатку ті, що мають відгуки, потім за рейтингом)
      const sortedAnnouncements = announcementsWithRatings.sort((a, b) => {
        // Спочатку ті, що мають відгуки
        if (a.reviewStats.totalReviews > 0 && b.reviewStats.totalReviews === 0) return -1;
        if (a.reviewStats.totalReviews === 0 && b.reviewStats.totalReviews > 0) return 1;
        
        // Якщо обидва мають відгуки або обидва не мають, сортуємо за рейтингом
        if (a.reviewStats.averageRating !== b.reviewStats.averageRating) {
          return b.reviewStats.averageRating - a.reviewStats.averageRating;
        }
        
        // Якщо рейтинги однакові, сортуємо за кількістю відгуків
        return b.reviewStats.totalReviews - a.reviewStats.totalReviews;
      });

      // Беремо топ 3
      const top3 = sortedAnnouncements.slice(0, 3);
      console.log('Top 3 rated announcements:', top3.map(a => ({
        id: a.id,
        title: a.title,
        rating: a.reviewStats.averageRating,
        reviews: a.reviewStats.totalReviews
      })));
      
      setTopRatedAnnouncements(top3);
    } catch (error) {
      console.error('Failed to load top rated announcements:', error);
    } finally {
      setIsLoadingTopRated(false);
    }
  }, [announcements, calculateReviewStats]);

  // Завантажуємо топ-рейтингові оголошення при зміні списку оголошень
  useEffect(() => {
    if (announcements && announcements.length > 0) {
      loadTopRatedAnnouncements();
    }
  }, [loadTopRatedAnnouncements]);

  const renderTopRatedItem = ({ item }) => (
    <AnnouncementCard 
      announcement={item} 
      onPress={handleAnnouncementPress}
    />
  );

  const renderTopRatedSection = () => {
    if (isLoadingAnnouncements || isLoadingTopRated) {
      return (
        <View style={{
          paddingHorizontal: 20,
          paddingVertical: 20,
          alignItems: 'center'
        }}>
          <ActivityIndicator size="large" color={Colors.PRIMARY} />
          <Text style={{
            marginTop: 10,
            fontSize: 14,
            color: '#666',
            fontFamily: 'nunito-regular'
          }}>
            Loading top rated items...
          </Text>
        </View>
      );
    }

    if (!topRatedAnnouncements || topRatedAnnouncements.length === 0) {
      return (
        <View style={{
          paddingHorizontal: 20,
          paddingVertical: 20,
          alignItems: 'center'
        }}>
          <Text style={{
            fontSize: 16,
            color: '#666',
            fontFamily: 'nunito-regular',
            textAlign: 'center'
          }}>
            No items available yet
          </Text>
        </View>
      );
    }

    return (
      <View style={{ paddingHorizontal: 20 }}>
        <FlatList
          data={topRatedAnnouncements}
          renderItem={renderTopRatedItem}
          keyExtractor={(item) => item.id.toString()}
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
        />
      </View>
    );
  };

  return (
    <ScrollView 
      style={{ flex: 1, backgroundColor: '#fff' }}
      showsVerticalScrollIndicator={false}
    >
      <Header />

      <Category
        onCategoryPress={handleCategoryPress}
        showSelected={false} 
      />

      {/* Секція топ-рейтингових товарів */}
      <View style={{ marginTop: 20, marginBottom: 20 }}>
        <View style={{ 
          paddingHorizontal: 20, 
          marginBottom: 15,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Text style={{
            fontSize: 20,
            fontFamily: 'nunito-bold',
            color: Colors.PRIMARY,
          }}>
            Top Rated Items
          </Text>
          {topRatedAnnouncements.length > 0 && (
            <Text style={{
              fontSize: 12,
              fontFamily: 'nunito-regular',
              color: '#666',
            }}>
              Best reviews
            </Text>
          )}
        </View>
        
        {renderTopRatedSection()}
      </View>
    </ScrollView>
  )


}