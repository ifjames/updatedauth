import React, { useState, useRef } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Animated, Dimensions, StatusBar } from "react-native";

const screenWidth = Dimensions.get("window").width;

export default function HomeScreen({ navigation, route }) {
  const { role } = route.params; // 'student' or 'teacher'
  StatusBar.setHidden(true);
  const [menuVisible, setMenuVisible] = useState(false); // Track menu visibility
  const menuAnimation = useRef(new Animated.Value(-screenWidth)).current; // Initial position off-screen
  const isAnimating = useRef(false); // To track if an animation is in progress

  const toggleMenu = () => {
    if (isAnimating.current) return; // Prevent toggle if animation is in progress

    isAnimating.current = true; // Start animation

    if (menuVisible) {
      // Close menu
      Animated.timing(menuAnimation, {
        toValue: -screenWidth,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setMenuVisible(false); // Update state after animation completes
        isAnimating.current = false; // Reset animation flag
      });
    } else {
      // Open menu
      Animated.timing(menuAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setMenuVisible(true); // Update state after animation completes
        isAnimating.current = false; // Reset animation flag
      });
    }
  };

  const handleLogout = () => {
    navigation.replace("LoginRegister"); // Navigate back to the login screen
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuIcon} onPress={toggleMenu}>
          <View style={styles.menuBar} />
          <View style={styles.menuBar} />
          <View style={styles.menuBar} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Image
            source={require("../assets/profileicon.png")}
            style={styles.profileIcon}
          />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.welcomeSection}>
          <Text style={styles.greeting}>Hello,</Text>
          <Text style={styles.userName}>
            {role === "student" ? "Camila!" : "Teacher!"}
          </Text>
        </View>
        <View style={styles.campusNavigation}>
          <Text style={styles.campusTitle}>Campus Navigation</Text>
          <TouchableOpacity>
            <Text style={styles.openMap}>Open Map &gt;</Text>
          </TouchableOpacity>
          <Image
            source={require("../assets/campusmap.png")}
            style={styles.campusImage}
          />
        </View>
        <View style={styles.needSection}>
          <Text style={styles.needTitle}>What do you need?</Text>
          <View style={styles.options}>
            <TouchableOpacity style={styles.option}>
              <Image
                source={require("../assets/news.png")}
                style={styles.optionIcon}
              />
              <Text style={styles.optionText}>News</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.option}>
              <Image
                source={require("../assets/events.png")}
                style={styles.optionIcon}
              />
              <Text style={styles.optionText}>Events</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.option}>
              <Image
                source={require("../assets/schedule.png")}
                style={styles.optionIcon}
              />
              <Text style={styles.optionText}>Schedule</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Animated Menu */}
      <Animated.View
        style={[styles.menu, { transform: [{ translateX: menuAnimation }] }]}
      >
        <TouchableOpacity style={styles.closeMenu} onPress={toggleMenu}>
          <Text style={styles.closeMenuText}>✕</Text>
        </TouchableOpacity>
        <View style={styles.menuHeader}>
          <Image
            source={require("../assets/profileicon.png")}
            style={styles.menuProfileIcon}
          />
          <View>
            <Text style={styles.menuName}>
              {role === "student" ? "Camila" : "Teacher"}
            </Text>
            <Text style={styles.menuRole}>
              {role === "student" ? "Student" : "Teacher"}
            </Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
            <Text style={styles.arrowButton}>&gt;</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>General</Text>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuItemText}>Language</Text>
            <Text style={styles.menuItemValue}>English</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate("FAQ")}
          >
            <Text style={styles.menuItemText}>FAQ</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF8F1",
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    marginTop: 10,
  },
  menuIcon: {
    width: 30,
    height: 20,
    justifyContent: "space-between",
  },
  menuBar: {
    width: "100%",
    height: 3,
    backgroundColor: "#800000",
    borderRadius: 2,
  },
  profileIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E6E6E6",
  },
  welcomeSection: {
    padding: 20,
    backgroundColor: "#800000",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  greeting: {
    fontSize: 18,
    color: "#fff",
  },
  userName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
  },
  campusNavigation: {
    margin: 20,
    backgroundColor: "#FFE4D9",
    borderRadius: 15,
    padding: 20,
  },
  campusTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  openMap: {
    fontSize: 16,
    color: "#800000",
    textAlign: "right",
    marginBottom: 10,
  },
  campusImage: {
    width: "100%",
    height: 150,
    resizeMode: "contain",
    borderRadius: 10,
  },
  needSection: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  needTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  options: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  option: {
    alignItems: "center",
    backgroundColor: "#FFF2E5",
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderRadius: 10,
    width: "30%",
  },
  optionIcon: {
    width: 45,
    height: 45,
    marginBottom: 10,
  },
  optionText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#800000",
  },
  menu: {
    position: "absolute",
    width: screenWidth,
    height: "100%",
    backgroundColor: "#fff",
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 10,
    zIndex: 10,
    top: 0,
    left: 0,
  },
  closeMenu: {
    alignSelf: "flex-end",
    padding: 10,
    top: 20,
    right: 20,
  },
  closeMenuText: {
    fontSize: 24,
    color: "#800000",
  },
  menuHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  menuProfileIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#E6E6E6",
    marginRight: 10,
  },
  menuName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  menuRole: {
    fontSize: 14,
    color: "#666",
  },
  arrowButton: {
    fontSize: 24,
    color: "#800000",
    position: "absolute",  // Absolute positioning
    top: "-30%",  // Optional: Vertically center the button
    transform: [{ translateX: 15 }],  // Optional: Adjust for perfect centering
  },
  menuSection: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  menuItemText: {
    fontSize: 16,
    color: "#333",
  },
  menuItemValue: {
    fontSize: 16,
    color: "#666",
  },
  logoutButton: {
    marginTop: "auto",
    alignSelf: "center",
    backgroundColor: "#800000",
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 5,
    marginBottom: 20,
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
