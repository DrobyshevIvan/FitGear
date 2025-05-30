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

    useEffect(() => {
        loadUserProfile();
    }, []);

    const loadUserProfile = async () => {
        try {
            setIsLoading(true);

            if (authState.userProfile) {
                fillFormWithProfileData(authState.userProfile);
                setIsLoading(false);
                return;
            }

            const profile = await getUserProfile();
            fillFormWithProfileData(profile);
        } catch (error) {
            console.error('Error loading profile:', error);
            Alert.alert('Error', 'Failed to load this profile');
        } finally {
            setIsLoading(false);
        }
    };

    const fillFormWithProfileData = (profile) => {
        setName(profile.firstName || '');
        setSurname(profile.lastName || '');
        setEmail(profile.email || '');
        setPhone(profile.phoneNumber || '');
        setUserName(profile.userName || profile.email || '');
    };

    const handleSave = async () => {
        try {
            setIsSaving(true);

            const updateData = {
                firstName: name,
                lastName: surname,
                phoneNumber: phone,
                userName: userName
            };
            await updateUserProfile(updateData);

            Alert.alert('Successfully', 'Data was saved', [
                {
                    text: 'OK',
                    onPress: () => router.back()
                }
            ]);
        } catch (error) {
            console.error('Error saving profile:', error);
            Alert.alert('Error', 'Data was not saved');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading || isLoadingProfile) {
        return (
            <View style={[styles.container, styles.centered]}>
                <ActivityIndicator size='large' color="$4285F4"/>
                <Text style={styles.loadingText}>Loading profile...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.backArrow} onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={30} color='black'/>
            </TouchableOpacity>

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
            placeholder='Surname'
            placeholderTextColor="black"
            value={surname}
            onChangeText={setSurname}
            editable={!isSaving}
            />

            <TextInput
            style={styles.input}
            placeholder='Name'
            placeholderTextColor="black"
            value={name}
            onChangeText={setName}
            editable={!isSaving}
            />

            <View style={styles.emailContainer}>
            <TextInput
            style={[styles.input, styles.disabledInput]}
            placeholder='E-mail'
            placeholderTextColor="black"
            value={email}
            editable={false}
            />
            <Text style={styles.disabledLabel}>Email cannot be changed</Text>
            </View>

            <TextInput
            style={styles.input}
            placeholder='+380...'
            placeholderTextColor="gray"
            value={phone}
            onChangeText={setPhone}
            keyboardType='phone-pad'
            editable={!isSaving}
            />

            <TouchableOpacity style={[styles.saveButton, isSaving && styles.disabledButton]}
            onPress={handleSave}
            disabled={isSaving}
            >
                {isSaving ? (
                    <ActivityIndicator size="small" color="white"/>
                ) : (
                    <Text style={styles.saveText}>Save changes</Text>
                )}
            </TouchableOpacity>
            <TouchableOpacity 
            style={[styles.cancelButton, isSaving && styles.disabledButton]}
            onPress={() => router.back()}
            disabled={isSaving}
            >
                <Text style={styles.cancelText}>Cancel</Text>
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
    avatarContainer: {
        alignItems: 'center',
        marginTop: 10
    },
    avatarCircle: {
        backgroundColor: '#4285F4',
        borderRadius: 100,
        width: 120,
        height: 120,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
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
    emailContainer: {
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