import { Feather } from '@expo/vector-icons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function authentication() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>FitGear</Text>
      <View style={styles.card}>
        <Text style={styles.heading}>Log in</Text>
        <View style={styles.underline}/>

        <TextInput 
        placeholder='email'
        style={styles.input}
        value={email}
        onChangeText={setEmail}/>

        <View style={styles.passwordRow}>
            <TextInput
            placeholder='password'
            secureTextEntry={!passwordVisible}
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            />
            <TouchableOpacity
            onPress={() => setPasswordVisible(!passwordVisible)}
            style={styles.eyeIcon}>
                <Feather
                name={passwordVisible ? 'eye' : 'eye-off'}
                size={20}
                color='gray'/>
            </TouchableOpacity>
        </View>
        <View style={styles.rememberRow}>
            <Text style={styles.rememberText}>Remember me</Text>
            <TouchableOpacity stylr={styles.forgotPassword}>
                <Text style={styles.forgotText}>Forgot password?</Text>
            </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.loginBtn}
        onPress={() => router.push('/home')}>
            <Text style={styles.loginBtnText}>Log in</Text>
        </TouchableOpacity>

        <Text style={styles.signupText}>
            New here?
        </Text>
        <TouchableOpacity>
            <Text style={[styles.signupText, styles.link]}>Sign up</Text>
        </TouchableOpacity>
        <Text style={styles.orText}>or</Text>

        <TouchableOpacity style={styles.googleBtn}>
            <Image source={require('./../../assets/images/icons8-google-96.png')}
            style={styles.socialIcon}/>
            <Text style={styles.googleBtnText}>Sign in with Google</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.facebookBtn}>
            <FontAwesome name='facebook' size={24} color='white'/>
            <Text style={styles.facebookBtnText}>Sign in with Facebook</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: 40,
        
      },
      logo: {
        width: 60,
        height: 60,
        resizeMode: 'contain',
      },
      title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: 'blue',
        marginBottom: 10,
        marginTop: 80
      },
      card: {
        backgroundColor: '#f1efe4',
        width: '90%',
        padding: 20,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5
      },
      heading: {
        fontSize: 26,
        textAlign: 'center',
        marginBottom: 8,
      },
      underline: {
        height: 1,
        backgroundColor: 'black',
        marginBottom: 20,
      },
      input: {
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 8,
        marginBottom: 20,
        fontSize: 16,
      },
      passwordRow: {
        position: 'relative',
        justifyContent: 'center',
      },
      eyeIcon: {
        position: 'absolute',
        right: 12,
        top: 16,
      },
      rememberRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        justifyContent: 'space-between',
      },
      rememberText: {
        fontSize: 14,
        marginLeft: 4,
      },
      forgotPassword: {
        marginLeft: 'auto',
      },
      forgotText: {
        fontSize: 14,
        color: 'black',
      },
      loginBtn: {
        backgroundColor: 'blue',
        padding: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 16,
      },
      loginBtnText: {
        color: '#fff',
        fontSize: 18,
      },
      signupText: {
        textAlign: 'center',
        marginBottom: 12,
        fontSize: 16,
      },
      link: {
        color: 'blue',
        textDecorationLine: 'underline',
        fontSize: 20
      },
      orText: {
        textAlign: 'center',
        marginBottom: 12,
        fontSize: 16,
      },
      googleBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: 'black',
        borderWidth: 1,
        padding: 12,
        borderRadius: 25,
        justifyContent: 'center',
        marginBottom: 12,
      },
      googleBtnText: {
        marginLeft: 8,
        fontSize: 16,
      },
      facebookBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1877F2',
        padding: 12,
        borderRadius: 25,
        justifyContent: 'center',
      },
      facebookBtnText: {
        color: 'white',
        marginLeft: 8,
        fontSize: 16,
      },
      socialIcon: {
        width: 24,
        height: 24,
        marginRight: 12,
      },
})