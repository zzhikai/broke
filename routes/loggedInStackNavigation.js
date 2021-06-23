import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MyBottomScreen from './materialBottomTab';
import CashScreen from '../components/Screens/Cash';
import DebtScreen from '../components/Screens/Debt';
import StockScreen from '../components/Screens/Stocks';

const loggedInStack = createStackNavigator();

export default function loggedInStackNavigator() {
    return (
    <loggedInStack.Navigator initialRouteName = "Home">
        <loggedInStack.Screen name = "Home" component = {MyBottomScreen} options = {{
            headerTransparent: true,
            headerTintColor: 'white',
            headerShown: false}}/> 
            
        <loggedInStack.Screen name = "Stocks" component ={StockScreen} options = {{headerTransparent: true,
            headerTintColor: 'white',
            headerShown: true}}/> 
        <loggedInStack.Screen name = "Debt" component ={DebtScreen} options = {{headerShown: false}}/>
        <loggedInStack.Screen name = "Cash" component ={CashScreen} options = {{headerTransparent: true,
            headerTintColor: 'white',
            headerShown: true}}/> 
    </loggedInStack.Navigator>
    
    )



}