import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Image,
  ScrollView,
} from 'react-native';
import { useState, useEffect } from 'react';
import { initDatabase, registerUser, loginUser, getUserData, updateUserData } from './utils/database';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function App() {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    username: '',
    password: '',
    firstName: '',
    lastName: '',
    email: '',
    contactNumber: '',
    address: '',
    profilePicture: '',
  });

  useEffect(() => {
    initDatabase();
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    const status = await AsyncStorage.getItem('isLoggedIn');
    if (status === 'true') {
      setIsLoggedIn(true);
      loadUserData();
    }
  };

  const loadUserData = async () => {
    try {
      const storedUserData = await AsyncStorage.getItem('userData');
  
      if (!storedUserData) {
      //  console.log('No user data found in AsyncStorage');
        return; 
      }
      const parsedUserData = JSON.parse(storedUserData);
  
      if (!parsedUserData || !parsedUserData.username) {
     //   console.log('Invalid user data');
        return; 
      }
  
      const userFromDatabase = await getUserData(parsedUserData.username);
  
      if (!userFromDatabase) {
      //  console.log('No user found in database');
        return; 
      }
  
      setUserData(userFromDatabase); 
    } catch (error) {
   //  console.error('Error loading user data:', error);
    }
  };
  
  
  

  const handleInputChange = (field, value) => {
    setUserData({ ...userData, [field]: value });
  };

  const validateInputs = () => {
    const { username, password, firstName, lastName, email, contactNumber, address } = userData;

    if (isLogin) {
      if (!username || !password) {
        Alert.alert('Error', 'Username and password are required');
        return false;
      }
      return true;
    }

    if (!username || !password || !firstName || !lastName || !email || !contactNumber || !address) {
      Alert.alert('Error', 'All fields are required for registration');
      return false;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      Alert.alert('Error', 'Invalid email format');
      return false;
    }
    if (!/^\d+$/.test(contactNumber)) {
      Alert.alert('Error', 'Contact number should contain only digits');
      return false;
    }
    
    return true;
  };
  

  const handleSubmit = async () => {
    if (!validateInputs()) return;
  
    try {
      if (isLogin) {
     //   console.log('Logging in with:', userData.username, userData.password); // Log the username and password
  
        const userDataFromLogin = await loginUser(userData.username, userData.password);
     //   console.log('User data returned from login:', userDataFromLogin); // Log the returned user data
  
        if (userDataFromLogin) {
          await AsyncStorage.setItem('isLoggedIn', 'true');
          await AsyncStorage.setItem('userData', JSON.stringify(userDataFromLogin)); // Store user data for profile use
          setIsLoggedIn(true);
          loadUserData(); // Load user data for profile display
          Alert.alert('Success', 'Logged in successfully');
        }
      } else {
        // Register the user
        await registerUser(userData);
        Alert.alert('Success', 'Registration successful');
        setIsLogin(true); // Switch to login screen after registration
      }
    } catch (error) {
  //    console.error('Login/registration error:', error);
      Alert.alert('Error', error.message);
    }
  };
  
  

  const handleLogout = async () => {
    await AsyncStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
    setUserData({
      username: '',
      password: '',
      firstName: '',
      lastName: '',
      email: '',
      contactNumber: '',
      address: '',
      profilePicture: '',
    });
  };

  const handleSaveProfile = async () => {
    if (!validateInputs()) return;
    await updateUserData(userData.username, userData);
    setIsEditing(false);
    Alert.alert('Success', 'Profile updated successfully');
  };

  const renderProfileView = () => (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.profileContainer}>
        <Image
          source={{ uri: userData.profilePicture || 'https://t3.ftcdn.net/jpg/05/16/27/58/360_F_516275801_f3Fsp17x6HQK0xQgDQEELoTuERO4SsWV.jpg' }}
          style={styles.profilePicture}
        />
        <Text style={styles.profileName}>{`${userData.firstName} ${userData.lastName}`}</Text>
        <Text style={styles.profileLabel}>Email:</Text>
        <Text style={styles.profileText}>{userData.email}</Text>

        <Text style={styles.profileLabel}>Contact Number:</Text>
        <Text style={styles.profileText}>{userData.contactNumber}</Text>

        <Text style={styles.profileLabel}>Address:</Text>
        <Text style={styles.profileText}>{userData.address}</Text>

        <TouchableOpacity style={styles.editButton} onPress={() => setIsEditing(true)}>
          <Text style={styles.buttonText}>Edit Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
  

  const renderEditProfileView = () => (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.profileContainer} keyboardShouldPersistTaps="handled">
        <TextInput
          style={styles.input}
          placeholder="First Name"
          value={userData.firstName}
          onChangeText={(text) => handleInputChange('firstName', text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Last Name"
          value={userData.lastName}
          onChangeText={(text) => handleInputChange('lastName', text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={userData.email}
          onChangeText={(text) => handleInputChange('email', text)}
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Contact Number"
          value={userData.contactNumber}
          onChangeText={(text) => handleInputChange('contactNumber', text)}
          keyboardType="phone-pad"
        />
        <TextInput
          style={styles.input}
          placeholder="Address"
          value={userData.address}
          onChangeText={(text) => handleInputChange('address', text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Profile Picture URL"
          value={userData.profilePicture}
          onChangeText={(text) => handleInputChange('profilePicture', text)}
        />

        <TouchableOpacity style={styles.saveButton} onPress={() => { handleSaveProfile(); setIsEditing(false); }}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelButton} onPress={() => setIsEditing(false)}>
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
  

  if (isLoggedIn) {
    return isEditing ? renderEditProfileView() : renderProfileView();
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.formContainer} keyboardShouldPersistTaps="handled">

          <Text style={styles.title}>
            {isLogin ? 'Sign In' : 'Register'}
          </Text>
          <Text style={styles.subtitle}>
            {isLogin ? 'Welcome Back! Please sign in to continue' : 'Fill in the details to create your account'}
          </Text>

          <View style={styles.inputContainer}>
            {!isLogin && (
              <>
                <TextInput
                  style={styles.input}
                  placeholder="First Name"
                  value={userData.firstName}
                  onChangeText={(text) => handleInputChange('firstName', text)}
                  placeholderTextColor="#666"
                />
                <TextInput
                  style={styles.input}
                  placeholder="Last Name"
                  value={userData.lastName}
                  onChangeText={(text) => handleInputChange('lastName', text)}
                  placeholderTextColor="#666"
                />
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  value={userData.email}
                  onChangeText={(text) => handleInputChange('email', text)}
                  keyboardType="email-address"
                  placeholderTextColor="#666"
                />
                <TextInput
                  style={styles.input}
                  placeholder="Contact Number"
                  value={userData.contactNumber}
                  onChangeText={(text) => handleInputChange('contactNumber', text)}
                  keyboardType="phone-pad"
                  placeholderTextColor="#666"
                />
                <TextInput
                  style={styles.input}
                  placeholder="Address"
                  value={userData.address}
                  onChangeText={(text) => handleInputChange('address', text)}
                  placeholderTextColor="#666"
                />
                <TextInput
                  style={styles.input}
                  placeholder="Profile Picture URL"
                  value={userData.profilePicture}
                  onChangeText={(text) => handleInputChange('profilePicture', text)}
                  placeholderTextColor="#666"
                />
              </>
            )}
            <TextInput
              style={styles.input}
              placeholder="Username"
              value={userData.username}
              onChangeText={(text) => handleInputChange('username', text)}
              placeholderTextColor="#666"
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={userData.password}
              onChangeText={(text) => handleInputChange('password', text)}
              secureTextEntry
              placeholderTextColor="#666"
              autoCapitalize="none"
            />
          </View>
          
          <TouchableOpacity
            style={styles.switchButton}
            onPress={() => setIsLogin(!isLogin)}
          >
            <Text style={styles.switchText}>
              {isLogin ? 'New user? Create an account' : 'Already have an account? Sign in'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.mainButton} onPress={handleSubmit}>
            <Text style={styles.buttonText}>{isLogin ? 'Sign In' : 'Sign Up'}</Text>
          </TouchableOpacity>

          
        </ScrollView>
      </KeyboardAvoidingView>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  keyboardView: {
    flex: 1,
  },
  formContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 20,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#fff',
    width: '100%',
    height: 50,
    borderRadius: 10,
    marginBottom: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  mainButton: {
    backgroundColor: '#007AFF',
    width: '100%',
    height: 50,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#007AFF',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  switchButton: {
    padding: 10,
  },
  switchText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '600',
  },
  loggedInContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 30,
  },
  avatar: {
    width: 200,
    height: 200,
    borderRadius: 60,
    marginBottom: 20,
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
    width: '100%',
    height: 50,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FF3B30',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  profileContainer: {
    alignItems: 'center',
    padding: 20,
    justifyContent: 'center',
  },
  profilePicture: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
    borderWidth: 3,
    borderColor: '#ddd',
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  profileLabel: {
    fontSize: 16,
    color: '#888',
    fontWeight: '600',
    marginBottom: 5,

  },
  profileText: {
    fontSize: 18,
    color: '#333',
    marginBottom: 12,
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  editButton: {
    backgroundColor: '#007AFF',
    width: '100%',
    height: 50,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#007AFF',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
    width: '100%',
    height: 50,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    shadowColor: '#FF3B30',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  saveButton: {
    backgroundColor: '#28a745',
    width: '100%',
    height: 50,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  cancelButton: {
    backgroundColor: '#ccc',
    width: '100%',
    height: 50,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    backgroundColor: '#fff',
    width: '100%',
    height: 50,
    borderRadius: 10,
    marginBottom: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
});
