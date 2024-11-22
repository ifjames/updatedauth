import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";

export default function SplashScreen() {
  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/logo.png")} // Replace with your logo image path
        style={styles.logo}
      />
      <Text style={styles.title}>SMART CAMPUS CONNECT</Text>
      <Text style={styles.subtitle}>University of Batangas</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#800000", // Maroon background color
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 100,
    height: 100,
  },
  title: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
  },
  subtitle: {
    color: "white",
    fontSize: 16,
    marginTop: 5,
  },
});
