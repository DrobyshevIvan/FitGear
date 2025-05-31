import AntDesign from '@expo/vector-icons/AntDesign';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    Alert,
    Dimensions,
    Image,
    Modal,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Colors } from '../../constants/Colors';
import { useAuth } from '../context/AuthContext';
import { useBooking } from '../context/BookingContext';


const {width} = Dimensions.get('window');

export default function bookingscreen() {
    const [announcement, setAnnouncement] = useState(null);
    const [loading, setLoading] = useState(true);
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [fromTime, setFromTime] = useState('09');
    const [toTime, setToTime] = useState('18');
    const [showTimeModal, setShowTimeModal] = useState(false);
    const [timeType, setTimeType] = useState('from');

    const params = useLocalSearchParams();
    const { authState, getUserProfile, isLoadingProfile } = useAuth();
    const { 
        createBooking, 
        createPayment, 
        calculateHours, 
        calculateTotalPrice, 
        isLoadingBooking,
        isLoadingPayment 
    } = useBooking();

    // Завантажуємо профіль користувача при ініціалізації
    useEffect(() => {
        const loadUserProfile = async () => {
            if (authState.authenticated && !authState.userProfile) {
                try {
                    await getUserProfile();
                } catch (error) {
                    console.error('Failed to load user profile:', error);
                }
            }
        };
        loadUserProfile();
    }, [authState.authenticated, authState.userProfile, getUserProfile]);

    // Генеруємо години від 0 до 23 один раз
    const hours = useMemo(() => 
        Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0')), 
        []
    );

    // Мемоізуємо розрахунок з урахуванням погодинної оплати
    const { totalHours, totalPrice } = useMemo(() => {
        if (fromDate && toDate && fromTime && toTime && announcement) {
            const fromDateTime = new Date(`${fromDate}T${fromTime}:00:00`);
            const toDateTime = new Date(`${toDate}T${toTime}:00:00`);

            if (toDateTime > fromDateTime) {
                const hours = calculateHours(fromDateTime, toDateTime);
                const price = calculateTotalPrice(hours, announcement.pricePerDay);
                return { totalHours: hours, totalPrice: price };
            }
        }
        return { totalHours: 0, totalPrice: 0 };
    }, [fromDate, toDate, fromTime, toTime, announcement, calculateHours, calculateTotalPrice]);

    // Завантаження даних про оголошення
    useEffect(() => {
        let announcementData = null;

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
        } else if (params.announcementData) {
            try {
                announcementData = JSON.parse(params.announcementData);
            } catch (error) {
                console.error('Error parsing announcement data:', error);
            }
        }

        if (announcementData) {
            setAnnouncement(announcementData);
        }

        setLoading(false);
    }, [params.id]);

    const handleDayPress = useCallback((day) => {
        const selectedDate = day.dateString;
        const today = new Date().toISOString().split('T')[0];

        if (selectedDate < today) {
            Alert.alert('Invalid Date', 'Please select a date from today onwards.');
            return;
        }

        if (!fromDate || (fromDate && toDate) || selectedDate < fromDate) {
            setFromDate(selectedDate);
            setToDate(null);
        } else if (fromDate && !toDate && selectedDate >= fromDate) {
            setToDate(selectedDate);
        }
    }, [fromDate, toDate]);

    const getMarkedDates = useMemo(() => {
        const marked = {};

        if (fromDate) {
            marked[fromDate] = {
                startingDay: true,
                color: Colors.PRIMARY,
                textColor: 'white'
            };
        }

        if (toDate) {
            marked[toDate] = {
                endingDay: true,
                color: Colors.PRIMARY,
                textColor: 'white'
            };
        }

        if (fromDate && toDate) {
            const start = new Date(fromDate);
            const end = new Date(toDate);
            const current = new Date(start);

            while (current < end) {
                current.setDate(current.getDate() + 1);
                const dateString = current.toISOString().split('T')[0];
                if (dateString !== toDate) {
                    marked[dateString] = {
                        color: Colors.PRIMARY + '30',
                        textColor: Colors.PRIMARY
                    };
                }
            }
        }

        return marked;
    }, [fromDate, toDate]);

    const handleTimeSelect = useCallback((hour) => {
        if (timeType === 'from') {
            setFromTime(hour);
        } else {
            setToTime(hour);
        }
        setShowTimeModal(false);
    }, [timeType]);

    const handleBooking = useCallback(async () => {
        if (!fromDate || !toDate || !fromTime || !toTime) {
            Alert.alert('Incomplete Data', 'Please select both start and end dates with times.');
            return;
        }

        if (totalHours <= 0) {
            Alert.alert('Invalid Time Range', 'End time must be after start time.');
            return;
        }

        // Перевіряємо чи завантажений профіль користувача
        if (!authState.userProfile?.id) {
            Alert.alert('Profile Error', 'User profile not loaded. Please try again.');
            return;
        }

        try {
            const fromDateTime = new Date(`${fromDate}T${fromTime}:00:00`);
            const toDateTime = new Date(`${toDate}T${toTime}:00:00`);

            // Створюємо бронювання
            const bookingData = {
                from: fromDateTime.toISOString(),
                to: toDateTime.toISOString(),
                userId: authState.userProfile.id,
                announcementId: announcement.id
            };

            console.log('Creating booking with data:', bookingData);
            const bookingResult = await createBooking(bookingData);
            
            // Створюємо платіж
            const paymentData = {
                amount: totalPrice,
                userId: authState.userProfile.id,
                bookingId: bookingResult.id
            };

            console.log('Creating payment with data:', paymentData);
            const paymentResult = await createPayment(paymentData);
            
            // Переходимо на екран оплати
            router.push({
                pathname: 'forbookings/paymentscreen',
                params: {
                    bookingId: bookingResult.id,
                    paymentId: paymentResult.id,
                    totalPrice: totalPrice.toFixed(2),
                    totalHours: totalHours,
                    announcementTitle: announcement.title,
                    announcementImage: announcement.url || '',
                    fromDate: fromDate,
                    toDate: toDate,
                    fromTime: fromTime,
                    toTime: toTime,
                    pricePerHour: announcement.pricePerDay,
                    paymentUrl: paymentResult.paymentUrl || null
                }
            });
            
        } catch (error) {
            console.error('Booking/Payment error:', error);
            Alert.alert(
                'Booking Failed', 
                error.message || 'An error occurred while creating your booking or payment.'
            );
        }
    }, [
        fromDate, 
        toDate, 
        fromTime, 
        toTime, 
        totalHours, 
        totalPrice, 
        announcement, 
        authState.userProfile, 
        createBooking,
        createPayment
    ]);

    const handleGoBack = useCallback(() => {
        router.back();
    }, []);

    const openTimeModal = useCallback((type) => {
        setTimeType(type);
        setShowTimeModal(true);
    }, []);

    if (loading || isLoadingProfile) {
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
                <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
                    <Text style={styles.backButtonText}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle='light-content' backgroundColor='transparent' translucent />
            
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
                    <AntDesign name="arrowleft" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Book Item</Text>
            </View>

            <ScrollView 
                style={styles.scrollView} 
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollViewContent}
            >
                {/* Інформація про товар */}
                <View style={styles.itemContainer}>
                    <View style={styles.itemImageContainer}>
                        {announcement.url ? (
                            <Image
                                source={{ uri: announcement.url }}
                                style={styles.itemImage}
                                resizeMode='cover'
                            />
                        ) : (
                            <View style={styles.placeholderImage}>
                                <AntDesign name='picture' size={40} color="#ccc" />
                            </View>
                        )}
                    </View>
                    <View style={styles.itemInfo}>
                        <Text style={styles.itemTitle}>{announcement.title}</Text>
                        <Text style={styles.itemCategory}>{announcement.categoryName}</Text>
                        <Text style={styles.itemPrice}>${announcement.pricePerDay}/hour</Text>
                    </View>
                </View>

                {/* Календар */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Select Dates</Text>
                    <View style={styles.sectionContent}>
                        <Calendar
                            onDayPress={handleDayPress}
                            markingType={'period'}
                            markedDates={getMarkedDates}
                            minDate={new Date().toISOString().split('T')[0]}
                            theme={{
                                backgroundColor: 'transparent',
                                calendarBackground: 'transparent',
                                textSectionTitleColor: Colors.PRIMARY,
                                selectedDayBackgroundColor: Colors.PRIMARY,
                                selectedDayTextColor: '#ffffff',
                                todayTextColor: Colors.PRIMARY,
                                dayTextColor: '#2d4150',
                                textDisabledColor: '#d9e1e8',
                                arrowColor: Colors.PRIMARY,
                                monthTextColor: Colors.PRIMARY,
                                indicatorColor: Colors.PRIMARY,
                                textDayFontFamily: 'nunito-medium',
                                textMonthFontFamily: 'nunito-semibold',
                                textDayHeaderFontFamily: 'nunito-medium',
                            }}
                        />
                        {fromDate && (
                            <View style={styles.dateInfo}>
                                <Text style={styles.dateInfoText}>
                                    From: {fromDate} {toDate && `• To: ${toDate}`}
                                </Text>
                            </View>
                        )}
                    </View>
                </View>

                {/* Вибір часу */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Select Time</Text>
                    <View style={styles.sectionContent}>
                        <View style={styles.timeRow}>
                            <TouchableOpacity
                                style={styles.timeButton}
                                onPress={() => openTimeModal('from')}
                            >
                                <Text style={styles.timeButtonLabel}>From</Text>
                                <Text style={styles.timeButtonValue}>{fromTime}:00</Text>
                            </TouchableOpacity>
                            
                            <TouchableOpacity
                                style={styles.timeButton}
                                onPress={() => openTimeModal('to')}
                            >
                                <Text style={styles.timeButtonLabel}>To</Text>
                                <Text style={styles.timeButtonValue}>{toTime}:00</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/* Підсумок */}
                {totalHours > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Booking Summary</Text>
                        <View style={styles.sectionContent}>
                            <View style={styles.summaryRow}>
                                <Text style={styles.summaryLabel}>Duration</Text>
                                <Text style={styles.summaryValue}>{totalHours} hours</Text>
                            </View>
                            <View style={styles.summaryRow}>
                                <Text style={styles.summaryLabel}>Rate per hour</Text>
                                <Text style={styles.summaryValue}>${announcement.pricePerDay}</Text>
                            </View>
                            <View style={[styles.summaryRow, styles.totalRow]}>
                                <Text style={styles.totalLabel}>Total Price</Text>
                                <Text style={styles.totalValue}>${totalPrice.toFixed(2)}</Text>
                            </View>
                        </View>
                    </View>
                )}

                <View style={styles.bottomSpacer} />
            </ScrollView>

            {/* Кнопка бронювання */}
            <View style={styles.bookButtonContainer}>
                <TouchableOpacity
                    style={[
                        styles.bookButton,
                        (!fromDate || !toDate || totalHours <= 0 || isLoadingBooking || isLoadingPayment || !authState.userProfile?.id) && styles.bookButtonDisabled
                    ]}
                    onPress={handleBooking}
                    disabled={!fromDate || !toDate || totalHours <= 0 || isLoadingBooking || isLoadingPayment || !authState.userProfile?.id}
                >
                    <Text style={styles.bookButtonText}>
                        {(isLoadingBooking || isLoadingPayment) 
                            ? 'PROCESSING...' 
                            : `BOOK & PAY $${totalPrice.toFixed(2)}`
                        }
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Модальне вікно вибору часу */}
            <Modal
                visible={showTimeModal}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowTimeModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>
                                Select {timeType === 'from' ? 'Start' : 'End'} Time
                            </Text>
                            <TouchableOpacity
                                onPress={() => setShowTimeModal(false)}
                                style={styles.modalCloseButton}
                            >
                                <AntDesign name="close" size={24} color="#666" />
                            </TouchableOpacity>
                        </View>
                        <ScrollView style={styles.timeList}>
                            {hours.map((hour) => (
                                <TouchableOpacity
                                    key={hour}
                                    style={[
                                        styles.timeOption,
                                        (timeType === 'from' ? fromTime : toTime) === hour && styles.timeOptionSelected
                                    ]}
                                    onPress={() => handleTimeSelect(hour)}
                                >
                                    <Text style={[
                                        styles.timeOptionText,
                                        (timeType === 'from' ? fromTime : toTime) === hour && styles.timeOptionTextSelected
                                    ]}>
                                        {hour}:00
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </View>
    );






}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
    },
    loadingText: {
        fontSize: 16,
        color: '#666',
        fontFamily: 'nunito-medium',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: StatusBar.currentHeight + 10,
        paddingBottom: 15,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e1e5e9',
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#f1f3f4',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    backButtonText: {
        color: Colors.PRIMARY,
        fontFamily: 'nunito-semibold',
    },
    headerTitle: {
        fontSize: 20,
        fontFamily: 'nunito-bold',
        color: '#1a1a1a',
    },
    scrollView: {
        flex: 1,
    },
    scrollViewContent: {
        paddingBottom: 100,
    },
    itemContainer: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        margin: 20,
        borderRadius: 12,
        padding: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    itemImageContainer: {
        width: 80,
        height: 80,
        borderRadius: 8,
        overflow: 'hidden',
        marginRight: 15,
    },
    itemImage: {
        width: '100%',
        height: '100%',
    },
    placeholderImage: {
        width: '100%',
        height: '100%',
        backgroundColor: '#f1f3f4',
        justifyContent: 'center',
        alignItems: 'center',
    },
    itemInfo: {
        flex: 1,
        justifyContent: 'space-between',
    },
    itemTitle: {
        fontSize: 16,
        fontFamily: 'nunito-bold',
        color: '#1a1a1a',
        marginBottom: 4,
    },
    itemCategory: {
        fontSize: 14,
        fontFamily: 'nunito-medium',
        color: '#666',
        marginBottom: 8,
    },
    itemPrice: {
        fontSize: 18,
        fontFamily: 'nunito-bold',
        color: Colors.PRIMARY,
    },
    section: {
        marginHorizontal: 20,
        marginBottom: 25,
    },
    sectionTitle: {
        fontSize: 18,
        fontFamily: 'nunito-bold',
        color: '#1a1a1a',
        marginBottom: 15,
    },
    sectionContent: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    dateInfo: {
        marginTop: 15,
        padding: 12,
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
    },
    dateInfoText: {
        fontSize: 14,
        fontFamily: 'nunito-medium',
        color: Colors.PRIMARY,
        textAlign: 'center',
    },
    timeRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    timeButton: {
        flex: 1,
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        padding: 15,
        marginHorizontal: 5,
        alignItems: 'center',
    },
    timeButtonLabel: {
        fontSize: 12,
        fontFamily: 'nunito-medium',
        color: '#666',
        marginBottom: 5,
    },
    timeButtonValue: {
        fontSize: 16,
        fontFamily: 'nunito-bold',
        color: Colors.PRIMARY,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
    },
    summaryLabel: {
        fontSize: 14,
        fontFamily: 'nunito-medium',
        color: '#666',
    },
    summaryValue: {
        fontSize: 14,
        fontFamily: 'nunito-semibold',
        color: '#1a1a1a',
    },
    totalRow: {
        borderTopWidth: 1,
        borderTopColor: '#e1e5e9',
        marginTop: 8,
        paddingTop: 15,
    },
    totalLabel: {
        fontSize: 16,
        fontFamily: 'nunito-bold',
        color: '#1a1a1a',
    },
    totalValue: {
        fontSize: 18,
        fontFamily: 'nunito-bold',
        color: Colors.PRIMARY,
    },
    bottomSpacer: {
        height: 20,
    },
    bookButtonContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderTopWidth: 1,
        borderTopColor: '#e1e5e9',
    },
    bookButton: {
        backgroundColor: Colors.PRIMARY,
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    bookButtonDisabled: {
        backgroundColor: '#ccc',
    },
    bookButtonText: {
        color: '#fff',
        fontSize: 16,
        fontFamily: 'nunito-bold',
        letterSpacing: 0.5,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: '70%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#e1e5e9',
    },
    modalTitle: {
        fontSize: 18,
        fontFamily: 'nunito-bold',
        color: '#1a1a1a',
    },
    modalCloseButton: {
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    timeList: {
        flex: 1,
    },
    timeOption: {
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f3f4',
    },
    timeOptionSelected: {
        backgroundColor: Colors.PRIMARY + '10',
    },
    timeOptionText: {
        fontSize: 16,
        fontFamily: 'nunito-medium',
        color: '#1a1a1a',
    },
    timeOptionTextSelected: {
        color: Colors.PRIMARY,
        fontFamily: 'nunito-bold',
    },


})