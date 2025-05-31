import AntDesign from '@expo/vector-icons/AntDesign';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Modal, Text, TextInput, TouchableOpacity, View } from 'react-native';
import AnnouncementCard from '../../components/EquipmentCards/AnnouncementCard';
import Category from '../../components/Home/Category';
import { Colors } from '../../constants/Colors';
import { useProduct } from '../context/ProductContext';

export default function explore({route, navigation}) {
    const [modalVisible, setModalVisible] = useState(false);
    const {selectedCategory, setSelectedCategory, filteredAnnouncements, isLoadingAnnouncements, searchQuery, setSearchQuery, getAnnouncements} = useProduct();


    useEffect(() => {
        if(route?.params?.selectedCategory){
            setSelectedCategory(route.params.selectedCategory);
            console.log('Set category from navigation:', route.params.selectedCategory);
        }
    }, [route?.params?.selectedCategory]);


    const handleFilterSelect = (filter) => {
        console.log('Choosen filter:', filter);
       
        let orderBy = '';
        let sortDirection = 'Ascending';


        switch(filter) {
            case 'Price: low to high':
                orderBy = 'pricePerDay';
                sortDirection = 'Ascending';
                break;
            case 'Price: high to low':
                orderBy = 'pricePerDay';
                sortDirection = 'Descending';
                break;
            case 'New equipment':
                orderBy = 'createdAt';
                sortDirection = 'Descending';
                break;
                default:
                break;
        }


        if(orderBy){
            getAnnouncements({
                category: selectedCategory || undefined,
                title: searchQuery || undefined,
                orderBy,
                sortDirection
            });
        }
        setModalVisible(false);
    };


    const handleCategoryPressed = (categoryName) => {
        console.log('Chosen category in explore: ', categoryName);


        if (selectedCategory === categoryName) {
            setSelectedCategory(null);
        } else {
            setSelectedCategory(categoryName);
        }
    };


    const handleSearchChange = (text) => {
        setSearchQuery(text);
    };

    const handleAnnouncementPress = (announcement) => {
        console.log('Pressed announcement:', announcement);
        
        try {
            router.push({
                pathname: 'forbookings/announcementdetail',
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
            
        } catch (error) {
            console.error('Navigation error:', error);
            if (navigation) {
                navigation.navigate('announcementdetail', { 
                    announcement: announcement 
                });
            }
        }
    };


    const renderAnnouncementItem = ({ item }) => (
        <AnnouncementCard
            announcement={item}
            onPress={handleAnnouncementPress}
        />
    );


    const renderEmptyComponent = () => {
        if (isLoadingAnnouncements) {
            return (
                <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingVertical: 50,
                }}>
                    <ActivityIndicator size="large" color={Colors.PRIMARY} />
                    <Text style={{
                        marginTop: 10,
                        fontSize: 16,
                        color: '#666',
                        fontFamily: 'nunito-medium',
                    }}>
                        Loading announcements...
                    </Text>
                </View>
            );
        }
        return (
            <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                paddingVertical: 50,
            }}>
                <AntDesign name="inbox" size={60} color="#ccc" />
                <Text style={{
                    marginTop: 20,
                    fontSize: 18,
                    color: '#666',
                    fontFamily: 'nunito-medium',
                    textAlign: 'center',
                }}>
                    {searchQuery || selectedCategory ?
                        'No items found matching your search' :
                        'No announcements available'
                    }
                </Text>
                {(searchQuery || selectedCategory) && (
                    <TouchableOpacity
                        style={{
                            marginTop: 15,
                            paddingHorizontal: 20,
                            paddingVertical: 10,
                            backgroundColor: Colors.PRIMARY,
                            borderRadius: 20,
                        }}
                        onPress={() => {
                            setSearchQuery('');
                            setSelectedCategory(null);
                        }}
                    >
                        <Text style={{
                            color: '#fff',
                            fontFamily: 'nunito-medium',
                        }}>
                            Clear filters
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
        );
    };


    return (
        <View style={{flex : 1}}>
            <View style={{
                padding: 20,
                paddingTop: 35,
                backgroundColor: Colors.PRIMARY,
                borderBottomLeftRadius: 20,
                borderBottomRightRadius: 20,
            }}>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: '#fff',
                    paddingHorizontal: 10,
                    marginVertical: 10,
                    marginTop: 15,
                    borderRadius: 15,
                }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                        <AntDesign name='search1' size={24} color={Colors.PRIMARY} />
                        <TextInput
                            placeholder="Search.."
                            value={searchQuery}
                            onChangeText={handleSearchChange}
                            style={{
                                fontFamily: 'outfit-medium',
                                fontSize: 18,
                                marginLeft: 10,
                                flex: 1,
                                paddingVertical: 10
                            }} />
                            {searchQuery.length > 0 && (
                                <TouchableOpacity
                                onPress={() => setSearchQuery('')}
                                style={{padding: 5}}
                                >
                                    <AntDesign name='close' size={20} color="#666"/>
                                </TouchableOpacity>
                            )}
                    </View>
                    <TouchableOpacity onPress={() => setModalVisible(true)}>
                        <AntDesign name='filter' size={24} color="black" />
                    </TouchableOpacity>
                </View>


                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <TouchableOpacity
                        style={{
                            flex: 1,
                            backgroundColor: 'rgba(0, 0, 0, 0.3)',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                        activeOpacity={1}
                        onPressOut={() => setModalVisible(false)}>
                        <View
                            style={{
                                backgroundColor: '#fff',
                                width: '80%',
                                padding: 20,
                                borderRadius: 10,
                                elevation: 10,
                            }}>
                            <Text
                                style={{
                                    fontSize: 20,
                                    fontWeight: 'bold',
                                    color: 'blue',
                                    textAlign: 'center',
                                    marginBottom: 10,
                                }}>Filters</Text>
                            <View style={{
                                height: 1,
                                backgroundColor: 'black',
                                marginBottom: 10,
                            }}/>


                            <TouchableOpacity style={{paddingVertical: 10}}
                            onPress={() => handleFilterSelect('Price: low to high')}>
                                <Text style={{fontSize: 16}}>Price: low to high</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{paddingVertical: 10}}
                            onPress={() => handleFilterSelect('Price: high to low')}>
                                <Text style={{fontSize: 16}}>Price: high to low</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{paddingVertical: 10}}
                            onPress={() => handleFilterSelect('New equipment')}>
                                <Text style={{fontSize: 16}}>New equipment</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                </Modal>
            </View>


            <Category
            onCategoryPress={handleCategoryPressed}
            showSelected={true}
            style={{
                backgroundColor: '#f9f9f9',
                borderBottomWidth: 1,
                borderBottomColor: '#e0e0e0'
            }}/>


            <View style={{ flex: 1 }}>
                {(selectedCategory || searchQuery) && (
                    <View style={{
                        padding: 15,
                        backgroundColor: '#f0f8ff',
                        borderBottomWidth: 1,
                        borderBottomColor: '#e0e0e0',
                    }}>
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                        }}>
                            <Text style={{
                                fontSize: 14,
                                color: Colors.PRIMARY,
                                fontFamily: 'nunito-medium',
                            }}>
                                {selectedCategory && `Category: ${selectedCategory}`}
                                {selectedCategory && searchQuery && ' • '}
                                {searchQuery && `Search: "${searchQuery}"`}
                            </Text>
                            <Text style={{
                                fontSize: 12,
                                color: '#666',
                                fontFamily: 'nunito-regular',
                            }}>
                                {filteredAnnouncements.length} item{filteredAnnouncements.length !== 1 ? 's' : ''}
                            </Text>
                        </View>
                    </View>
                )}


                <FlatList
                    data={filteredAnnouncements}
                    renderItem={renderAnnouncementItem}
                    keyExtractor={(item) => `announcement-${item.id}`}
                    contentContainerStyle={{
                        padding: 15,
                        flexGrow: 1,
                    }}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={renderEmptyComponent}
                    ItemSeparatorComponent={() => <View style={{ height: 15 }} />}
                />
            </View>
        </View>
    )

}