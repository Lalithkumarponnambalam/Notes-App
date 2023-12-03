import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import tw from 'twrnc';
import { Picker } from '@react-native-picker/picker';

const CreateNotes = () => {
  const [notesTitle, setNotesTitle] = useState('');
  const [notesDescription, setNotesDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const navigation = useNavigation();

  function createNotes() {
    const newNote = {
      notesTitle: notesTitle,
      notesDescription: notesDescription,
      category: selectedCategory || 'null',
    };

    AsyncStorage.getItem('userId')
      .then((userId) => {
        axios
          .post(`http://192.168.1.55:8080/notes/create?category=${newNote.category}&userId=${userId}`, newNote)
          .then((response) => {
            console.log('Request successful:', response.data);
            navigation.navigate('apphome');
          })
          .catch((error) => {
            console.error('Error:', error);
          });
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  return (
    <View style={tw`flex-1 p-4`}>
      <TextInput
        style={[tw`border border-gray-400 p-2 mb-2`, { fontSize: 18, fontWeight: 'bold' }]}
        placeholder="Enter title"
        value={notesTitle}
        onChangeText={(text) => setNotesTitle(text)}
      />
      <TextInput
        style={[tw`border border-gray-400 p-2`, { fontSize: 16 }]}
        placeholder="Enter description"
        multiline
        value={notesDescription}
        onChangeText={(text) => setNotesDescription(text)}
      />
      <Picker
        selectedValue={selectedCategory}
        onValueChange={(itemValue) => setSelectedCategory(itemValue)}
        style={[tw`border border-gray-400 p-2 mb-2`]}
      >
        <Picker.Item label="Select category" value="" />
        <Picker.Item label="Personal" value="Personal" />
        <Picker.Item label="Work" value="Work" />
        <Picker.Item label="Travel" value="Travel" />
        <Picker.Item label="Health" value="Health" />
        <Picker.Item label="Food" value="Food" />
        <Picker.Item label="Shopping" value="Shopping" />
        <Picker.Item label="Events" value="Events" />
        <Picker.Item label="Education" value="Education" />
      </Picker>

      <Button title="Save" onPress={createNotes} color="#007AFF" />
    </View>
  );
};

export default CreateNotes;
