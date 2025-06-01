import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';

export default function MenuList() {
    const router = useRouter();
    const [modalVisible, setModalVisible] = useState(false);

    const menuItems = [
        {label: 'User profile', route: '/usermenu/editprofilescreen'},
        {label: 'Promocodes'},
        {label: 'Rating'},
        {label: 'My booking History', route: '/usermenu/bookinghistoryscreen'},
    ];

  return (
    <View style={{ paddingHorizontal: 20, marginTop: 50}}>
        {menuItems.map((item, index) => (
            <TouchableOpacity
            key={index}
            style={{
                backgroundColor: '#FFF8DC',
                padding: 15,
                marginBottom: 10,
                borderRadius: 5,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}
            onPress={() => {
                if (item.route) {
                    router.push(item.route);
                } else {
                    console.log(`Pressed: ${item.label}`);
                }
            }}>
                <Text style={{fontSize: 16}}>{item.label}</Text>
                <Text style={{fontSize: 20}}>{'>'}</Text>
            </TouchableOpacity>
        ))}
        <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={{marginTop: 30}}>
            <Text style={{
                color: 'red',
                textAlign: 'center',
                fontSize: 18,
                fontFamily: 'nunito-bold',
                textDecorationLine: 'underline',
                marginTop: 40
            }}>
                Delete account
            </Text>
        </TouchableOpacity>
        <Modal
        transparent
        visible={modalVisible}
        animationType='slide'
        onRequestClose={() => setModalVisible(false)}>
            <View style={{
                flex: 1,
                justifyContent: 'center',
                backgroundColor: 'rgba(0,0,0,0.5)',
                padding: 20
            }}>
                <View style={{
                    backgroundColor: 'white',
                    borderRadius: 10,
                    padding: 20,
                }}>
                    <Text style={{
                        fontFamily: 'nunito-bold',
                        fontSize: 18,
                        marginBottom: 10
                    }}>
                        Are you sure you want to delete your account?
                    </Text>
                    <Text style={{
                        marginBottom: 20
                    }}>This action is irrevisible and all your data will be lost.</Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between'}}>
                        <TouchableOpacity
                        onPress={() => {
                            setModalVisible(false),
                            router.push('/(auth)/entrancepage')
                        }}
                        style={{
                            backgroundColor: 'red',
                            padding: 10,
                            borderRadius: 5,
                            flex: 1,
                            marginRight: 10
                        }}>
                            <Text style={{color: 'white', textAlign: 'center'}}>Delete</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                        onPress={() => 
                            setModalVisible(false)
                            
                        }
                        style={{
                            backgroundColor: 'gray',
                            padding: 10,
                            borderRadius: 5,
                            flex: 1
                        }}>
                            <Text style={{ color: 'white', textAlign: 'center'}}> Cancel </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    </View>
  )
}