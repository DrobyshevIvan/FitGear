import AntDesign from '@expo/vector-icons/AntDesign';
import { useRouter } from 'expo-router';
import React from 'react';
import { TextInput, View } from 'react-native';
import { Colors } from "../../constants/Colors";

export default function Header() {
    const router = useRouter();
    const handleFocus = () => {
        router.push('/(tabs)/explore');
    }

  return (
    <View style={{
        padding: 20,
        paddingTop:35,
        backgroundColor:Colors.PRIMARY,
        borderBottomLeftRadius:20,
        borderBottomRightRadius:20
    }}>
        <View style={{
            display: 'flex',
            flexDirection: 'row',
            gap: 10,
            alignItems: 'center',
            backgroundColor: '#fff',
            padding: 10,
            marginVertical: 10,
            marginTop: 15,
            borderRadius: 15
        }}>
            <AntDesign name='search1' size={24} color={Colors.PRIMARY}/>
            <TextInput placeholder='Search...' onFocus={handleFocus} style={{
                fontFamily: 'nunito-medium',
                fontSize: 18
            }}/>
        </View>
    </View>
  )
}