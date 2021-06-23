import { StatusBar } from 'expo-status-bar';
import React, { useEffect, Component, useState} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as firebase from 'firebase';
import * as Authentication from "./components/api/auth";

import authStackNavigator from './routes/authStackNavigation';
import loggedInStackNavigator from './routes/loggedInStackNavigation';


const RootStack = createStackNavigator();
const stockStack = createStackNavigator();

/*const stockStackScreen = () => (
  <stockStack.Navigator>
    <stockStack.Screen name = "Stock" component= {StockScreen} options ={{headerShown: false}} />
    <stockStack.Screen name = "StockTransaction" component= {StockTransactionScreen} options ={{headerShown: false}} />
    <stockStack.Screen name = "TestFeature" component= {TestFeatureScreen} options ={{headerShown: false}} />
  </stockStack.Navigator>

)*/

const RootStackScreen = ({props}) => (
  <RootStack.Navigator headerMode="none">
    {props ? (
      <RootStack.Screen name= "App" component = {loggedInStackNavigator}></RootStack.Screen>
    ): (
      <RootStack.Screen name= "auth" component = {authStackNavigator}></RootStack.Screen>
    )}
  </RootStack.Navigator>
)

export default function App() {
  const [isLoggedIn, setLogin] = useState(false)

  useEffect(() => {
   
    return Authentication.setOnAuthStateChanged(setLogin);
  }, []);
  
  
  
  return (
    <NavigationContainer>
      <RootStackScreen props = {isLoggedIn}/>
    </NavigationContainer>
  )

  } 

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

