import React, { useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import tw from 'twrnc';
import { Feather, Ionicons } from '@expo/vector-icons';

const LoginForm = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleFormSubmit = async () => {
    try {
      const response = await axios.post('http://192.168.1.55:8080/user/login', {
        email: email,
        password: password,
      });

      if (response.data.userId) {
        await AsyncStorage.setItem('userId', response.data.userId);
        console.log('Login successful!');
        navigation.navigate('apphome');
      } else {
        setError('Incorrect username or password');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <View>
      <View style={tw`bg-red-500 py-35 -mb-8 rounded-b-3xl`}>
        <Text style={tw`ml-5 font-bold text-3xl -mt-5`}>Welcome Back !</Text>
        <Text style={tw`ml-5 font-bold text-lg mb-5`}>Glad you are here</Text>
      </View>
      <View style={tw`border border-gray-200 rounded-2xl w-5/6 ml-8 -mt-20 p-5 py-10 bg-white`}>
        <Text style={tw`text-3xl font-bold -mt-4`}>Login</Text>
        <Text style={tw`text-gray-400`}>Sign in to access your account</Text>
        <Text style={tw`mt-5 mb-2 text-gray-500 ml-1`}>Email Address</Text>
        <View style={tw`flex flex-row items-center border border-gray-300 rounded-full p-2`}>
          <Feather name="mail" size={18} color="gray" style={tw`mr-2`} />
          <TextInput
            placeholder="Email Address"
            value={email}
            onChangeText={(text) => setEmail(text)}
            style={tw`flex-1`}
          />
        </View>
        <Text style={tw`mt-5 mb-2 ml-1 text-gray-500`}>Password</Text>
        <View style={tw`flex flex-row items-center border border-gray-300 rounded-full p-2`}>
          <Ionicons name="key-outline" size={20} color="gray" style={tw`mr-2`} />
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={(text) => setPassword(text)}
            secureTextEntry
            style={tw`flex-1`}
          />
        </View>
        <Text style={{ color: 'red', marginVertical: 8 }}>{error}</Text>
        <TouchableOpacity
          style={tw`bg-red-500 p-2 rounded-full mt-4`}
          onPress={handleFormSubmit}
        >
          <Text style={tw`text-white text-center font-bold text-lg`}>Login</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={() => navigation.navigate('register')}>
        <Text style={tw`text-center mt-15 text-lg font-bold`}>Don't have an account yet? <Text style={tw`text-red-500`}>Sign up</Text></Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginForm;
