import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Alert } from 'react-native';
import { getUserData } from './database';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen() {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUserData = await AsyncStorage.getItem('userData');
        if (storedUserData) {
          const parsedUser = JSON.parse(storedUserData);
          const data = await getUserData(parsedUser.username);
          setUserData(data);
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to load user data');
      }
    };

    fetchUserData();
  }, []);

  if (!userData) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={{ uri: userData.profilePicture || 'https://example.com/default-avatar.png' }}
        style={styles.profilePicture}
      />
      <Text style={styles.name}>{`${userData.firstName} ${userData.lastName}`}</Text>
      <Text style={styles.info}>Email: {userData.email}</Text>
      <Text style={styles.info}>Contact: {userData.contactNumber}</Text>
      <Text style={styles.info}>Address: {userData.address}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
  },
  profilePicture: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  info: {
    fontSize: 16,
    marginBottom: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#666',
  },
});
