import React, { useState } from 'react';
import { View, Text, TextInput, Button, Modal, TouchableOpacity } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { AntDesign, Feather, Ionicons, MaterialCommunityIcons, SimpleLineIcons } from '@expo/vector-icons';
import tw from 'twrnc';

const CreateNotes = () => {
  const [notesTitle, setNotesTitle] = useState('');
  const [notesDescription, setNotesDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [showCheckIcon, setShowCheckIcon] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);

  const categories = [
    'Personal',
    'Work',
    'Travel',
    'Health',
    'Food',
    'Shopping',
    'Events',
    'Education'
  ];

  const getCategoryStyles = (category) => {
    const categoryStyles = {
      Travel: tw`bg-green-500 w-16 text-center`,
      Work: tw`bg-pink-500 w-16 text-center`,
      Personal: tw`bg-blue-500 w-20 text-center`,
      Health: tw`bg-orange-500 w-16 text-center`,
      Food: tw`bg-amber-500 w-16 text-center`,
      Shopping: tw`bg-indigo-500 w-20 text-center`,
      Events: tw`bg-cyan-500 w-16 text-center`,
      Education: tw`bg-purple-500 w-20 text-center`,
      '': tw`text-gray-500`,
    };

    return categoryStyles[category] || tw``;
  };

  const navigation = useNavigation();

  const handleCategorySelection = (category) => {
    setSelectedCategory(category);
    setModalVisible(false);
  };

  const handleFocus = (inputName) => {
    setInputFocused(inputName);
    setShowCheckIcon(true);
  };

  const handleBlur = () => {
    setInputFocused('');
    setShowCheckIcon(false);
  };

  const createNotes = () => {
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
  };

  const navigateToNotesHome = () => {
    navigation.navigate('apphome');
  };

  return (
    <View style={tw`flex-1 p-4 mt-10`}>
      <View style={tw`flex-row items-center justify-center`}>
      <TouchableOpacity onPress={navigateToNotesHome}>
      <AntDesign name="leftcircleo" size={24} color="black" />
    </TouchableOpacity>
        <View style={tw`flex-1`}><Text style={tw`text-center font-bold mr-5 text-xl`}>Create Note</Text></View>
        {!showCheckIcon ? (
          <TouchableOpacity style={tw`absolute right-2`}>
            <MaterialCommunityIcons name="dots-vertical" size={24} color="black" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity>
            <SimpleLineIcons name="check" size={24} color="black" onPress={createNotes} />
          </TouchableOpacity>
        )}
      </View>
      <TextInput
        style={[tw`p-2 mb-2 mt-5 text-lg font-bold`]}
        placeholder="Your Note title"
        value={notesTitle}
        onChangeText={(text) => setNotesTitle(text)}
        onFocus={() => handleFocus('title')}
        onBlur={handleBlur}
      />
      <View style={tw`flex-row items-center justify-between`}>
        {selectedCategory !== '' ? (
          <Text style={[tw`mt-3 px-3 py-1 text-xs font-bold rounded-full text-right text-white`, getCategoryStyles(selectedCategory)]}>
            {selectedCategory}
          </Text>
        ) : (
          <Text style={[tw`text-base font-bold rounded-full px-2 py-1 text-white`, getCategoryStyles('')]}>Select category</Text>
        )}
        <TouchableOpacity onPress={() => setModalVisible(true)} >
          <Ionicons name="filter" size={24} color="gray" style={tw`mr-3`} />
        </TouchableOpacity>
      </View>
      <View style={tw`border-t border-gray-300 w-full mt-4`} />
      <TextInput
        style={[tw`p-2 text-lg`]}
        placeholder="Your Note's Description"
        multiline
        value={notesDescription}
        onChangeText={(text) => setNotesDescription(text)}
        onFocus={() => handleFocus('description')}
        onBlur={handleBlur}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={tw`flex-1 justify-center items-center bg-gray-300 bg-opacity-50`}>
          <View style={tw`bg-white p-4 rounded-lg w-60`}>
            <View style={tw`flex-row items-center justify-between`}>
              <Text style={tw`font-bold text-base`}>Sort & Filter</Text>
              <TouchableOpacity style={tw`p-2`} onPress={() => setModalVisible(false)}>
                <Feather name="x" size={20} color="black" />
              </TouchableOpacity>
            </View>
            <View style={tw`border-t border-gray-100 w-full mt-2 mb-2`} />
            {categories.map((category, index) => (
              <TouchableOpacity
                key={index}
                style={tw`p-2`}
                onPress={() => handleCategorySelection(category)}
              >
                <Text>{category}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default CreateNotes;
