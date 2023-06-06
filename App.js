import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons'; 
import LoginScreen from './components/connexion';
import Apropos from './components/Apropos';
import Acceuil from './components/Acceuil';
import { createDrawerNavigator } from '@react-navigation/drawer';


import Inscription from './components/Inscription';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        tabBarOptions={{
          style: {
            backgroundColor: '#ffb3ec',
          },
          showLabel: false, 
        }}
      >
        <Tab.Screen
          name="Accueil"
          component={Acceuil}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home" size={size} color={'#0000FF'} /> 
            ),
          }}
        />
        <Tab.Screen
          name="Connexion"
          component={LoginScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="key" size={size} color={'#bf00ff'} /> 
            ),
          }}
        />
        <Tab.Screen
          name="Inscription"
          component={Inscription}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person-add" size={size} color={'#0077b3'} /> 
            ),
          }}
        />
        <Tab.Screen
          name="À Propos"
          component={Apropos}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="information-circle" size={size} color={'#cc0099'} /> 
            ),
          }}
        />
        
      </Tab.Navigator>
    </NavigationContainer>
  );
}
