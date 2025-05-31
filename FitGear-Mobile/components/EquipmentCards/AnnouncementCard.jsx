import { AntDesign } from '@expo/vector-icons';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../constants/Colors';

export default function AnnouncementCard({announcement, onPress}) {
    const renderRating = () => {
        const rating = 4.5; // Заглушка для рейтингу
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
                    {rating.toFixed(1)}
                </Text>
            </View>
        );
    };

  return (
    <TouchableOpacity style={{
        backgroundColor: '#fff',
                borderRadius: 15,
                marginBottom: 15,
                //marginHorizontal: 15,
                width: 'auto',
                alignSelf: 'stretch',
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
    onPress={() => onPress && onPress(announcement)}
    activeOpacity={0.7}
    >
        <View style={{
            position:'relative'
        }}>
            {announcement.url ? (
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

                {/* Бейдж з кількістю доступних одиниць */}
                <View style={{
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    borderRadius: 10,
                }}>
                    <Text style={{
                        color: '#fff',
                        fontSize: 10,
                        fontFamily: 'nunito-medium',
                    }}>
                        Available: {announcement.quantityAvailable}
                    </Text>
                </View>
            </View>

            {/* Контент */}
            <View style={{
                padding: 15,
            }}>
                {/* Назва */}
                <Text style={{
                    fontSize: 18,
                    fontFamily: 'nunito-bold',
                    color: '#2C2C2C',
                    marginBottom: 5,
                }} 
                numberOfLines={2}
                >
                    {announcement.title}
                </Text>

                {/* Опис */}
                <Text style={{
                    fontSize: 14,
                    color: '#666',
                    fontFamily: 'nunito-regular',
                    marginBottom: 10,
                }}
                numberOfLines={2}
                >
                    {announcement.description}
                </Text>

                {/* Ціна та рейтинг */}
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}>
                    {/* Ціна */}
                    <View>
                        <Text style={{
                            fontSize: 20,
                            fontFamily: 'nunito-bold',
                            color: Colors.PRIMARY,
                        }}>
                            ${announcement.pricePerDay}
                        </Text>
                        <Text style={{
                            fontSize: 12,
                            color: '#666',
                            fontFamily: 'nunito-regular',
                        }}>
                            per day
                        </Text>
                    </View>

                    {/* Рейтинг */}
                    {renderRating()}
                </View>

        </View>
    </TouchableOpacity>
  )
}