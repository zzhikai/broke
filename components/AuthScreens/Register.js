import React, { Component, useState } from 'react'
import { Alert, View, Button, TextInput } from 'react-native';  
import firebase from 'firebase';
import { useNavigation } from '@react-navigation/core';
import  { authStyles } from './Authstyle';
import FlatButton from '../Buttons/button'
import { globalStyles} from '../../globalStyles/globalStyles';
import { StatusBar } from 'expo-status-bar';

export default function Register({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
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
     navigation.navigate("RegisterTwo");
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
               <TextInput style={globalStyles.input}
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
               /> 
               <FlatButton
                 onPress = {() => navigation.navigate("RegisterTwo", {name: name, email: email, password: password})}
                 text= "Next"
               />
               <StatusBar style = 'light'/>
            </View>
  )
}


/*export class Register extends Component {
    constructor(props){
        super(props);
        
        this.state = {
           email: '',
           password: '',
           name: '',
        }

       this.onSignUp = this.onSignUp.bind(this) 
    }
   

   
    onSignUp() {
      const { email, password, name } = this.state;
      firebase.default.auth().createUserWithEmailAndPassword(email, password)
      .then((result) => {
        firebase.firestore().collection("Users")
        .doc(firebase.auth().currentUser.uid)
        .set({
            name,
            email
        }) 
        console.log(result)
      })
      .catch((error) => {
          console.log(error)
      })
    }
    
    render() {
        return (
            <View>
               <TextInput
                  placeholder = "name"
                  onChangeText = {(name) => this.setState({name})}
               /> 
               <TextInput
                  placeholder = "email"
                  onChangeText = {(email) => this.setState({email})}
               /> 
               <TextInput
                  placeholder = "password"
                  secureTextEntry={true}
                  onChangeText = {(password) => this.setState({password})}
               /> 
               <Button
                 onPress = {() => navigation.navigate('RegisterTwo'), {name, email, password}}
                 title = "Next"
               />
            </View>
        )
    }
}

export default Register
*/


