import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useEffect, useState } from "react";
import { Text, View, Image } from "react-native";
import tw from 'twrnc';

const PorfilePage = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');

    useEffect(() => {
        AsyncStorage.getItem('userId')
            .then((userId) => {
                if (userId) {
                    axios
                        .post(`http://192.168.1.55:8080/user/view/${userId}`)
                        .then((response) => {
                            setUsername(response.data.username);
                            setEmail(response.data.email); 
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

    return (  
        <View >
            <View style={[tw`items-center justify-center`]}>
            <Image
                source={require('/home/lalith/Notes-app/notes-frontend/assets/images.jpeg')}
                style={tw`w-35 h-35 rounded-full mt-20`}
            />
            <Text style={tw`mt-5`}>{username}</Text>
            <Text>{email}</Text>
            </View>
        </View>
    );
}

export default PorfilePage;
