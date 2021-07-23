import React, { Component, useState } from 'react'
import {Alert, View, Button, TextInput } from 'react-native';  
import firebase from 'firebase';
import  { authStyles } from './Authstyle';
import {globalStyles} from '../../globalStyles/globalStyles';
import FlatButton from '../Buttons/button';
import {StatusBar} from 'expo-status-bar';
import { FloatingLabelInput } from 'react-native-floating-label-input';

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
              <FloatingLabelInput 
                label="Email Address"
                value={email}
                onChangeText= {setEmail}
                containerStyles={{
                  backgroundColor: 'white',
        // borderWidth: 1,
                  alignSelf: 'center',
                  justifyContent: 'center',
                  borderColor: '#a6a6a6',
                  borderWidth: 1,
                  margin: 5,
                  padding: 10,
                  borderRadius: 6,
                  paddingLeft: 3,
                }}
                customLabelStyles={{
                  fontSizeBlurred: 16,
                  fontSizeFocused: 12,
                  
                }}
                inputStyles={{
                  fontSize: 18,
                  color: 'black',
                  paddingLeft: 5,
                }}
              />
              {/*<TextInput style={globalStyles.input}
                  placeholder = "e-Mail Address"
                  onChangeText = {setEmail}
   /> */}
               <FloatingLabelInput 
                label="Password"
                value={password}
                isPassword
                onChangeText= {setPassword}
                containerStyles={{
                  backgroundColor: 'white',
        // borderWidth: 1,
                  alignSelf: 'center',
                  justifyContent: 'center',
                  borderColor: '#a6a6a6',
                  borderWidth: 1,
                  margin: 5,
                  padding: 10,
                  borderRadius: 6,
                  paddingLeft: 3,
                  
                }}
                customLabelStyles={{
                  fontSizeBlurred: 16,
                  fontSizeFocused: 12,
                }}
                inputStyles={{
                  fontSize: 18,
                  color: 'black',
                  paddingLeft: 5,
                }}
              />
               
               {/*<TextInput style={globalStyles.input}
                  placeholder = "Password"
                  secureTextEntry={true}
                  onChangeText = {setPassword}
              /> */}
               <FlatButton
                 onPress = {() => onSignIn()}
                 text = "Sign In"
               />
               <StatusBar style = 'light'/>
            </View>
    )
}


