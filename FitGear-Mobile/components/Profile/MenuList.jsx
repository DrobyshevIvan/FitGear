import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

export default function MenuList() {
    const router = useRouter();
    const [modalVisible, setModalVisible] = useState(false);

    const menuItems = [
        {label: 'User profile'},
        {label: 'Promocodes'},
        {label: 'Rating'},
        {label: 'My booking History'},
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
            ></TouchableOpacity>
        ))}
      <Text>MenuList</Text>
    </View>
  )
}