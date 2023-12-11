import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Modal, Pressable } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import tw from 'twrnc';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { AntDesign, Feather, Ionicons, MaterialCommunityIcons, MaterialIcons, SimpleLineIcons } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';

const EditNotes = ({ route, navigation }) => {
  const { notesId } = route.params;
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [showCheckIcon, setShowCheckIcon] = useState(false);
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [inputFocused, setInputFocused] = useState(false);

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

  useEffect(() => {
    const fetchNoteDetails = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        const response = await axios.post(
          `http://192.168.1.55:8080/notes/${notesId}?userId=${userId}`
        );
        const { notesTitle, notesDescription, category } = response.data;
        setTitle(notesTitle);
        setDescription(notesDescription);
        setSelectedCategory(category); //
      } catch (error) {
        console.error('Error fetching note details:', error);
      }
    };

    fetchNoteDetails();
  }, [notesId]);

  useEffect(() => {
    const requestNotificationPermissions = async () => {
      try {
        const { status: existingStatus } =
          await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }

        if (finalStatus !== 'granted') {
          throw new Error('Permission to send notifications denied');
        }
      } catch (error) {
        console.error('Error requesting notification permissions:', error);
      }
    };

    requestNotificationPermissions();
  }, []);

  const scheduleNotification = async (reminderDateTime) => {
    try {
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Notes Reminder',
          body: `${title}`,
        },
        trigger: { date: reminderDateTime },
      });
      console.log('Notification ID:', notificationId);
      console.log('Notification scheduled successfully!');
    } catch (error) {
      console.error('Error scheduling notification:', error);
    }
  };

  const handleSaveChanges = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      let url = `http://192.168.1.55:8080/notes/edit/${notesId}?category=${selectedCategory}`;

      await axios.post(url, {
        notesTitle: title,
        notesDescription: description,
      });

      navigation.navigate('apphome');
    } catch (error) {
      console.error('Error editing note:', error);
      Alert.alert('Error', 'An error occurred while editing the note');
    }
  };

  const handleFocus = (inputName) => {
    setInputFocused(inputName);
    setShowCheckIcon(true);
  };

  const handleBlur = () => {
    setInputFocused('');
    setShowCheckIcon(false);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setCategoryModalVisible(false);
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleDateConfirm = async (date) => {
    try {
      const selectedDateTime = date.toISOString();

      const selectedDateIST = new Date(selectedDateTime);
      selectedDateIST.setHours(selectedDateIST.getHours());
      selectedDateIST.setMinutes(selectedDateIST.getMinutes());

      const formattedTime = selectedDateIST.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
      });

      const formattedDate = selectedDateIST.toISOString().split('T')[0];

      const userId = await AsyncStorage.getItem('userId');

      const reminderData = {
        reminderDate: formattedDate,
        reminderTime: formattedTime,
      };

      console.log('Request body:', reminderData);

      const response = await axios.post(`http://192.168.1.55:8080/notes/add-reminder/${notesId}?userId=${userId}`, reminderData);

      console.log('Response:', response.data);

      await scheduleNotification(selectedDateIST);

      Alert.alert('Success', 'Reminder set successfully');
    } catch (error) {
      console.error('Error setting reminder:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
      }
      Alert.alert('Error', 'An error occurred while setting the reminder');
    }
  };

  const handledeleteNote = () => {
    axios.post(`http://192.168.1.55:8080/notes/delete/${notesId}`).then(() => {
      navigation.navigate('apphome');
    }).catch((error) => {
      console.error('Error deleting note:', error);
      Alert.alert('Error', 'An error occurred while deleting the note');
    });
  };

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

  const navigateToNotesHome = () => {
    navigation.navigate('apphome');
  };

  return (
    <View style={tw`flex-1 p-4 mt-10`}>
      <View style={tw`flex-row items-center justify-center`}>
      <TouchableOpacity onPress={navigateToNotesHome}>
      <AntDesign name="leftcircleo" size={24} color="black" />
    </TouchableOpacity>
        <View style={tw`flex-1`}><Text style={tw`text-center font-bold mr-5 text-xl`}>Edit Note</Text></View>
        {!showCheckIcon ? (
          <TouchableOpacity style={tw`absolute right-2`} onPress={() => setModalVisible(true)}>
            <MaterialCommunityIcons name="dots-vertical" size={24} color="black" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={handleSaveChanges}>
            <SimpleLineIcons name="check" size={24} color="black" />
          </TouchableOpacity>
        )}
      </View>
      <TextInput
        style={[tw`p-2 mt-5 text-lg font-bold`]}
        placeholder="Enter title"
        value={title}
        onChangeText={(text) => setTitle(text)}
        onFocus={() => handleFocus('title')}
        onBlur={handleBlur}
      />
      <View style={tw`flex-row items-center justify-between`}>
        {selectedCategory !== '' ? (
          <Text style={[tw`mt-3 px-3 py-1 text-xs font-bold rounded-full text-right text-white`, getCategoryStyles(selectedCategory)]}>
            {selectedCategory}
          </Text>
        ) : (
          <Text style={[tw`text-xs font-bold rounded-full px-3 py-1 text-right text-white`, getCategoryStyles('')]}>
            Select your category
          </Text>
        )}
        <TouchableOpacity onPress={() => setCategoryModalVisible(true)} >
          <Ionicons name="filter" size={24} color="gray" style={tw`mr-3`} />
        </TouchableOpacity>
      </View>
      <View style={tw`border-t border-gray-300 w-full mt-4`} />
      <TextInput
        style={[tw`p-2 text-lg`]}
        placeholder="Enter description"
        multiline
        value={description}
        onChangeText={(text) => setDescription(text)}
        onFocus={() => handleFocus('description')}
        onBlur={handleBlur}
      />
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="datetime"
        onConfirm={handleDateConfirm}
        onCancel={hideDatePicker}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <Pressable
          style={[tw`flex-1 bg-gray-200 bg-opacity-70 p-3`, { justifyContent: 'flex-start', alignItems: 'flex-end' }]}
          onPress={() => setModalVisible(false)}>
          <View style={tw`bg-white p-4 rounded-xl shadow-md w-50`}>
            <View style={tw`flex-row items-center mt-2 p-2`}>
              <MaterialIcons name="notifications-none" size={24} color="black" />
              <TouchableOpacity onPress={showDatePicker}>
                <Text style={tw`text-base`}>Reminder</Text>
              </TouchableOpacity>
            </View>
            <View style={tw`flex-row items-center mt-2 p-2`}>
              <MaterialIcons name="delete-outline" size={24} color="black" />
              <TouchableOpacity onPress={handledeleteNote}>
                <Text style={tw`text-base`}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={categoryModalVisible}
        onRequestClose={() => setCategoryModalVisible(false)}
      >
        <View style={tw`flex-1 justify-center items-center bg-gray-200 bg-opacity-70`}>
          <View style={tw`bg-white p-4 rounded-lg w-60`}>
            <View style={tw`flex-row items-center justify-between`}>
              <Text style={tw`font-bold text-base`}>Sort & Filter</Text>
              <TouchableOpacity style={tw`p-2`} onPress={() => setCategoryModalVisible(false)}>
                <Feather name="x" size={20} color="black" />
              </TouchableOpacity>
            </View>
            <View style={tw`border-t border-gray-100 w-full mt-2 mb-2`} />
            {categories.map((category, index) => (
              <TouchableOpacity
                key={index}
                style={tw`p-2`}
                onPress={() => handleCategorySelect(category)}
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

export default EditNotes;
