import { useRouter } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function entrancepage() {
    const router = useRouter();
  return (
    <View>
      <View style={{display: 'flex', alignItems: 'center', marginTop: 100}}>
        <Image 
        source={require('./../../assets/images/explorescreen.png')}
        style={styles.container}
        />
      </View>
      <View style={styles.subContainer}>
        <Text style={styles.title}>
            <Text style={{color: '#0000A8'}}> FitGear</Text> - Your{' '}
            <Text style={{color: '#0000A8'}}>Sports Equipment Rental</Text> App
        </Text>
        <Text style={styles.subtitle}>
            Find your favourite equipment nearby and rent it in few taps.
        </Text>
        <Text style={styles.subtitle}>Easy.Fast.No hassle.</Text>
        <TouchableOpacity
        onPress={() => router.push('authentication')} 
        style={styles.btn}>
            <Text style={styles.btnText}>Let's Get Started</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
    container:{
        width: 250,
        height: 400,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: '#0000A8',
    },
    subContainer: {
        backgroundColor: '#FFFFFF',
        padding: 20,
        marginTop: -20,
      },
      title: {
        fontFamily: 'nunito-extrabold',
        fontSize: 32,
        textAlign: 'center',
      },
      subtitle: {
        fontFamily: 'nunito-medium',
        fontSize: 23,
        color: '#61618F',
        textAlign: 'center',
        padding: 15,
      },
      btn: {
        backgroundColor: '#0000A8',
        padding: 17,
        marginTop: 23,
        borderRadius: 99,
      },
      btnText: {
        color: '#FFFAE1',
        textAlign: 'center',
        fontFamily: 'nunito-bold',
        fontSize: 20,
      },
})