import { AntDesign } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { useReview } from '../../app/context/ReviewContext';
import { Colors } from '../../constants/Colors';

export default function BookingCard({booking, announcement}) {
    const { calculateReviewStats } = useReview();
        const [reviewStats, setReviewStats] = useState({
            averageRating: 0,
            totalReviews: 0
        });
        const [isLoadingStats, setIsLoadingStats] = useState(true);
    
        // Завантажуємо статистику рейтингів при монтуванні компонента
        useEffect(() => {
            const loadStats = async () => {
                if (!announcement?.id) return;
                
                try {
                    setIsLoadingStats(true);
                    const stats = await calculateReviewStats(announcement.id);
                    setReviewStats(stats);
                } catch (error) {
                    console.error('Failed to load review stats for announcement:', announcement.id, error);
                } finally {
                    setIsLoadingStats(false);
                }
            };
    
            loadStats();
        }, [announcement?.id, calculateReviewStats]);
    
        const renderRating = () => {
            // Якщо немає рейтингів, не показуємо зірочку
            if (reviewStats.totalReviews === 0) {
                return (
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginTop: 5,
                    }}>
                        <Text style={{
                            fontSize: 14,
                            color: '#999',
                            fontFamily: 'nunito-regular',
                        }}>
                            No reviews yet
                        </Text>
                    </View>
                );
            }
    
            return (
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 5,
                }}>
                    <AntDesign name="star" size={16} color="#FFD700" />
                    <Text style={{
                        marginLeft: 5,
                        fontSize: 14,
                        color: '#666',
                        fontFamily: 'nunito-medium',
                    }}>
                        {reviewStats.averageRating.toFixed(1)}
                    </Text>
                    <Text style={{
                        marginLeft: 3,
                        fontSize: 12,
                        color: '#999',
                        fontFamily: 'nunito-regular',
                    }}>
                        ({reviewStats.totalReviews})
                    </Text>
                </View>
            );
        };
    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'confirmed':
            case 'active':
                return '#4CAF50'; // Зелений
            case 'pending':
                return '#FF9800'; // Помаранчевий
            case 'cancelled':
            case 'canceled':
                return '#F44336'; // Червоний
            case 'completed':
                return '#2196F3'; // Синій
            default:
                return '#757575'; // Сірий
        }
    };

    const getStatusText = (status) => {
        switch (status?.toLowerCase()) {
            case 'confirmed':
                return 'Підтверджено';
            case 'pending':
                return 'Очікує';
            case 'cancelled':
            case 'canceled':
                return 'Скасовано';
            case 'completed':
                return 'Завершено';
            case 'active':
                return 'Активне';
            default:
                return status || 'Невідомо';
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('uk-UA', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatDateRange = (fromDate, toDate) => {
        const from = new Date(fromDate);
        const to = new Date(toDate);
        
        const fromFormatted = from.toLocaleDateString('uk-UA', {
            month: 'short',
            day: 'numeric',
        });
        
        const toFormatted = to.toLocaleDateString('uk-UA', {
            month: 'short',
            day: 'numeric',
        });

        return `${fromFormatted} - ${toFormatted}`;
    };

    

    return (
        <TouchableOpacity 
            style={{
                backgroundColor: '#fff',
                borderRadius: 15,
                marginBottom: 15,
                width: '100%',
                shadowColor: "#000",
                shadowOffset: {
                    width: 0,
                    height: 2,
                },
                shadowOpacity: 0.1,
                shadowRadius: 3.84,
                elevation: 5,
            }}
            activeOpacity={0.7}
            onPress={() => {
                // При натисканні нічого не робимо, як зазначено в завданні
                console.log('Booking card pressed:', booking.id);
            }}
        >
            <View style={{ position: 'relative' }}>
                {announcement?.url ? (
                    <Image
                        source={{ uri: announcement.url }}
                        style={{
                            width: '100%',
                            height: 200,
                            borderTopLeftRadius: 15,
                            borderTopRightRadius: 15,
                        }}
                        resizeMode="cover"
                    />
                ) : (
                    <View style={{
                        width: '100%',
                        height: 200,
                        borderTopLeftRadius: 15,
                        borderTopRightRadius: 15,
                        backgroundColor: '#f0f0f0',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                        <AntDesign name="picture" size={40} color="#ccc" />
                        <Text style={{
                            color: '#999',
                            marginTop: 5,
                            fontSize: 12,
                        }}>
                            No Image
                        </Text>
                    </View>
                )}

                {/* Бейдж з категорією */}
                {announcement?.categoryName && (
                    <View style={{
                        position: 'absolute',
                        top: 10,
                        left: 10,
                        backgroundColor: Colors.PRIMARY,
                        paddingHorizontal: 8,
                        paddingVertical: 4,
                        borderRadius: 10,
                    }}>
                        <Text style={{
                            color: '#fff',
                            fontSize: 10,
                            fontFamily: 'nunito-medium',
                        }}>
                            {announcement.categoryName}
                        </Text>
                    </View>
                )}

                {/* Бейдж зі статусом замовлення */}
                <View style={{
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    backgroundColor: getStatusColor(booking.status),
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    borderRadius: 10,
                }}>
                    <Text style={{
                        color: '#fff',
                        fontSize: 10,
                        fontFamily: 'nunito-medium',
                    }}>
                        {getStatusText(booking.status)}
                    </Text>
                </View>
            </View>

            {/* Контент */}
            <View style={{ padding: 15 }}>
                {/* Назва */}
                <Text style={{
                    fontSize: 18,
                    fontFamily: 'nunito-bold',
                    color: '#2C2C2C',
                    marginBottom: 5,
                }}
                numberOfLines={2}
                >
                    {announcement?.title || 'Замовлення #' + booking.id}
                </Text>

                {/* Опис або ID бронювання */}
                <Text style={{
                    fontSize: 14,
                    color: '#666',
                    fontFamily: 'nunito-regular',
                    marginBottom: 5,
                }}
                numberOfLines={2}
                >
                    {announcement?.description || `Бронювання ID: ${booking.id}`}
                </Text>

                {/* Період бронювання */}
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: 10,
                }}>
                    <AntDesign name="calendar" size={16} color="#666" />
                    <Text style={{
                        fontSize: 14,
                        color: '#666',
                        fontFamily: 'nunito-medium',
                        marginLeft: 5,
                    }}>
                        {formatDateRange(booking.from, booking.to)}
                    </Text>
                </View>

                {/* Інформація про бронювання */}
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}>
                    {/* Ціна або статус */}
                    <View>
                        <Text style={{
                            fontSize: 16,
                            fontFamily: 'nunito-bold',
                            color: getStatusColor(booking.status),
                        }}>
                            {getStatusText(booking.status)}
                        </Text>
                        <Text style={{
                            fontSize: 12,
                            color: '#666',
                            fontFamily: 'nunito-regular',
                        }}>
                            ID: {booking.id}
                        </Text>
                    </View>

                    {/* Рейтинг */}
                    {renderRating()}
                </View>
            </View>
        </TouchableOpacity>
    );

}