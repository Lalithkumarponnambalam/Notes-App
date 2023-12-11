import { useEffect, useState } from "react";
import { View, Text, FlatList, Dimensions, TouchableOpacity } from 'react-native';
import tw from 'twrnc';
import NotesHome from "./src/Notes/NotesHome";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import TaskHome from "./src/Task/TaskHome";
import { Image } from 'react-native';

const AppHome = () => {

    const [username, setUsername] = useState('');
    const [activeTab, setActiveTab] = useState('Notes');
    const navigation = useNavigation();

    useEffect(() => {
        AsyncStorage.getItem('userId')
            .then((userId) => {
                if (userId) {
                    axios
                        .post(`http://192.168.1.55:8080/user/view/${userId}`)
                        .then((response) => {
                            setUsername(response.data.username);
                        })
                        .catch((error) => {
                            console.error('Error fetching user details:', error);
                        });
                }
            })
            .catch((error) => {
                console.error('Error fetching userId:', error);
            });
    }, []);

    const handleToggle = (tab) => {
        if (tab === 'Notes') {
            setActiveTab('Notes');
        } else if (tab === 'Tasks') {
            setActiveTab('Tasks');
        }
    };

    const handleProfile = () => {
        navigation.navigate('profilepage');
    }

    return (
        <View style={tw`flex-1 relative`}>
            <View style={tw`flex-row justify-between items-center mt-8 mx-5`}>
                <Text style={tw`text-lg font-bold`}>Hey, {username}</Text>
                <TouchableOpacity onPress={handleProfile}>
                    <Image
                        source={require('/home/lalith/projects/Notes-App/assets/images.jpeg')}
                        style={tw`w-15 h-15 rounded-full mt-5`}
                    />
                </TouchableOpacity>
            </View>
            <View style={tw`mx-5 -mt-7`}>
                <Text style={{ color: '#6B7280', fontSize: 15 }}>Let's explore your note</Text>
            </View>
            <View style={tw`flex-row mx-4 mt-5 bg-gray-300 rounded-full overflow-hidden w-35`}>
                <TouchableOpacity onPress={() => handleToggle('Notes')} style={[tw`px-4 py-2 rounded-full`, activeTab === 'Notes' ? tw`bg-white` : tw`bg-gray-300`]}>
                    <Text style={tw`${activeTab === 'Notes' ? 'text-black font-bold' : 'text-gray-500'}`}>Notes</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleToggle('Tasks')} style={[tw`px-4 py-2 rounded-full`, activeTab === 'Tasks' ? tw`bg-white` : tw`bg-gray-300`]}>
                    <Text style={tw`${activeTab === 'Tasks' ? 'text-black font-bold' : 'text-gray-500'}`}>Tasks</Text>
                </TouchableOpacity>
            </View>
            {activeTab === 'Notes' && (
                <NotesHome />
            )}
            {activeTab === 'Tasks' && (
                <TaskHome />
            )}
        </View>
    );
}

export default AppHome;