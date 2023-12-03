import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginForm from './src/auth/LoginForm';
import CreateNotes from './src/Notes/CreateNotes';
import EditNotes from './src/Notes/EditNotes';
import RegisterForm from './src/auth/RegisterForm';
import NotesHome from './src/Notes/NotesHome';
import TaskHome from './src/Task/TaskHome';
import AppHome from './src/AppHome';
import EditProfile from './src/Profile/EditProfile';
import PorfilePage from './src/Profile/ProfilePage';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="login" component={LoginForm} options={{ headerShown: false }} />
        <Stack.Screen name="register" component={RegisterForm} options={{ headerShown: false }} />
        <Stack.Screen name="noteshome" component={NotesHome} options={{ headerShown: false }} />
        <Stack.Screen name="createnotes" component={CreateNotes} options={{ headerShown: false }} />
        <Stack.Screen name="editnotes" component={EditNotes} options={{ headerShown: false }} />
        <Stack.Screen name="editprofile" component={EditProfile} options={{ headerShown: false }} />
        <Stack.Screen name="apphome" component={AppHome} options={{ headerShown: false }} />
        <Stack.Screen name="taskhome" component={TaskHome} options={{ headerShown: false }} />
        <Stack.Screen name="profilepage" component={PorfilePage} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
