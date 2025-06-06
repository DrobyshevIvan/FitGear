import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function editprofilescreen() {
    const router = useRouter();
    const { getUserProfile, updateUserProfile, isLoadingProfile, authState } = useAuth();

    const [surname, setSurname] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [userName, setUserName] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isFirstTimeUser, setIsFirstTimeUser] = useState(false);

    useEffect(() => {
        loadUserProfile();
    }, []);

    const loadUserProfile = async () => {
        try {
            setIsLoading(true);

            if (authState.userProfile) {
                fillFormWithProfileData(authState.userProfile);
                checkIfFirstTimeUser(authState.userProfile);
                setIsLoading(false);
                return;
            }

            const profile = await getUserProfile();
            fillFormWithProfileData(profile);
            checkIfFirstTimeUser(profile);
        } catch (error) {
            console.error('Error loading profile:', error);
            Alert.alert('Error', 'Failed to load this profile');
        } finally {
            setIsLoading(false);
        }
    };

    const checkIfFirstTimeUser = (profile) => {
        // Перевіряємо чи це перший раз користувача (немає номера телефону)
        const hasNoPhone = !profile.phoneNumber || profile.phoneNumber.trim() === '';
        setIsFirstTimeUser(hasNoPhone);
    };

    const fillFormWithProfileData = (profile) => {
        setName(profile.firstName || '');
        setSurname(profile.lastName || '');
        setEmail(profile.email || '');
        setPhone(profile.phoneNumber || '');
        setUserName(profile.userName || profile.email || '');
    };

    const validateForm = () => {
        if (!phone || phone.trim() === '') {
            Alert.alert('Required Field', 'Phone number is required');
            return false;
        }
        
        

        if (!name || name.trim() === '') {
            Alert.alert('Required Field', 'Name is required');
            return false;
        }

        if (!surname || surname.trim() === '') {
            Alert.alert('Required Field', 'Surname is required');
            return false;
        }

        return true;
    };

    const handleSave = async () => {
        if (!validateForm()) {
            return;
        }

        try {
            setIsSaving(true);

            const updateData = {
                firstName: name.trim(),
                lastName: surname.trim(),
                phoneNumber: phone.trim(),
                userName: userName.trim() || email
            };
            await updateUserProfile(updateData);

            if (isFirstTimeUser) {
                Alert.alert('Welcome!', 'Profile completed successfully', [
                    {
                        text: 'Continue',
                        onPress: () => router.replace('/home')
                    }
                ]);
            } else {
                Alert.alert('Successfully', 'Data was saved', [
                    {
                        text: 'OK',
                        onPress: () => router.back()
                    }
                ]);
            }
        } catch (error) {
            console.error('Error saving profile:', error);
            Alert.alert('Error', 'Data was not saved. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        if (isFirstTimeUser) {
            Alert.alert(
                'Profile Incomplete',
                'You need to complete your profile to continue using the app.',
                [
                    { text: 'Continue Editing', style: 'default' },
                    { 
                        text: 'Logout', 
                        style: 'destructive',
                        onPress: () => {
                            router.replace('/authentication');
                        }
                    }
                ]
            );
        } else {
            router.back();
        }
    };

    if (isLoading || isLoadingProfile) {
        return (
            <View style={[styles.container, styles.centered]}>
                <ActivityIndicator size='large' color="#4285F4"/>
                <Text style={styles.loadingText}>Loading profile...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {!isFirstTimeUser && (
                <TouchableOpacity style={styles.backArrow} onPress={handleCancel}>
                    <Ionicons name="arrow-back" size={30} color='black'/>
                </TouchableOpacity>
            )}

            {isFirstTimeUser && (
                <View style={styles.welcomeHeader}>
                    <Text style={styles.welcomeTitle}>Complete Your Profile</Text>
                    <Text style={styles.welcomeSubtitle}>Please fill in your details to continue</Text>
                </View>
            )}

            <View style={styles.avatarContainer}>
                <Image source={require('./../../assets/images/profileimage.png')} style={{
                    width: 120,
                    height: 120,
                    borderRadius: 99
                }}/>
                <View style={styles.photoButtons}>
                    <Text style={styles.photoButtonText}>Edit profile</Text>
                </View>
            </View>

            <View style={styles.separator}/>

            <TextInput
                style={styles.input}
                placeholder='Surname *'
                placeholderTextColor="gray"
                value={surname}
                onChangeText={setSurname}
                editable={!isSaving}
            />

            <TextInput
                style={styles.input}
                placeholder='Name *'
                placeholderTextColor="gray"
                value={name}
                onChangeText={setName}
                editable={!isSaving}
            />

            <View style={styles.emailContainer}>
                <TextInput
                    style={[styles.input, styles.disabledInput]}
                    placeholder='E-mail'
                    placeholderTextColor="gray"
                    value={email}
                    editable={false}
                />
                <Text style={styles.disabledLabel}>Email cannot be changed</Text>
            </View>

            <View style={styles.phoneContainer}>
                <TextInput
                    style={[styles.input, styles.requiredInput]}
                    placeholder='Phone Number *'
                    placeholderTextColor="gray"
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType='phone-pad'
                    editable={!isSaving}
                />
                <Text style={styles.requiredLabel}>* Required field</Text>
            </View>

            <TextInput
                style={styles.input}
                placeholder='Username'
                placeholderTextColor="gray"
                value={userName}
                onChangeText={setUserName}
                editable={!isSaving}
            />


            <TouchableOpacity 
                style={[styles.saveButton, isSaving && styles.disabledButton]}
                onPress={handleSave}
                disabled={isSaving}
            >
                {isSaving ? (
                    <ActivityIndicator size="small" color="white"/>
                ) : (
                    <Text style={styles.saveText}>
                        {isFirstTimeUser ? 'Complete Profile' : 'Save changes'}
                    </Text>
                )}
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.cancelButton, isSaving && styles.disabledButton]}
                onPress={handleCancel}
                disabled={isSaving}
            >
                <Text style={styles.cancelText}>
                    {isFirstTimeUser ? 'Logout' : 'Cancel'}
                </Text>
            </TouchableOpacity>
        </View>
    )

}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        padding: 20,
        backgroundColor: 'white'
    },
    centered: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#666',
    },
    backArrow: {
        marginBottom: 20,
        marginTop: 50
    },
    welcomeHeader: {
        marginTop: 50,
        marginBottom: 20,
        alignItems: 'center',
    },
    welcomeTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    welcomeSubtitle: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
    avatarContainer: {
        alignItems: 'center',
        marginTop: 10
    },
    photoButtons: {
        flexDirection: 'row',
        justifyContent: 'center',
        width: 200,
        marginTop: 30,
    },
    photoButtonText: {
        textDecorationLine: 'underline',
        fontSize: 22,
        fontFamily: 'outfit-bold',
        textAlign: 'center',
    },
    separator: {
        borderBottomWidth: 1,
        borderBottomColor: '#000',
        marginVertical: 20,
    },
    input: {
        backgroundColor: '#FFF8DC',
        padding: 15,
        borderRadius: 5,
        marginBottom: 10,
        fontSize: 16,
    },
    requiredInput: {
        borderWidth: 1,
        borderColor: '#ff6b6b',
    },
    emailContainer: {
        marginBottom: 10,
    },
    phoneContainer: {
        marginBottom: 10,
    },
    disabledInput: {
        backgroundColor: '#f5f5f5',
        color: '#666',
        marginBottom: 5,
    },
    disabledLabel: {
        fontSize: 12,
        color: '#999',
        marginBottom: 5,
    },
    requiredLabel: {
        fontSize: 12,
        color: '#ff6b6b',
        marginBottom: 5,
    },
    saveButton: {
        backgroundColor: 'navy',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
    },
    saveText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    cancelButton: {
        backgroundColor: '#d3d3d3',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
    },
    cancelText: {
        color: 'black',
        fontSize: 16,
    },
    disabledButton: {
        opacity: 0.6,
    },



});