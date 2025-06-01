import AntDesign from '@expo/vector-icons/AntDesign';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Dimensions, Image, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ReviewForm from '../../components/EquipmentCards/ReviewForm';
import { Colors } from '../../constants/Colors';
import { useReview } from '../context/ReviewContext';

const { width } = Dimensions.get('window');

export default function announcementdetail({ route, navigation }) {
    const [announcement, setAnnouncement] = useState(null);
    const [loading, setLoading] = useState(true);
    const [reviewStats, setReviewStats] = useState({ averageRating: 0, totalReviews: 0 });
    const [showReviewForm, setShowReviewForm] = useState(false);
   
    const params = useLocalSearchParams();
    const { calculateReviewStats } = useReview();

    useEffect(() => {
        console.log('Route params:', route?.params);
        console.log('Expo Router params:', params);
       
        let announcementData = null;
       
        // Спосіб 1: Expo Router params (окремі поля)
        if (params.id) {
            announcementData = {
                id: parseInt(params.id),
                title: params.title || '',
                description: params.description || '',
                pricePerDay: parseFloat(params.pricePerDay) || 0,
                quantityAvailable: parseInt(params.quantityAvailable) || 0,
                categoryName: params.categoryName || '',
                categoryId: parseInt(params.categoryId) || 0,
                url: params.url || null,
                isDeleted: parseInt(params.isDeleted) || 0
            };
            console.log('Using Expo Router params:', announcementData);
        }
        // Спосіб 2: JSON string в Expo Router
        else if (params.announcementData) {
            try {
                announcementData = JSON.parse(params.announcementData);
                console.log('Using Expo Router JSON params:', announcementData);
            } catch (error) {
                console.error('Error parsing Expo Router JSON params:', error);
            }
        }
        // Спосіб 3: React Navigation (fallback)
        else if (route?.params?.announcement) {
            try {
                if (typeof route.params.announcement === 'string') {
                    announcementData = JSON.parse(route.params.announcement);
                } else {
                    announcementData = route.params.announcement;
                }
                console.log('Using React Navigation params:', announcementData);
            } catch (error) {
                console.error('Error parsing React Navigation params:', error);
            }
        }

        if (announcementData) {
            setAnnouncement(announcementData);
            loadReviewStats(announcementData.id);
        } else {
            console.error('No announcement data found in any params source');
        }
       
        setLoading(false);
    }, [params.id,
        params.title,
        params.description,
        params.pricePerDay,
        params.quantityAvailable,
        params.categoryName,
        params.categoryId,
        params.url,
        params.isDeleted,
        params.announcementData,
        route?.params?.announcement]);

    const loadReviewStats = async (announcementId) => {
        try {
            const stats = await calculateReviewStats(announcementId.toString());
            setReviewStats(stats);
        } catch (error) {
            console.error('Error loading review stats:', error);
        }
    };

    const handleBookPress = () => {
        if (announcement) {
            console.log('Booking announcement with ID:', announcement.id);
            router.push({
                pathname: 'forbookings/bookingscreen',
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
            })
        }
    };

    const calculateWeekPrice = (pricePerDay) => {
        return (pricePerDay * 24).toFixed(2);
    };

    const getAvailabilityColor = (quantity) => {
        return quantity > 0 ? '#4CAF50' : '#f44336';
    };

    const handleGoBack = () => {
        if (navigation) {
            navigation.goBack();
        } else {
            router.back();
        }
    };

    const handleReviewsPress = () => {
        if (reviewStats.totalReviews > 0 && announcement) {
            console.log('Navigate to reviews page for announcement:', announcement.id);
            router.push({
                pathname: '/forbookings/reviewlistscreen',
                params: {
                    announcementId: announcement.id.toString(),
                    title: announcement.title
                }
            });
        }
    };

    const handleReviewCreated = () => {
        // Оновлюємо статистику після створення нового review
        if (announcement) {
            loadReviewStats(announcement.id);
        }
        setShowReviewForm(false);
    };

    const renderRatingStars = (rating, size = 16) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;

        for (let i = 1; i <= 5; i++) {
            if (i <= fullStars) {
                stars.push(
                    <AntDesign
                        key={i}
                        name="star"
                        size={size}
                        color="#FFD700"
                    />
                );
            } else if (i === fullStars + 1 && hasHalfStar) {
                stars.push(
                    <AntDesign
                        key={i}
                        name="star"
                        size={size}
                        color="#FFD700"
                        style={{ opacity: 0.5 }}
                    />
                );
            } else {
                stars.push(
                    <AntDesign
                        key={i}
                        name="star"
                        size={size}
                        color="#e0e0e0"
                    />
                );
            }
        }
        return stars;
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Loading...</Text>
            </View>
        );
    }

    if (!announcement) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>No announcement data available</Text>
                <TouchableOpacity
                    style={styles.backToListButton}
                    onPress={handleGoBack}
                >
                    <Text style={styles.backToListText}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle='light-content' backgroundColor='transparent' translucent />
           
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={handleGoBack}>
                    <AntDesign name="arrowleft" size={24} color="#000" />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                <View style={styles.imageContainer}>
                    {announcement.url ? (
                        <Image
                            source={{ uri: announcement.url }}
                            style={styles.image}
                            resizeMode='cover'
                        />
                    ) : (
                        <View style={styles.placeholderImage}>
                            <AntDesign name='picture' size={60} color="#ccc" />
                            <Text style={styles.placeholderText}>No image available</Text>
                        </View>
                    )}
                </View>

                <View style={styles.contentContainer}>
                    <Text style={styles.title}>{announcement.title}</Text>

                    <View style={styles.categoryContainer}>
                        <Text style={styles.categoryLabel}>Category:</Text>
                        <Text style={styles.categoryValue}>{announcement.categoryName}</Text>
                    </View>

                    <View style={styles.ratingContainer}>
                        <View style={styles.starsContainer}>
                            {renderRatingStars(reviewStats.averageRating)}
                        </View>
                        <TouchableOpacity 
                            onPress={handleReviewsPress}
                            disabled={reviewStats.totalReviews === 0}
                        >
                            <Text style={[
                                styles.ratingText,
                                reviewStats.totalReviews === 0 && { textDecorationLine: 'none', color: '#999' }
                            ]}>
                                {reviewStats.averageRating > 0
                                    ? `${reviewStats.averageRating} (${reviewStats.totalReviews} reviews)`
                                    : 'No reviews yet'
                                }
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.availabilityContainer}>
                        <Text style={styles.availabilityLabel}>Available quantity:</Text>
                        <Text style={[
                            styles.availabilityValue,
                            { color: getAvailabilityColor(announcement.quantityAvailable) }
                        ]}>
                            {announcement.quantityAvailable} pcs
                        </Text>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>About</Text>
                        <View style={styles.sectionContent}>
                            <Text style={styles.descriptionText}>
                                {announcement.description || 'No description available for this item.'}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Price</Text>
                        <View style={styles.sectionContent}>
                            <View style={styles.priceRow}>
                                <Text style={styles.priceLabel}>For 1 hour</Text>
                                <Text style={styles.priceValue}>${announcement.pricePerDay}</Text>
                            </View>
                            <View style={styles.priceRow}>
                                <Text style={styles.priceLabel}>For 1 days</Text>
                                <Text style={styles.priceValue}>
                                    ${calculateWeekPrice(announcement.pricePerDay)}
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Review Section */}
                    <View style={styles.section}>
                        <View style={styles.reviewHeaderContainer}>
                            <Text style={styles.sectionTitle}>Reviews</Text>
                            <TouchableOpacity
                                style={styles.addReviewButton}
                                onPress={() => setShowReviewForm(!showReviewForm)}
                            >
                                <AntDesign
                                    name={showReviewForm ? "minus" : "plus"}
                                    size={16}
                                    color="#fff"
                                />
                                <Text style={styles.addReviewButtonText}>
                                    {showReviewForm ? "Cancel" : "Add Review"}
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {showReviewForm && (
                            <ReviewForm
                                announcementId={announcement.id}
                                onReviewCreated={handleReviewCreated}
                            />
                        )}

                        {reviewStats.totalReviews > 0 && (
                            <TouchableOpacity
                                style={styles.viewAllReviewsButton}
                                onPress={handleReviewsPress}
                            >
                                <Text style={styles.viewAllReviewsText}>
                                    View all {reviewStats.totalReviews} reviews
                                </Text>
                                <AntDesign name="right" size={16} color={Colors.PRIMARY} />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </ScrollView>

            <View style={styles.bookButtonContainer}>
                <TouchableOpacity
                    style={[
                        styles.bookButton,
                        announcement.quantityAvailable === 0 && styles.bookButtonDisabled
                    ]}
                    onPress={handleBookPress}
                    disabled={announcement.quantityAvailable === 0}
                >
                    <Text style={styles.bookButtonText}>
                        {announcement.quantityAvailable === 0 ? 'OUT OF STOCK' : 'BOOK'}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 20,
    },
    loadingText: {
        fontSize: 16,
        color: '#666',
        fontFamily: 'nunito-medium',
        textAlign: 'center',
        marginBottom: 20,
    },
    backToListButton: {
        backgroundColor: Colors.PRIMARY,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
    },
    backToListText: {
        color: '#fff',
        fontSize: 16,
        fontFamily: 'nunito-medium',
    },
    header: {
        position: 'absolute',
        top: StatusBar.currentHeight + 10 || 50,
        left: 20,
        zIndex: 1000,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    scrollView: {
        flex: 1,
    },
    imageContainer: {
        width: width,
        height: 340,
        backgroundColor: '#f5f5f5',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    placeholderImage: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
    },
    placeholderText: {
        marginTop: 10,
        fontSize: 16,
        color: '#999',
        fontFamily: 'nunito-medium',
    },
    contentContainer: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        marginTop: -20,
        paddingHorizontal: 20,
        paddingTop: 25,
        paddingBottom: 100, // Space for book button
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: Colors.PRIMARY,
        marginBottom: 15,
        fontFamily: 'nunito-bold',
    },
    categoryContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    categoryLabel: {
        fontSize: 14,
        color: '#666',
        fontFamily: 'nunito-medium',
        marginRight: 8,
    },
    categoryValue: {
        fontSize: 14,
        color: Colors.PRIMARY,
        fontFamily: 'nunito-semibold',
        backgroundColor: '#f0f8ff',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    starsContainer: {
        flexDirection: 'row',
        marginRight: 8,
    },
    ratingText: {
        fontSize: 14,
        color: '#666',
        fontFamily: 'nunito-medium',
        textDecorationLine: 'underline',
    },
    availabilityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 25,
    },
    availabilityLabel: {
        fontSize: 14,
        color: '#666',
        fontFamily: 'nunito-medium',
        marginRight: 8,
    },
    availabilityValue: {
        fontSize: 14,
        fontFamily: 'nunito-semibold',
    },
    section: {
        marginBottom: 25,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.PRIMARY,
        marginBottom: 10,
        fontFamily: 'nunito-semibold',
    },
    sectionContent: {
        backgroundColor: '#f9f9f9',
        borderRadius: 12,
        padding: 15,
    },
    descriptionText: {
        fontSize: 14,
        color: '#333',
        lineHeight: 20,
        fontFamily: 'nunito-regular',
    },
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
    },
    priceLabel: {
        fontSize: 16,
        color: '#333',
        fontFamily: 'nunito-medium',
    },
    priceValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.PRIMARY,
        fontFamily: 'nunito-bold',
    },
    reviewHeaderContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    addReviewButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.PRIMARY,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 15,
    },
    addReviewButtonText: {
        color: '#fff',
        fontSize: 12,
        fontFamily: 'nunito-medium',
        marginLeft: 5,
    },
    viewAllReviewsButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#f0f8ff',
        padding: 15,
        borderRadius: 12,
        marginTop: 10,
    },
    viewAllReviewsText: {
        fontSize: 16,
        color: Colors.PRIMARY,
        fontFamily: 'nunito-medium',
    },
    bookButtonContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingVertical: 20,
        paddingBottom: 30,
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
    },
    bookButton: {
        backgroundColor: Colors.PRIMARY,
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    bookButtonDisabled: {
        backgroundColor: '#ccc',
    },
    bookButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: 'nunito-bold',
        letterSpacing: 1,
    },

})