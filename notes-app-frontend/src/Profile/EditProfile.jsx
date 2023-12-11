import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';


const EditProfile = ({ navigation }) => {
  const [userId, setUserId] = useState('');
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    fetchUserId();
  }, []);

  const fetchUserId = async () => {
    try {
      const storedUserId = await AsyncStorage.getItem('userId');
      if (storedUserId !== null) {
        setUserId(storedUserId);
        fetchUserData(storedUserId);
      } else {
        console.error('User ID not found');
        Alert.alert('User ID not found.');
      }
    } catch (error) {
      console.error('Error fetching user ID:', error);
      Alert.alert('Failed to fetch user ID.');
    }
  };

  const fetchUserData = (userId) => {
    axios.post(`http://192.168.1.55:8080/user/view/${userId}`)
      .then((response) => {
        const { username, email, password } = response.data;
        setUserName(username || '');
        setEmail(email || '');
        setPassword(password || '');
      })
  };
  

  const handleSave = () => {
    const userData = { userId, username: userName, email, password };
    axios.post('http://192.168.1.55:8080/user/edit', userData)
      .then((response) => {
        console.log('User data updated:', response.data);
        Alert.alert('User data updated successfully!');
        navigation.navigate('Home'); 
      })
      .catch((error) => {
        console.error('Error updating user data:', error);
        Alert.alert('Failed to update user data. Please try again.');
      });
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f0f0f0', padding: 20 }}>
      <Text>User Name</Text>
      <TextInput value={userName} onChangeText={(text) => setUserName(text)} />
      <Text>Email Address</Text>
      <TextInput value={email} onChangeText={(text) => setEmail(text)} />
      <Text>Password</Text>
      <TextInput value={password} onChangeText={(text) => setPassword(text)} />
      <Button title="Save" onPress={handleSave} />
    </View>
  );
};

export default EditProfile;
