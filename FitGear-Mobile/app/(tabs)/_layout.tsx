import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';


export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        
        headerShown: false,
        tabBarActiveTintColor: Colors.PRIMARY,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="home"
        
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <FontAwesome name="home" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="mybookings"
        options={{
          title: 'My Bookings',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="bag-personal" size={24} color={color} />,
        }}
      />
      <Tabs.Screen 
      name='profile'
      options={{
        title: 'Profile',
        tabBarIcon: ({ color }) => <FontAwesome name="user" size={24} color={color} />
      }}/>
    </Tabs>
  );
}
