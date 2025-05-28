import AntDesign from '@expo/vector-icons/AntDesign';
import React, { useState } from 'react';
import { Modal, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../constants/Colors';

export default function explore() {
    const [modalVisible, setModalVisible] = useState(false);

    const handleFilterSelect = (filter) => {
        console.log('Choosen filter:', filter);
        setModalVisible(false);
    };

    return (
        <View style={{
            padding: 20,
            paddingTop: 35,
            backgroundColor: Colors.PRIMARY,
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20,
        }}
        >
            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: '#fff',
                paddingHorizontal: 10,
                marginVertical: 10,
                marginTop: 15,
                borderRadius: 15,
            }}
            >
                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                    <AntDesign name='search1' size={24} color={Colors.PRIMARY} />
                    <TextInput
                        placeholder="Search.."
                        style={{
                            fontFamily: 'outfit-medium',
                            fontSize: 18,
                            marginLeft: 10,
                            flex: 1,
                        }} />
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
    )
}