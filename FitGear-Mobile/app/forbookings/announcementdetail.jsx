import { AntDesign } from '@expo/vector-icons/AntDesign';
import React, { useEffect, useState } from 'react';
import { Dimensions, Image, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../constants/Colors';

const { width } = Dimensions.get('window');

export default function announcementdetail({ route, navigation }) {
    const [announcement, setAnnouncement] = useState(null);

    useEffect(() => {
        if (route?.params?.announcement) {
            setAnnouncement(route.params.announcement);
            console.log('Announcement data:', route.params.announcement);
        }
    }, [route?.params?.announcement]);

    const handleBookPress = () => {
        if (announcement) {
            console.log('Booking announcement with ID:', announcement.id)
        }
    };

    const calculateWeekPrice = (pricePerDay) => {
        return (pricePerDay * 7).toFixed(2);
    };

    if (!announcement) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Loading...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle='light-content' backgroundColor='transparent' translucent />
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}>
                    <AntDesign name="arrowleft" size={24} color="#000" />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                <View style={styles.imageContainer}>
                    {announcement.url ? (
                        <Image
                            source={{ uri: announcement.url }}
                            style={styles.image}
                            resizeMode='cover' />
                    ) : (
                        <View>
                            <AntDesign name='picture' size={60} color="#ccc" />
                            <Text style={styles.placeholderText}>No image available</Text>
                        </View>
                    )}
                </View>

                <View style={styles.categoryContainer}>
                    <Text style={styles.categoryLabel}>Category:</Text>
                    <Text style={styles.categoryValue}>{announcement.categoryName}</Text>
                </View>

                <View style={styles.ratingContainer}>
                    <View style={styles.starsContainer}>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <AntDesign
                                key={star}
                                name="star"
                                size={16}
                                color={star <= 4 ? "#FFD700" : "e0e0e0"} />
                        ))}
                    </View>
                    <Text style={styles.ratingText}>4.0 (12 reviews)</Text>
                </View>
                <View style={styles.availabilityContainer}>
                    <Text style={styles.availabilityLabel}>Available quantity:</Text>
                    <Text style={styles.availabilityValue}>{announcement.quantityAvailable} pcs</Text>
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
                            <Text style={styles.priceLabel}>For 1 day</Text>
                            <Text style={styles.priceValue}>${announcement.pricePerDay}</Text>
                        </View>
                        <View style={styles.priceRow}>
                            <Text style={styles.priceLabel}>For 7 days</Text>
                            <Text style={styles.priceValue}>
                                ${calculateWeekPrice(announcement.pricePerDay)}
                            </Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
            <View style={styles.bookButtonContainer}>
                <TouchableOpacity 
                    style={styles.bookButton}
                    onPress={handleBookPress}
                    disabled={announcement.quantityAvailable === 0}
                >
                    <Text style={styles.bookButtonText}>
                        {announcement.quantityAvailable === 0 ? 'OUT OF STOCK' : 'BOOK'}
                    </Text>
                </TouchableOpacity>
            </View>

        </View>
    )
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
    },
    loadingText: {
        fontSize: 16,
        color: '#666',
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
        color: announcement => announcement?.quantityAvailable > 0 ? '#4CAF50' : '#f44336',
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
    bookButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: 'nunito-bold',
        letterSpacing: 1,
    },

})