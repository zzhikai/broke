import React, { Component, useState } from 'react'
import { Alert,View, Button, TextInput } from 'react-native';  
import firebase from 'firebase';
import { useNavigation } from '@react-navigation/core';
import  { authStyles } from './Authstyle';
import { globalStyles} from '../../globalStyles/globalStyles';
import FlatButton from '../Buttons/button';
import {StatusBar} from 'expo-status-bar';
import { parse } from 'react-native-svg';
import Cash from '../Screens/Cash';

export default function RegisterTwo({ route, navigation }) {
  const [TargetNetWorth, setTargetNetWorth] = useState(0);
  const [CashSavings, setCashSavings] = useState(0);
  const {name, email, password} = route.params;

  function storeMoney() {
    firebase.firestore().collection("Users")
    .doc(firebase.auth().currentUser.uid)
    .update({
      CashSavings,
      TargetNetWorth
    }).then(() => {
      firebase.firestore().collection('Users').doc(firebase.auth().currentUser.uid)
      .collection('Transactions')
      .add({
        TransAccount: "Cash",
        TransAmount: CashSavings,
        TransType: "Deposit"
        
      })
    })
  }

  

  function onSignUp() {
    firebase.default.auth().createUserWithEmailAndPassword(email, password)
    .then((result) => {
      firebase.firestore().collection("Users")
      .doc(firebase.auth().currentUser.uid)
      .set({
          name,
          email
      }) 
      console.log(result)
      // need to create the stock collection

      storeMoney();
      navigation.navigate("Home");
    })
    .catch((error) => {
        console.log(error)
        loginFailedAlert(error.message)
    })
  }
   
 function loginFailedAlert(args) {
    Alert.alert(  
      'Registration Failed',  
       args,
      [  
          {text: 'OK', onPress: () => navigation.navigate("RegistrationPage")},  
      ]  
 );  
 }

  

  
  
  return (
    <View style={globalStyles.authContainer}>
               <TextInput style={globalStyles.input}
                  placeholder = "Target Net Worth"
                  onChangeText = {(val) => setTargetNetWorth(parseInt(val))}
                  keyboardType = 'numeric'
               /> 
               <TextInput style={globalStyles.input}
                  placeholder = "Cash Savings"
                  onChangeText = {(val) => setCashSavings(parseInt(val))}
                  keyboardType = 'numeric'
               /> 
               <FlatButton
                 onPress = {() => {onSignUp()}}
                 text= "Sign Up"
               />
               <StatusBar style = 'light'/>
            </View>
  )
}

