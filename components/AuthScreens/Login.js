import React, { Component, useState } from 'react'
import {Alert, View, Button, TextInput } from 'react-native';  
import firebase from 'firebase';
import  { authStyles } from './Authstyle';
import {globalStyles} from '../../globalStyles/globalStyles';
import FlatButton from '../Buttons/button';
import {StatusBar} from 'expo-status-bar';

export default function Login({ navigation }) {
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  function onSignIn() {
    firebase.auth().signInWithEmailAndPassword(email, password)
    .then((result) => {
        console.log(result)
        navigation.navigate('Home')
    })
    .catch((error) => {
        console.log(error)
        loginFailedAlert(error.message);
    })
  }

  function loginFailedAlert(args) {
    Alert.alert(  
      'Login Failed',  
       args,
      [  
          {text: 'OK', onPress: () => console.log('OK Pressed')},  
      ]  
  );  
  }

   return (
        <View style ={globalStyles.authContainer}>
              <TextInput style={globalStyles.input}
                  placeholder = "e-Mail Address"
                  onChangeText = {setEmail}
               /> 
               <TextInput style={globalStyles.input}
                  placeholder = "Password"
                  secureTextEntry={true}
                  onChangeText = {setPassword}
               /> 
               <FlatButton
                 onPress = {() => onSignIn()}
                 text = "Sign In"
               />
               <StatusBar style = 'light'/>
            </View>
    )
}


