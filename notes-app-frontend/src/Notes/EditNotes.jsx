import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Modal, Pressable } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import tw from 'twrnc';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';
import { Picker } from '@react-native-picker/picker';

const EditNotes = ({ route, navigation }) => {
  const { notesId } = route.params;
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');


  useEffect(() => {
    const fetchNoteDetails = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        const response = await axios.post(
          `http://192.168.1.55:8080/notes/${notesId}?userId=${userId}`
        );
        const { notesTitle, notesDescription } = response.data;
        setTitle(notesTitle);
        setDescription(notesDescription);
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
  return (
    <View style={tw`flex-1 p-4 mt-10`}>
      <TouchableOpacity style={tw`absolute right-4`} onPress={() => setModalVisible(true)}>
        <MaterialCommunityIcons name="dots-vertical" size={24} color="black" />
      </TouchableOpacity>
      <TextInput
        style={[tw`border border-gray-400 p-2 mb-2 mt-5`, { fontSize: 18, fontWeight: 'bold' }]}
        placeholder="Enter title"
        value={title}
        onChangeText={(text) => setTitle(text)}
      />
      <TextInput
        style={[tw`border border-gray-400 p-2 mb-4`, { height: 200, fontSize: 16 }]}
        placeholder="Enter description"
        multiline
        value={description}
        onChangeText={(text) => setDescription(text)}
      />
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="datetime"
        onConfirm={handleDateConfirm}
        onCancel={hideDatePicker}
      />
      <TouchableOpacity style={tw`bg-blue-500 p-3 rounded mt-4`} onPress={handleSaveChanges}>
        <Text style={tw`text-white text-center`}>Save Changes</Text>
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <Pressable
          style={[tw`flex-1 bg-gray-200 bg-opacity-70`, { justifyContent: 'flex-start', alignItems: 'flex-end' }]}
          onPress={() => setModalVisible(false)}>
          <View style={tw`bg-white p-4 rounded-xl shadow-md w-50`}>
            <TouchableOpacity style={tw`bg-blue-500 p-3 rounded mt-2`} onPress={showDatePicker}>
              <Text style={tw`text-white text-center`}>Set Reminder</Text>
            </TouchableOpacity>

            <TouchableOpacity style={tw`bg-blue-500 p-3 rounded mt-2`} onPress={handledeleteNote}>
              <Text style={tw`text-white text-center`}>Delete Notes</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
      <Picker
        selectedValue={selectedCategory}
        onValueChange={(itemValue) => setSelectedCategory(itemValue)}
        style={[tw`border border-gray-400 p-2 mb-2`]}
      >
        <Picker.Item label="Select a category" value="" />
        <Picker.Item label="Personal" value="Personal"/>
        <Picker.Item label="Work" value="Work" />
        <Picker.Item label="Travel" value="Travel" />
        <Picker.Item label="Health" value="Health" />
        <Picker.Item label="Food" value="Food" />
        <Picker.Item label="Shopping" value="Shopping" />
        <Picker.Item label="Events" value="Events" />
        <Picker.Item label="Education" value="Education" />
      </Picker>
    </View>
  );
};

export default EditNotes;
