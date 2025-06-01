import { AntDesign } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Alert,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { useReview } from '../../app/context/ReviewContext';
import { Colors } from '../../constants/Colors';

const ReviewForm = ({ announcementId, onReviewCreated }) => {
    const { createReview, isCreatingReview } = useReview();
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');

    const handleStarPress = (selectedRating) => {
        setRating(selectedRating);
    };

    const handleSubmitReview = async () => {
        if (rating === 0) {
            Alert.alert('Error', 'Please select a rating');
            return;
        }

        if (comment.trim().length === 0) {
            Alert.alert('Error', 'Please enter a comment');
            return;
        }

        try {
            await createReview(announcementId.toString(), {
                rating,
                comment: comment.trim()
            });

            // Очищаємо форму після успішного створення
            setRating(0);
            setComment('');

            Alert.alert('Success', 'Your review has been submitted!');
            
            // Викликаємо callback для оновлення батьківського компонента
            if (onReviewCreated) {
                onReviewCreated();
            }

        } catch (error) {
            console.error('Error creating review:', error);
            Alert.alert('Error', error.message || 'Failed to submit review');
        }
    };

    const renderStars = () => {
        return (
            <View style={styles.starsContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                    <TouchableOpacity
                        key={star}
                        onPress={() => handleStarPress(star)}
                        style={styles.starButton}
                        activeOpacity={0.7}
                    >
                        <AntDesign
                            name={star <= rating ? "star" : "staro"}
                            size={32}
                            color={star <= rating ? "#FFD700" : "#e0e0e0"}
                        />
                    </TouchableOpacity>
                ))}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Leave a Review</Text>
            
            {/* Рейтинг зірочками */}
            <View style={styles.ratingSection}>
                <Text style={styles.sectionLabel}>Your Rating</Text>
                {renderStars()}
                {rating > 0 && (
                    <Text style={styles.ratingText}>
                        {rating} out of 5 stars
                    </Text>
                )}
            </View>

            {/* Поле для коментаря */}
            <View style={styles.commentSection}>
                <Text style={styles.sectionLabel}>Your Comment</Text>
                <TextInput
                    style={styles.commentInput}
                    multiline
                    numberOfLines={4}
                    placeholder="Share your experience with this item..."
                    value={comment}
                    onChangeText={setComment}
                    maxLength={500}
                    textAlignVertical="top"
                />
                <Text style={styles.characterCount}>
                    {comment.length}/500 characters
                </Text>
            </View>

            {/* Кнопка відправки */}
            <TouchableOpacity
                style={[
                    styles.submitButton,
                    (rating === 0 || comment.trim().length === 0 || isCreatingReview) && 
                    styles.submitButtonDisabled
                ]}
                onPress={handleSubmitReview}
                disabled={rating === 0 || comment.trim().length === 0 || isCreatingReview}
            >
                <Text style={styles.submitButtonText}>
                    {isCreatingReview ? 'Submitting...' : 'Submit Review'}
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#f9f9f9',
        borderRadius: 12,
        padding: 20,
        marginBottom: 25,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.PRIMARY,
        marginBottom: 20,
        fontFamily: 'nunito-semibold',
        textAlign: 'center',
    },
    ratingSection: {
        marginBottom: 20,
        alignItems: 'center',
    },
    sectionLabel: {
        fontSize: 16,
        color: '#333',
        fontFamily: 'nunito-medium',
        marginBottom: 10,
    },
    starsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 10,
    },
    starButton: {
        padding: 5,
        marginHorizontal: 2,
    },
    ratingText: {
        fontSize: 14,
        color: '#666',
        fontFamily: 'nunito-medium',
    },
    commentSection: {
        marginBottom: 20,
    },
    commentInput: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 15,
        fontSize: 16,
        fontFamily: 'nunito-regular',
        borderWidth: 1,
        borderColor: '#e0e0e0',
        minHeight: 100,
    },
    characterCount: {
        fontSize: 12,
        color: '#999',
        textAlign: 'right',
        marginTop: 5,
        fontFamily: 'nunito-regular',
    },
    submitButton: {
        backgroundColor: Colors.PRIMARY,
        borderRadius: 8,
        paddingVertical: 15,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 3,
    },
    submitButtonDisabled: {
        backgroundColor: '#ccc',
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        fontFamily: 'nunito-semibold',
    },
});

export default ReviewForm;
