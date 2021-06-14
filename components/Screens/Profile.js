import React from 'react'
import { View , Text, Button} from 'react-native'
import * as firebase from 'firebase';
import { screenStyles } from './screenStyles';
import FlatButton from '../Buttons/button';
import {globalStyles} from '../../globalStyles/globalStyles';
import {StatusBar} from 'expo-status-bar';


export default function Profile() {

  function signOutUser(){
    firebase.default.auth().signOut();
  }

    return (
       // do authstyle container first since only 1 button now
       <View style = {globalStyles.authContainer}>
            <FlatButton 
              
              text = "Logout"
              onPress = {() => signOutUser()}    
           / >
            <StatusBar style = 'light'/>
        </View>
    )
}
