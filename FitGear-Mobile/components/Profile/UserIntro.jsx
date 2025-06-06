import React, { useEffect } from 'react';
import { ActivityIndicator, Image, Text, View } from 'react-native';
import { useAuth } from './../../app/context/AuthContext';

export default function UserIntro() {
    const {authState, getUserProfile, isLoadingProfile} = useAuth();

    useEffect(() => {
        if (authState.authenticated && !authState.userProfile && !isLoadingProfile){
            getUserProfile().catch(error => {
                console.error('Failed to load user profile:', error);
            });
        }
    }, [authState.authenticated, authState.userProfile, isLoadingProfile]);

    if (isLoadingProfile) {
        return (
            <View style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 30
            }}>
                <ActivityIndicator size="large" color='#0000ff'/>
                <Text style={{
                    fontFamily: 'nunito-medium',
                    fontSize: 16,
                    marginTop: 10
                }}>Loading profile</Text>
            </View>
        );
    }

    const userProfile = authState.userProfile;
    const firstName = userProfile?.firstName || 'Name';
    const lastName = userProfile?.lastName || 'Surname';
    const email = userProfile?.email || 'user@email.com';

  return (
    <View style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 30
    }}>
        <Text style={{
            fontFamily: 'nunito-bold',
            fontSize: 20,
            marginBottom: 20
        }}>Rating:0</Text>
          <Image source={require('./../../assets/images/profileimage.png')} style={{
            width: 100,
            height: 100,
            borderRadius: 99
          }}/>
          <Text style={{
            fontFamily: 'nunito-extrabold',
            fontSize: 20,
            marginTop: 20
          }}>{lastName} {firstName}</Text>
          <Text style={{
            fontFamily: 'nunito-medium',
            fontSize: 16
          }}>{email}</Text>
          
    </View>
  )
}