import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // accounts
  const accounts = {
    student: {
      email: "student1@ub.edu.ph",
      password: "student123",
      role: "student",
    },
    teacher: {
      email: "teacher1@ub.edu.ph",
      password: "teacher123",
      role: "teacher",
    },
  };

  const handleLogin = () => {
    if (
      email === accounts.student.email &&
      password === accounts.student.password
    ) {
      Alert.alert("Login Successful", "Welcome Student!", [
        {
          text: "OK",
          onPress: () => navigation.navigate("Home", { role: "student" }),
        },
      ]);
    } else if (
      email === accounts.teacher.email &&
      password === accounts.teacher.password
    ) {
      Alert.alert("Login Successful", "Welcome Teacher!", [
        {
          text: "OK",
          onPress: () => navigation.navigate("Home", { role: "teacher" }),
        },
      ]);
    } else {
      Alert.alert("Login Failed", "Invalid email or password.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Log in</Text>
      <Text style={styles.subtitle}>Welcome back you've been missed!</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#800000",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#800000",
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
