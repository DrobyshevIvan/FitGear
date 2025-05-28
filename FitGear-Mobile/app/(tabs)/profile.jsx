import React from 'react';
import { Text, View } from 'react-native';
import UserIntro from '../../components/Profile/UserIntro';
import { useAuth } from '../context/AuthContext';

export default function profile() {
  const { authState } = useAuth();

  if (!authState.authenticated) {
    return (
      <View style={{
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1
      }}>
        <Text style={{
          fontFamily: 'nunito-medium',
          fontSize: 18,
          textAlign: 'center'
        }}>Please login to account</Text>
      </View>
    );
  }

  return (
    <View style={{
      padding: 20,
      
    }}>
      <Text style={{
        fontFamily: 'nunito-bold',
        fontSize: 35
      }}>profile</Text>
      
      {/* User Info */}
      <UserIntro />

    </View>
  )
}