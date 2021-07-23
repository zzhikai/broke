import React, { Component, useState } from 'react'
import { Alert, View, Button, TextInput } from 'react-native';  
import firebase from 'firebase';
import { useNavigation } from '@react-navigation/core';
import  { authStyles } from './Authstyle';
import FlatButton from '../Buttons/button'
import { globalStyles} from '../../globalStyles/globalStyles';
import { StatusBar } from 'expo-status-bar';
import { FloatingLabelInput } from 'react-native-floating-label-input';

export default function Register({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [TargetNetWorth, setTargetNetWorth] = useState(0);
  const [CashSavings, setCashSavings] = useState(0);
  const [TotalStockValue, setTotalStockValue] = useState(0);
  const [Debt, setDebt] = useState(0);
  // const {name, email, password} = route.params;
  

function storeMoney() {
   firebase.firestore().collection("Users")
   .doc(firebase.auth().currentUser.uid)
   .update({
     CashSavings,
     TargetNetWorth,
     TotalStockValue,
     Debt,
     // test debt 
   })
   /*.then(() => {
     firebase.firestore().collection('Users').doc(firebase.auth().currentUser.uid)
     .collection('Transactions')
     .add({
       TransAccount: "Cash",
       TransAmount: CashSavings,
       TransType: "Deposit"
       
     })
   })*/
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
     storeMoney();
     
     navigation.navigate("Home")
     // navigation.navigate("RegisterTwo");
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
         {text: 'OK', onPress: () => console.log('OK Pressed')},  
     ]  
);  
}

  return (
    <View style={globalStyles.authContainer}>
                <FloatingLabelInput 
                label="Name"
                value={name}

                onChangeText= {setName}
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
                  // placeholderTextColor= 'black'
                  placeholder = "name"
                  onChangeText = {setName}
              /> 
               <TextInput  style={globalStyles.input}
                  // placeholderTextColor= 'black'
                  placeholder = "email"
                  onChangeText = {setEmail}
               /> 
               <TextInput  style={globalStyles.input}
                  // placeholderTextColor= 'black'
                  placeholder = "password"
                  secureTextEntry={true}
                  onChangeText = {setPassword}
               /> */}
               <FlatButton
                 
                 onPress = {() => {onSignUp()}}
                 text="Sign Up"
                 // onPress = {() => navigation.navigate("RegisterTwo", {name: name, email: email, password: password})}
                 // text= "Next"
               />
               <StatusBar style = 'light'/>
            </View>
  )
}



