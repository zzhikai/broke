import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import HomeScreen from '../components/Screens/Home';
import ProfileScreen from '../components/Screens/Profile';
import TransactionScreen from '../components/Screens/Transactions';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import React from 'react';
import { Text, View, Image, TouchableOpacity, StyleSheet, } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

const Tab = createMaterialBottomTabNavigator();

export default function MyTabs() {
  return (
    <Tab.Navigator 
        
        initialRouteName="Home"
        //activeColor="#e91e63"
        activeColor= '#333'
        barStyle={{backgroundColor: 'white'}}
        >
      <Tab.Screen name="Home" component={HomeScreen} 
        options={{
            tabBarLabel:'Home',
            tabBarIcon: ({color}) => (
                <MaterialCommunityIcons name="home" color={color} size={26} />
            ), 
        }}
        />
      <Tab.Screen name="Transaction" component={TransactionScreen} 
        options={{
            tabBarLabel:'Transaction',
            tabBarIcon: ({color}) => (
                <MaterialCommunityIcons name="format-list-bulleted" color={color} size={26} />
        ), 
        }}
        />
      <Tab.Screen name="Profile" component={ProfileScreen} 
        options={{
            tabBarLabel:'Profile',
            tabBarIcon: ({color}) => (
                <MaterialCommunityIcons name="account" color={color} size={26} />
        ), 
        }}
        />
  

    </Tab.Navigator>
  );
}