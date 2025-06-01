import { Feather, FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const router = useRouter();
    const { onRegister } = useAuth();

    const handleRegister = async () => {
      if (password !== confirmPassword) {
        Alert.alert('Error', "Passwords don't march");
        return;
      }

      try {
        await onRegister(email, password);
        Alert.alert('Success', 'Registration was successful');
        router.push('/authentication');
      } catch (error) {
        let errorMessage = 'Something wrong';

        if (error?.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error instanceof Error) {
          errorMessage = error.message;
        } else if(typeof error === 'string'){
          errorMessage = error;
        }
        Alert.alert('Registration error', errorMessage);
      }
    };
  return (
    <ScrollView>
        <Image source={require('./../../assets/images/logo_icon.png')}
        style={styles.logoTop}/>
        <Text style={styles.title}>FitGear</Text>

        <View style={styles.formContainer}>
            <Text style={styles.header}>Register</Text>
            <View style={styles.separator}/>

            <TextInput
            style={styles.input}
            placeholder='email'
            placeholderTextColor='#666'
            value={email}
            onChangeText={setEmail}/>

            <View style={styles.passwordContainer}>
                <TextInput
                style={styles.inputPassword}
                placeholder='password'
                placeholderTextColor='#666'
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <Feather name={showPassword ? 'eye' : 'eye-off'} size={24} color='#444'/>
                </TouchableOpacity>
            </View>
            <View style={styles.passwordContainer}>
                <TextInput
                style={styles.inputPassword}
                placeholder='confirm password'
                placeholderTextColor='#666'
                secureTextEntry={!showConfirmPassword}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                />
                <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                    <Feather name={showPassword ? 'eye' : 'eye-off'} size={24} color='#444'/>
                </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.createButton}
            onPress={handleRegister}>
              <Text style={styles.createButtonText}>Create Account</Text>
            </TouchableOpacity>
            <Text style={styles.loginText}>
              Already signed up?
              <Text style={styles.loginLink}> Log in</Text>
            </Text>
            <Text style={styles.orText}>or</Text>

            <TouchableOpacity style={styles.googleBtn}>
              <Image source={require('./../../assets/images/icons8-google-96.png')}
              style={styles.socialIcon}/>
              <Text style={styles.googleBtnText}>Sign in with Google</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.facebookBtn}>
              <FontAwesome name='facebook' size={24} color="white"/>
              <Text style={styles.facebookBtnText}>Sign in with Facebook</Text>
            </TouchableOpacity>
        </View>

        <Image source={require('./../../assets/images/backimagebike.png')} style={styles.bikeImage}/>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#fff',
        flexGrow: 1,
        alignItems: 'center',
      },
      logoTop: {
        width: 60,
        height: 60,
        resizeMode: 'contain',
        marginTop: 20,
      },
      title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: 'blue',
        marginBottom: 10,
        textAlign: 'center',
      },
      formContainer: {
        backgroundColor: '#f2f0e9',
        padding: 20,
        borderRadius: 12,
        width: '100%',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 4,
        alignItems: 'center',
      },
      header: {
        fontSize: 24,
        fontWeight: '500',
        marginBottom: 10,
      },
      separator: {
        height: 2,
        backgroundColor: '#222',
        width: '90%',
        marginBottom: 20,
      },
      input: {
        backgroundColor: 'white',
        width: '100%',
        borderRadius: 8,
        padding: 14,
        fontSize: 16,
        marginBottom: 16,
      },
      passwordContainer: {
        flexDirection: 'row',
        backgroundColor: 'white',
        borderRadius: 8,
        alignItems: 'center',
        paddingHorizontal: 10,
        marginBottom: 16,
        width: '100%',
      },
      inputPassword: {
        flex: 1,
        paddingVertical: 14,
        fontSize: 16,
      },
      rememberContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        marginBottom: 16,
      },
      rememberText: {
        marginLeft: 8,
        fontSize: 14,
        color: '#333',
      },
      createButton: {
        backgroundColor: 'blue',
        borderRadius: 8,
        paddingVertical: 14,
        paddingHorizontal: 30,
        width: '100%',
        alignItems: 'center',
        marginBottom: 12,
      },
      createButtonText: {
        color: 'white',
        fontSize: 18,
      },
      loginText: {
        fontSize: 14,
        color: '#333',
        marginBottom: 10,
      },
      loginLink: {
        color: 'blue',
        textDecorationLine: 'underline',
      },
      orText: {
        fontSize: 16,
        marginBottom: 10,
        color: '#444',
      },
      socialButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderColor: '#ccc',
        borderWidth: 1,
        width: '100%',
        marginBottom: 10,
      },
      socialLogo: {
        width: 24,
        height: 24,
        marginRight: 10,
        resizeMode: 'contain',
      },
      socialText: {
        fontSize: 16,
        color: '#333',
      },
      bikeImage: {
        width: 140,
        height: 140,
        marginTop: 30,
        resizeMode: 'contain',
        
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