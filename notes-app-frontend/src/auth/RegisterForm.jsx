import React, { useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity } from 'react-native';
import axios from 'axios';
import tw from 'twrnc';
import { AntDesign, Feather, Ionicons } from '@expo/vector-icons';

const RegisterForm = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleFormSubmit = () => {
    if (username && email && password === confirmPassword) {
      const user = {
        username: username,
        email: email,
        password: password,
      };

      axios
        .post('http://192.168.1.55:8080/user/create', user)
        .then((response) => {
          if (response.status === 200) {
            console.log('Registration successful');

            setTimeout(() => {
              navigation.navigate('Login');
            }, 2000);
          }
          console.log('User created:', response.data);
        })
        .catch((err) => {
          console.error('Error creating user:', err);
          setError('An error occurred. Please try again.');
        });
    } else {
      setError('Please fill in all fields and ensure the passwords match.');
    }
  };

  return (
    <View>
      <View style={tw`bg-red-500 py-28 -mb-8 rounded-b-3xl`}>
        <Text style={tw`ml-5 font-bold text-3xl -mt-5`}>Welcome Back !</Text>
        <Text style={tw`ml-5 font-bold text-lg mb-5`}>One more step</Text>
      </View>
      <View style={tw`border border-gray-200 rounded-2xl w-5/6 ml-8 -mt-20 p-5 bg-white`}>
        <Text style={tw`text-3xl font-bold`}>Sign Up</Text>
        <Text style={tw`text-gray-400`}>Sign Up to access your account</Text>
        <Text style={tw`mt-5 mb-2 ml-1 text-gray-500`}>User Name</Text>
        <View style={tw`flex flex-row items-center border border-gray-300 rounded-full p-2`}>
          <AntDesign name="user" size={20} color="gray" style={tw`mr-2`} />
          <TextInput
            placeholder="Username"
            value={username}
            onChangeText={(text) => setUsername(text)}
            style={tw`flex-1`}
          />
        </View>
        <Text style={tw`mt-3 mb-2 ml-1 text-gray-500`}>Email Address</Text>
        <View style={tw`flex flex-row items-center border border-gray-300 rounded-full p-2`}>
          <Feather name="mail" size={18} color="gray" style={tw`mr-2`} />
          <TextInput
            placeholder="Email Address"
            value={email}
            onChangeText={(text) => setEmail(text)}
            style={tw`flex-1`}
          />
        </View>
        <Text style={tw`mt-3 mb-2 ml-1 text-gray-500`}>Password</Text>
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
        <Text style={tw`mt-3 mb-2 ml-1 text-gray-500`}>Conform Password</Text>
        <View style={tw`flex flex-row items-center border border-gray-300 rounded-full p-2`}>
          <Ionicons name="key-outline" size={20} color="gray" style={tw`mr-2`} />
          <TextInput
            placeholder="Confirm Password"
            value={confirmPassword}
            onChangeText={(text) => setConfirmPassword(text)}
            secureTextEntry
            style={tw`flex-1`}
          />
        </View>
        <Text style={{ color: 'red', marginVertical: 8 }}>{error}</Text>
        <TouchableOpacity
          style={tw`bg-red-500 p-2 rounded-full`}
          onPress={handleFormSubmit}
        >
          <Text style={tw`text-white text-center font-bold text-lg`}>Sign Up</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={() => navigation.navigate('login')}>
        <Text style={tw`text-center mt-15 text-lg font-bold`}>Already have an account ? <Text style={tw`text-red-500`}>Sign In</Text></Text>
      </TouchableOpacity>
    </View>
  );
};

export default RegisterForm;
