import React, {useState} from 'react'
import { View , Text, Button, Modal, TextInput} from 'react-native'
import * as firebase from 'firebase';
import { screenStyles } from './screenStyles';
import FlatButton from '../Buttons/button';
import {globalStyles} from '../../globalStyles/globalStyles';
import {StatusBar} from 'expo-status-bar';


export default function Profile() {

  const [modalVisible, setModalVisible] = useState(false); 
  const [newGoal, setNewGoal] = useState(0);
  const [goal, setGoal] = useState(0);
  const userDoc = firebase.default.firestore().collection("Users").doc(firebase.auth().currentUser.uid);
  // firebase.default.firestore().collection("Users").doc(firebase.auth().currentUser.uid).collection("Cash&Goals")
  // .collection("Cash&Goals").doc(firebase.auth().currentUser.uid);
  userDoc.onSnapshot((doc) => setGoal(doc.get('TargetNetWorth')))
  function signOutUser(){
    firebase.default.auth().signOut();
  }

  function updateTarget() {
    userDoc.update({"TargetNetWorth" : newGoal}).then((result) => setModalVisible(false));
  }

    return (
       // do authstyle container first since only 1 button now
       <View style = {globalStyles.authContainer}>
           
            <FlatButton 
              
              text = "Logout"
              onPress = {() => signOutUser()}    
           / >

            <FlatButton 
              
              text = "Edit Target"
              onPress = {() => setModalVisible(true)} 
            / >
            
            
            <Modal
              animationType = "slide"
              visible = {modalVisible}
              style = {globalStyles.container}
              onRequestClose = {() => setModalVisible(false)}
            >
               <View style = {globalStyles.container}>
                <Text style={globalStyles.titleText}>Current Goal: {goal}</Text>
                <TextInput 
                  style={globalStyles.input}
                  placeholder = "Enter New Goal"
                  onChangeText = {(val) => setNewGoal((parseInt(val)))}
                  keyboardType = 'numeric'
                /> 

                <FlatButton
                  text = "Edit Goal"
                  onPress = {() => updateTarget()}
                />
               
              </View>

            </Modal>
        

             

            <StatusBar style = 'light'/>
        </View>
    )
}
