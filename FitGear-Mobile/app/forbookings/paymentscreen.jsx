import { MaterialIcons } from '@expo/vector-icons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { Colors } from '../../constants/Colors';
import { useAuth } from '../context/AuthContext';
import { useBooking } from '../context/BookingContext';

const {width} = Dimensions.get('window');
export default function paymentscreen() {
    const [paymentData, setPaymentData] = useState(null);
    const [loading, setLoading] = useState(true);


    const params = useLocalSearchParams();
    const { authState } = useAuth();
    const { processPayment, isProcessingPayment } = useBooking();


    useEffect(() => {
        // Отримуємо дані з параметрів
        const data = {
            bookingId: params.bookingId || '',
            paymentId: params.paymentId || '',
            totalPrice: parseFloat(params.totalPrice) || 0,
            totalHours: parseInt(params.totalHours) || 0,
            announcementTitle: params.announcementTitle || '',
            paymentUrl: params.paymentUrl || null,
            // Додаткові дані які можуть прийти з booking screen
            fromDate: params.fromDate || '',
            toDate: params.toDate || '',
            fromTime: params.fromTime || '',
            toTime: params.toTime || '',
            pricePerHour: parseFloat(params.pricePerHour) || 0,
        };

        setPaymentData(data);
        setLoading(false);
    }, [
        params.bookingId,
        params.paymentId,
        params.totalPrice,
        params.totalHours,
        params.announcementTitle,
        params.paymentUrl,
        params.fromDate,
        params.toDate,
        params.fromTime,
        params.toTime,
        params.pricePerHour
    ]);



    const handlePayment = useCallback(async () => {
        if (!paymentData || !paymentData.paymentId) {
            Alert.alert('Error', 'Payment information is missing');
            return;
        }


        try {
            await processPayment(parseInt(paymentData.paymentId));
            
            Alert.alert(
                'Payment Successful!',
                'Your payment has been processed successfully. You will be redirected to the home screen.',
                [
                    {
                        text: 'OK',
                        onPress: () => {
                            // Перенаправляємо на головну сторінку
                            router.replace('/home');
                        }
                    }
                ]
            );
        } catch (error) {
            console.error('Payment processing error:', error);
            Alert.alert(
                'Payment Failed',
                error.message || 'An error occurred while processing your payment. Please try again.'
            );
        }
    }, [paymentData, processPayment]);


    const handleGoBack = useCallback(() => {
        router.back();
    }, []);


    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };


    const formatDateTime = (dateString, timeString) => {
        if (!dateString || !timeString) return '';
        return `${formatDate(dateString)} at ${timeString}:00`;
    };


    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Colors.PRIMARY} />
                <Text style={styles.loadingText}>Loading payment details...</Text>
            </View>
        );
    }


    if (!paymentData) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>No payment data available</Text>
                <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
                    <Text style={styles.backButtonText}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }


    return (
        <View style={styles.container}>
            <StatusBar barStyle='light-content' backgroundColor='transparent' translucent />
            
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.headerBackButton} onPress={handleGoBack}>
                    <AntDesign name="arrowleft" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Payment</Text>
                <View style={styles.headerSpacer} />
            </View>


            <ScrollView 
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Payment Success Icon */}
                <View style={styles.iconContainer}>
                    <View style={styles.iconCircle}>
                        <MaterialIcons name="payment" size={40} color={Colors.PRIMARY} />
                    </View>
                </View>


                {/* Receipt Container */}
                <View style={styles.receiptContainer}>
                    {/* Company Header */}
                    <View style={styles.companyHeader}>
                        <Text style={styles.companyName}>FitGear</Text>
                        <Text style={styles.companySubtitle}>Sports Equipment Rental</Text>
                    </View>


                    {/* Divider */}
                    <View style={styles.divider} />


                    {/* Customer Information */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Customer Information</Text>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Name:</Text>
                            <Text style={styles.infoValue}>
                                {authState.userProfile?.firstName || ''} {authState.userProfile?.lastName || ''}
                            </Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Email:</Text>
                            <Text style={styles.infoValue}>{authState.userProfile?.email || ''}</Text>
                        </View>
                    </View>


                    {/* Rental Information */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Rental Details</Text>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Item:</Text>
                            <Text style={styles.infoValue}>{paymentData.announcementTitle}</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Rate:</Text>
                            <Text style={styles.infoValue}>${paymentData.pricePerHour || (paymentData.totalPrice / paymentData.totalHours).toFixed(2)}/hour</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Duration:</Text>
                            <Text style={styles.infoValue}>{paymentData.totalHours} hours</Text>
                        </View>
                    </View>


                    {/* Booking Period */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Rental Period</Text>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>From:</Text>
                            <Text style={styles.infoValue}>
                                {formatDateTime(paymentData.fromDate, paymentData.fromTime)}
                            </Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>To:</Text>
                            <Text style={styles.infoValue}>
                                {formatDateTime(paymentData.toDate, paymentData.toTime)}
                            </Text>
                        </View>
                    </View>


                    {/* Payment Summary */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Payment Summary</Text>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Booking ID:</Text>
                            <Text style={styles.infoValue}>#{paymentData.bookingId}</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Payment ID:</Text>
                            <Text style={styles.infoValue}>#{paymentData.paymentId}</Text>
                        </View>
                    </View>


                    {/* Total */}
                    <View style={styles.divider} />
                    <View style={styles.totalSection}>
                        <View style={styles.totalRow}>
                            <Text style={styles.totalLabel}>Total Amount</Text>
                            <Text style={styles.totalValue}>${paymentData.totalPrice.toFixed(2)}</Text>
                        </View>
                    </View>


                    {/* Footer */}
                    <View style={styles.receiptFooter}>
                        <Text style={styles.footerText}>Thank you for choosing FitGear!</Text>
                        <Text style={styles.footerSubtext}>Receipt generated on {new Date().toLocaleDateString()}</Text>
                    </View>
                </View>


                {/* Additional Space */}
                <View style={styles.bottomSpacer} />
            </ScrollView>


            {/* Pay Button */}
            <View style={styles.payButtonContainer}>
                <TouchableOpacity
                    style={[
                        styles.payButton,
                        isProcessingPayment && styles.payButtonDisabled
                    ]}
                    onPress={handlePayment}
                    disabled={isProcessingPayment}
                >
                    {isProcessingPayment ? (
                        <View style={styles.loadingRow}>
                            <ActivityIndicator size="small" color="#fff" />
                            <Text style={styles.payButtonText}>PROCESSING...</Text>
                        </View>
                    ) : (
                        <View style={styles.payButtonContent}>
                            <MaterialIcons name="payment" size={24} color="#fff" />
                            <Text style={styles.payButtonText}>PAY ${paymentData.totalPrice.toFixed(2)}</Text>
                        </View>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f7fa',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f7fa',
        padding: 20,
    },
    loadingText: {
        fontSize: 16,
        color: '#666',
        fontFamily: 'nunito-medium',
        textAlign: 'center',
        marginTop: 10,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: StatusBar.currentHeight + 10 || 50,
        paddingHorizontal: 20,
        paddingBottom: 15,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    headerBackButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#f5f5f5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.PRIMARY,
        fontFamily: 'nunito-bold',
    },
    headerSpacer: {
        width: 40,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingVertical: 20,
        paddingHorizontal: 20,
        paddingBottom: 100,
    },
    iconContainer: {
        alignItems: 'center',
        marginBottom: 30,
    },
    iconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: Colors.PRIMARY + '15',
        justifyContent: 'center',
        alignItems: 'center',
    },
    receiptContainer: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 8,
    },
    companyHeader: {
        alignItems: 'center',
        marginBottom: 20,
    },
    companyName: {
        fontSize: 28,
        fontWeight: 'bold',
        color: Colors.PRIMARY,
        fontFamily: 'nunito-bold',
        letterSpacing: 1,
    },
    companySubtitle: {
        fontSize: 14,
        color: '#666',
        fontFamily: 'nunito-medium',
        marginTop: 4,
    },
    divider: {
        height: 1,
        backgroundColor: '#e0e0e0',
        marginVertical: 20,
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.PRIMARY,
        fontFamily: 'nunito-semibold',
        marginBottom: 12,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    infoLabel: {
        fontSize: 14,
        color: '#666',
        fontFamily: 'nunito-medium',
        flex: 1,
    },
    infoValue: {
        fontSize: 14,
        color: '#333',
        fontFamily: 'nunito-semibold',
        flex: 2,
        textAlign: 'right',
    },
    totalSection: {
        paddingTop: 16,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    totalLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.PRIMARY,
        fontFamily: 'nunito-bold',
    },
    totalValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.PRIMARY,
        fontFamily: 'nunito-bold',
    },
    receiptFooter: {
        alignItems: 'center',
        marginTop: 24,
        paddingTop: 20,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
    },
    footerText: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.PRIMARY,
        fontFamily: 'nunito-semibold',
        marginBottom: 4,
    },
    footerSubtext: {
        fontSize: 12,
        color: '#999',
        fontFamily: 'nunito-regular',
    },
    bottomSpacer: {
        height: 20,
    },
    payButtonContainer: {
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
    payButton: {
        backgroundColor: Colors.PRIMARY,
        borderRadius: 16,
        paddingVertical: 18,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 6,
    },
    payButtonDisabled: {
        backgroundColor: '#ccc',
    },
    payButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    payButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: 'nunito-bold',
        letterSpacing: 1,
        marginLeft: 8,
    },
    loadingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    backButton: {
        backgroundColor: Colors.PRIMARY,
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 8,
        marginTop: 20,
    },
    backButtonText: {
        color: '#fff',
        fontSize: 16,
        fontFamily: 'nunito-medium',
    },

})