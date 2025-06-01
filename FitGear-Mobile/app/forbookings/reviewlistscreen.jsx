import AntDesign from '@expo/vector-icons/AntDesign';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { Colors } from '../../constants/Colors';
import { useReview } from '../context/ReviewContext';

export default function reviewlistscreen() {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [announcementTitle, setAnnouncementTitle] = useState('');
    
    const params = useLocalSearchParams();
    const { getReviewsByAnnouncement } = useReview();

    useEffect(() => {
        console.log('ReviewListScreen params:', params);
        
        if (params.announcementId) {
            setAnnouncementTitle(params.title || 'Reviews');
            loadReviews();
        } else {
            console.error('No announcementId provided');
            setLoading(false);
        }
    }, [params.announcementId]);

    const loadReviews = async () => {
        try {
            setLoading(true);
            const reviewsData = await getReviewsByAnnouncement(params.announcementId);
            setReviews(reviewsData);
        } catch (error) {
            console.error('Error loading reviews:', error);
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadReviews();
        setRefreshing(false);
    };

    const handleGoBack = () => {
        router.back();
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

    const formatDate = (dateString) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch (error) {
            return 'Unknown date';
        }
    };

    const renderReviewItem = ({ item }) => (
        <View style={styles.reviewItem}>
            <View style={styles.reviewHeader}>
                <View style={styles.userInfo}>
                    <View style={styles.avatarContainer}>
                        <Text style={styles.avatarText}>
                            {item.userName ? item.userName.charAt(0).toUpperCase() : 'U'}
                        </Text>
                    </View>
                    <View style={styles.userDetails}>
                        <Text style={styles.userName}>
                            {item.userName || 'Anonymous User'}
                        </Text>
                        <Text style={styles.reviewDate}>
                            {formatDate(item.createdAt)}
                        </Text>
                    </View>
                </View>
                <View style={styles.ratingContainer}>
                    <View style={styles.starsContainer}>
                        {renderRatingStars(item.rating, 18)}
                    </View>
                    <Text style={styles.ratingNumber}>{item.rating}/5</Text>
                </View>
            </View>
            
            {item.comment && (
                <View style={styles.commentContainer}>
                    <Text style={styles.commentText}>{item.comment}</Text>
                </View>
            )}
        </View>
    );

    const renderEmptyState = () => (
        <View style={styles.emptyContainer}>
            <AntDesign name="star" size={60} color="#e0e0e0" />
            <Text style={styles.emptyTitle}>No Reviews Yet</Text>
            <Text style={styles.emptySubtitle}>
                Be the first to leave a review for this item!
            </Text>
        </View>
    );

    if (loading && !refreshing) {
        return (
            <View style={styles.container}>
                <StatusBar barStyle='dark-content' backgroundColor='#fff' />
                
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={handleGoBack}
                    >
                        <AntDesign name="arrowleft" size={24} color={Colors.PRIMARY} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Reviews</Text>
                    <View style={styles.placeholder} />
                </View>

                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={Colors.PRIMARY} />
                    <Text style={styles.loadingText}>Loading reviews...</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle='dark-content' backgroundColor='#fff' />
            
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={handleGoBack}
                >
                    <AntDesign name="arrowleft" size={24} color={Colors.PRIMARY} />
                </TouchableOpacity>
                <Text style={styles.headerTitle} numberOfLines={1}>
                    {announcementTitle ? `${announcementTitle} - Reviews` : 'Reviews'}
                </Text>
                <View style={styles.placeholder} />
            </View>

            {reviews.length > 0 && (
                <View style={styles.summaryContainer}>
                    <Text style={styles.summaryText}>
                        {reviews.length} {reviews.length === 1 ? 'Review' : 'Reviews'}
                    </Text>
                    <View style={styles.averageRating}>
                        <View style={styles.starsContainer}>
                            {renderRatingStars(
                                reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length,
                                16
                            )}
                        </View>
                        <Text style={styles.averageRatingText}>
                            {(reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)}
                        </Text>
                    </View>
                </View>
            )}

            <FlatList
                data={reviews}
                renderItem={renderReviewItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={renderEmptyState}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={[Colors.PRIMARY]}
                        tintColor={Colors.PRIMARY}
                    />
                }
            />
        </View>
    );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: StatusBar.currentHeight + 20 || 50,
        paddingBottom: 15,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#f0f8ff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        flex: 1,
        fontSize: 18,
        fontWeight: '600',
        color: Colors.PRIMARY,
        textAlign: 'center',
        marginHorizontal: 10,
        fontFamily: 'nunito-semibold',
    },
    placeholder: {
        width: 40,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#666',
        fontFamily: 'nunito-medium',
    },
    summaryContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: '#f9f9f9',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    summaryText: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.PRIMARY,
        fontFamily: 'nunito-semibold',
    },
    averageRating: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    starsContainer: {
        flexDirection: 'row',
        marginRight: 5,
    },
    averageRatingText: {
        fontSize: 14,
        color: '#666',
        fontFamily: 'nunito-medium',
    },
    listContainer: {
        flexGrow: 1,
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    reviewItem: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 15,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
        borderWidth: 1,
        borderColor: '#f0f0f0',
    },
    reviewHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 10,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    avatarContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Colors.PRIMARY,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    avatarText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: 'nunito-bold',
    },
    userDetails: {
        flex: 1,
    },
    userName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        fontFamily: 'nunito-semibold',
        marginBottom: 2,
    },
    reviewDate: {
        fontSize: 12,
        color: '#666',
        fontFamily: 'nunito-regular',
    },
    ratingContainer: {
        alignItems: 'flex-end',
    },
    ratingNumber: {
        fontSize: 12,
        color: '#666',
        marginTop: 2,
        fontFamily: 'nunito-medium',
    },
    commentContainer: {
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        padding: 12,
        marginTop: 5,
    },
    commentText: {
        fontSize: 14,
        color: '#333',
        lineHeight: 18,
        fontFamily: 'nunito-regular',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 100,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#333',
        marginTop: 20,
        marginBottom: 10,
        fontFamily: 'nunito-semibold',
    },
    emptySubtitle: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        paddingHorizontal: 40,
        fontFamily: 'nunito-regular',
    },

})