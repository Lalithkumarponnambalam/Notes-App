import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Dimensions, TouchableOpacity, Modal } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import tw from 'twrnc';
import { AntDesign, Entypo, Feather, Ionicons, MaterialCommunityIcons, } from '@expo/vector-icons';
import { TextInput } from 'react-native-gesture-handler';

const NotesHome = () => {
  const [notes, setNotes] = useState([]);
  const screenWidth = Dimensions.get('window').width;
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const categories = [
    'Personal',
    'Work',
    'Travel',
    'Health',
    'Food',
    'Shopping',
    'Events',
    'Education',
  ];

  const navigation = useNavigation();

  const fetchExistingNotes = () => {
    AsyncStorage.getItem('userId')
      .then((userId) => {
        if (userId) {
          axios
            .post(`http://192.168.1.55:8080/notes/view?userId=${userId}`)
            .then((response) => {
              const fetchedNotes = response.data;
              setNotes(fetchedNotes);
            })
            .catch((error) => {
              console.error('Error fetching notes:', error);
            });
        }
      })
      .catch((error) => {
        console.error('Error retrieving userId:', error);
      });
  };

  const handleEditNotes = (notesId) => {
    navigation.navigate('editnotes', { notesId });
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchExistingNotes();
    }, [])
  );

  useEffect(() => {
    setFilteredNotes(notes);
  }, [notes]);

  function handleAddNotes() {
    navigation.navigate('createnotes');
  }

  useEffect(() => {
    fetchExistingNotes();
  }, []);

  const trimDescription = (description) => {
    const maxLength = 40;
    if (description.length > maxLength) {
      return description.slice(0, maxLength) + '..';
    }
    return description;
  };

  const formatDate = (dateString, updatedDateString) => {
    const twelveHours = 12 * 60 * 60 * 1000;
    const date = new Date(dateString);
    const currentTime = new Date().getTime();
    const timeDiff = currentTime - date.getTime();

    const updatedDate = new Date(updatedDateString);
    const updatedTimeDiff = currentTime - updatedDate.getTime();

    if (updatedTimeDiff <= twelveHours) {
      const options = { hour: 'numeric', minute: 'numeric' };
      return updatedDate.toLocaleTimeString(undefined, options);
    }

    if (timeDiff <= twelveHours) {
      const options = { hour: 'numeric', minute: 'numeric' };
      return date.toLocaleTimeString(undefined, options);
    }

    const options = { year: 'numeric', month: 'long' };
    return date.toLocaleDateString(undefined, options);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    const filteredResults = notes.filter(
      (item) =>
        item.notesTitle.toLowerCase().includes(query.toLowerCase()) ||
        item.notesDescription.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredNotes(filteredResults);
  };

  const filterNotesByCategories = () => {
    if (selectedCategories.length > 0) {
      const filteredResults = notes.filter((item) =>
        selectedCategories.includes(item.category)
      );
      setFilteredNotes(filteredResults);
    } else {
      setFilteredNotes(notes);
    }
  };

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const handleCategorySelection = (category) => {
    const updatedCategories = selectedCategories.includes(category)
      ? selectedCategories.filter((item) => item !== category)
      : [...selectedCategories, category];

    setSelectedCategories(updatedCategories);
  };

  useEffect(() => {
    filterNotesByCategories();
  }, [selectedCategories, notes]);


  return (
    <View style={tw`flex-1`}>
      <View style={tw`bg-gray-100 flex-1 relative p-2`}>
        <View style={tw`flex-row items-center justify-between p-3`}>
          <View style={tw` bg-gray-200 rounded-full px-3 py-2 flex-row items-center w-78`}>
            <Feather name="search" size={20} color="gray" style={tw`mr-2`} />
            <TextInput
              style={tw`flex-1 text-base`}
              placeholder="Search notes"
              value={searchQuery}
              onChangeText={handleSearch}
            />
          </View>
          <TouchableOpacity onPress={toggleModal}>
            <Ionicons name="filter" size={24} color="gray" style={tw`ml-4`} />
          </TouchableOpacity>
        </View>
        <Modal visible={showModal} animationType="slide" transparent>
          <TouchableOpacity
            style={tw`flex-1 justify-center items-center bg-black bg-opacity-60`}
            onPress={toggleModal}
          >
            <View style={tw`bg-white p-4 rounded-xl w-60`}>
              <Text style={tw`font-bold`}>Sort & Filter</Text>
              <View style={tw`border-t border-gray-100 w-full mt-2 mb-2`} />
              {categories.map((category, index) => (
                <TouchableOpacity
                  style={tw`flex-row items-center mb-2`}
                  key={index}
                  onPress={() => handleCategorySelection(category)}
                >
                  <Ionicons
                    name={selectedCategories.includes(category) ? 'checkbox-outline' : 'square-outline'}
                    size={24}
                    color="black"
                    style={tw`mr-2`}
                  />
                  <Text>{category}</Text>
                </TouchableOpacity>
              ))}

              <TouchableOpacity
                style={tw`bg-blue-500 py-2 mt-2 rounded-md`}
                onPress={() => {
                  filterNotesByCategories();
                  toggleModal();
                }}
              >
                <Text style={tw`text-white text-center`}>Apply</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
        <FlatList
          contentContainerStyle={tw`flex-grow`}
          data={filteredNotes}
          keyExtractor={(item) => item.notesId.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleEditNotes(item.notesId)}>
              <View style={[tw`bg-white rounded-xl mt-3 mx-2 p-3`, { width: screenWidth / 1 - 36, height: 120 }]}>
                <View style={tw`flex-row justify-between`}>
                  <View style={tw`flex-1`}>
                    <Text
                      style={tw`text-lg font-bold ml-1`}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {item.notesTitle}
                    </Text>
                  </View>
                  <View style={tw`flex-1 items-end`}>
                    <Text
                      style={[
                        tw`text-xs font-bold text-white rounded-full px-3 py-1 text-right`,
                        item.category === 'Travel' ? tw`bg-green-500 w-19 text-center` :
                          item.category === 'Work' ? tw`bg-pink-500 w-19 text-center` :
                            item.category === 'Personal' ? tw`bg-yellow-500 w-19 text-center` :
                              item.category === 'Health' ? tw`bg-orange-500 w-19 text-center` :
                                item.category === 'Food' ? tw`bg-emerald-500 w-19 text-center` :
                                  item.category === 'Shopping' ? tw`bg-indigo-500 w-19 text-center` :
                                    item.category === 'Events' ? tw`bg-cyan-500 w-19 text-center` :
                                      item.category === 'Education' ? tw`bg-purple-500 w-20` :
                                        tw``
                      ]}
                    >
                      {item.category}
                    </Text>
                  </View>
                </View>
                <Text
                  style={tw`text-gray-700 ml-1`}
                  numberOfLines={3}
                  ellipsizeMode="tail"
                >
                  {trimDescription(item.notesDescription)}
                </Text>
                <View style={tw`border-t border-gray-100 w-full mt-2`} />
                <View style={tw`flex-row justify-between mt-2 mb-2`}>
                  <View style={tw`flex-row items-center`}>
                    <AntDesign name="calendar" size={18} color="black" style={tw`mr-2`} />
                    <View>
                      {item.updatedDate ? (
                        <Text>{formatDate(item.updatedDate, item.updatedDate)}</Text>
                      ) : (
                        <Text>{formatDate(item.createdDate, item.updatedDate)}</Text>
                      )}
                    </View>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          )}
          numColumns={2}
          showsVerticalScrollIndicator={false}
        />
      </View>
      <TouchableOpacity
        style={tw`absolute bottom-20 p-3 right-6 rounded-full bg-blue-500 shadow`}
        onPress={handleAddNotes}>
        <MaterialCommunityIcons name="pencil" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default NotesHome;
