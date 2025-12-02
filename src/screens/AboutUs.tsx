import React from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, ScrollView, Image, ImageSourcePropType, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// Define interface for type safety
interface TeamMember {
  name: string;
  role: string;
  quote: string;
  image: ImageSourcePropType; // Type for require('./path')
}

const { width } = Dimensions.get('window');

export default function AboutUsScreen() {
  const navigation = useNavigation();

  // You can customize your team members here
  // Make sure to add your images to assets/ folder or similar
  const teamMembers: TeamMember[] = [
    { 
      name: "Jon Jon Albao", 
      role: "Backend Dev", 
      quote: "Bachelor of Science in Information Technology\nTanauan Leyte",
      // Replace with your actual image path, e.g., require('../../assets/dev1.png')
      image: require('../../assets/Albao.jpg') 
    },
    { 
      name: "Airalaine De Paz", 
      role: "Flowchart Designer", 
      quote: "Bachelor of Science in Information Technology\nDagami Leyte",
      image: require('../../assets/Aira.jpg') 
    },
    { 
      name: "Nicole Joy Canayon", 
      role: "UI Designer", 
      quote: "Bachelor of Science in Information Technology\nTanauan Leyte",
      image: require('../../assets/Nicole.png') 
    },
    { 
      name: "Anthony Virgo", 
      role: "Tester", 
      quote: "Bachelor of Science in Information Technology\nTanauan Leyte",
      image: require('../../assets/Virgo.png') 
    },
    { 
      name: "Aljon Abines", 
      role: "Adviser", 
      quote: "Instructor I\nAdvance Database Systems",
      image: require('../../assets/Abines.jpg') 
    },
  ];

  return (
    <ImageBackground
      source={require('../../assets/background.png')}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>ABOUT US</Text>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.description}>
            Flip Rush was created with passion to test your memory and speed. 
            Thank you for playing!
          </Text>

          <View style={styles.teamContainer}>
            <Text style={styles.sectionTitle}>THE TEAM</Text>
            
            {teamMembers.map((member, index) => (
              <View key={index} style={styles.memberCard}>
                {/* Developer Image */}
                <View style={styles.imageContainer}>
                  <Image source={member.image} style={styles.avatar} resizeMode="cover" />
                </View>
                
                <Text style={styles.memberName}>{member.name}</Text>
                <Text style={styles.memberRole}>{member.role}</Text>
                {/* Removed quotes around member.quote */}
                <Text style={styles.memberQuote}>{member.quote}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.version}>Version 1.0.0</Text>
        </ScrollView>

        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backText}>BACK TO MENU</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)', // Slightly darker overlay for better contrast
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    color: '#fff',
    fontFamily: 'PressStart2P',
    marginBottom: 30,
    textShadowColor: '#7b2cff',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 0,
  },
  scrollContent: {
    alignItems: 'center',
    paddingHorizontal: 20,
    width: '100%',
  },
  description: {
    color: '#ddd',
    fontFamily: 'PressStart2P',
    fontSize: 12, // Increased form 10
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 30,
    maxWidth: '90%',
  },
  teamContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    color: '#7b2cff',
    fontFamily: 'PressStart2P',
    fontSize: 18, // Increased from 16
    marginBottom: 25,
  },
  memberCard: {
    backgroundColor: '#222',
    width: width * 0.9, // Fixed width based on screen size to ensure uniformity
    maxWidth: 400, // Cap width for larger screens
    height: 380, // Fixed height ensures all cards are the same size regardless of text length
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#444',
    marginBottom: 25, // Consistent spacing relative to each other
    alignItems: 'center',
    justifyContent: 'center', // Centers content vertically within the fixed height
  },
  imageContainer: {
    width: 120, // Increased from 80
    height: 120, // Increased from 80
    borderRadius: 60,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: '#fff',
    marginBottom: 15,
    backgroundColor: '#333',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  memberName: {
    color: '#fff',
    fontFamily: 'PressStart2P',
    fontSize: 16, // Increased from 12
    marginBottom: 8,
    textAlign: 'center',
  },
  memberRole: {
    color: '#aaa',
    fontFamily: 'PressStart2P',
    fontSize: 12, // Increased from 10
    marginBottom: 12,
    textAlign: 'center',
  },
  memberQuote: {
    color: '#888',
    fontStyle: 'italic',
    fontSize: 12, // Increased from 10
    textAlign: 'center',
    lineHeight: 20, // Better line height for multi-line quotes
  },
  version: {
    color: '#555',
    fontSize: 12,
    fontFamily: 'PressStart2P',
    marginTop: 20,
    marginBottom: 40,
  },
  backButton: {
    backgroundColor: '#ff4444',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#fff',
  },
  backText: {
    color: '#fff',
    fontFamily: 'PressStart2P',
    fontSize: 14,
  },
});