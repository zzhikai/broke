
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LandingScreen from '../components/AuthScreens/Landing';
import RegistrationPage from '../components/AuthScreens/Register';
import LoginPage from '../components/AuthScreens/Login';
import RegisterTwo from '../components/AuthScreens/RegisterTwo';
import loggedInStackNavigator from './loggedInStackNavigation';

const authStack = createStackNavigator();

export default function authStackNavigator() {
    return (
    <authStack.Navigator initialRouteName = "Landing">
        <authStack.Screen name = "Landing" component = {LandingScreen} options = {{headerShown: false}}/>
        <authStack.Screen name = "RegistrationPage" component = {RegistrationPage} options = {{headerShown: false}}/>
        <authStack.Screen name = "RegisterTwo" component = {RegisterTwo} options = {{headerShown: false}}/>
        <authStack.Screen name = "LoginPage" component = {LoginPage} options = {{headerShown: false}}/>
        <authStack.Screen name = "Home" component = {loggedInStackNavigator} options = {{headerShown: false}}/>
    </authStack.Navigator>
    
    )

}