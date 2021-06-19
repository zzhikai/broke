import { StatusBar } from 'expo-status-bar';
import React, { useEffect, Component, useState} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as firebase from 'firebase';
import MyBottomScreen from './routes/materialBottomTab';
import * as Authentication from "./components/api/auth";
import LandingScreen from './components/AuthScreens/Landing';
import RegistrationPage from './components/AuthScreens/Register';
import LoginPage from './components/AuthScreens/Login';
import RegisterTwo from './components/AuthScreens/RegisterTwo';
import CashScreen from './components/Screens/Cash';
import DebtScreen from './components/Screens/Debt';
import StockScreen from './components/Screens/Stocks';
import StockTransactionScreen from './components/Screens/StockTransaction';


const authStack = createStackNavigator();
const loggedInStack = createStackNavigator();
const RootStack = createStackNavigator();
const stockStack = createStackNavigator();

const stockStackScreen = () => (
  <stockStack.Navigator>
    <stockStack.Screen name = "Stock" component= {StockScreen} options ={{headerShown: false}} />
    <stockStack.Screen name = "StockTransaction" component= {StockTransactionScreen} options ={{headerShown: false}} />
  </stockStack.Navigator>

)

const authStackScreen = () => (
 <authStack.Navigator initialRouteName = "Landing">
    <authStack.Screen name = "Landing" component = {LandingScreen} options = {{headerShown: false}}/>
    <authStack.Screen name = "RegistrationPage" component = {RegistrationPage} options = {{headerShown: false}}/>
    <authStack.Screen name = "RegisterTwo" component = {RegisterTwo} options = {{headerShown: false}}/>
    <authStack.Screen name = "LoginPage" component = {LoginPage} options = {{headerShown: false}}/>
    <authStack.Screen name = "Home" component = {loggedInStackScreen} options = {{headerShown: false}}/>
 </authStack.Navigator>
)
// put Home headershown as false, so that it will not appear on the other pages in bottomTabNav bar
// StockScreen changed to stockStackScreen to allow for nested stack navigator
const loggedInStackScreen = () => (
 <loggedInStack.Navigator initialRouteName = "Home">
   <loggedInStack.Screen name = "Home" component = {MyBottomScreen} options = {{
     headerTransparent: true,
     headerTintColor: 'white',
     headerShown: false}}/> 
    
   <loggedInStack.Screen name = "Stocks" component ={stockStackScreen} options = {{headerTransparent: true,
     headerTintColor: 'white',
     headerShown: true}}/> 
   <loggedInStack.Screen name = "Debt" component ={DebtScreen} options = {{headerShown: false}}/>
   <loggedInStack.Screen name = "Cash" component ={CashScreen} options = {{headerTransparent: true,
     headerTintColor: 'white',
     headerShown: true}}/> 
 </loggedInStack.Navigator>
) 

const RootStackScreen = ({props}) => (
  <RootStack.Navigator headerMode="none">
    {props ? (
      <RootStack.Screen name= "App" component = {loggedInStackScreen}></RootStack.Screen>
    ): (
      <RootStack.Screen name= "auth" component = {authStackScreen}></RootStack.Screen>
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

