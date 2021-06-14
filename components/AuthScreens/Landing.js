import React from 'react'
import { Image, StyleSheet,Text,View,Button } from 'react-native';
import  { authStyles } from './Authstyle';
import {globalStyles} from '../../globalStyles/globalStyles';
import FlatButton from '../Buttons/button';
import { StatusBar }  from 'expo-status-bar'

export default function Landing( { navigation }) {
    return (
        <View style = {globalStyles.authContainer}>
          
           <FlatButton
              text="Register"
              onPress = {() => navigation.navigate("RegistrationPage")}    
           />
            <FlatButton
              text="Login"
              onPress = {() => navigation.navigate("LoginPage")}    
           />
           <StatusBar style = 'light'/>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#d9d9d9',
      alignItems: 'center',
      justifyContent: 'center',
    },
    });

