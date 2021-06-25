import React, {useState} from 'react'
import {View, Text, Modal, TextInput, Alert} from 'react-native';
import {globalStyles} from '../../globalStyles/globalStyles';
import {StatusBar} from 'expo-status-bar';
import FlatButton from '../Buttons/button';
import MinusButton from '../Buttons/negativeButton';
import PlusButton from '../Buttons/positiveButton';
import * as firebase from 'firebase';

export default function Cash() {

    const [modalVisible, setModalVisible] = useState(false); 
    const [transamt, setTransactionAmount] = useState(0);
    const [CashAmount, setCashSavings] = useState(0);
    var today = new Date();
    var date = today.getDate() + '/' + (today.getMonth() + 1) + '/' + today.getFullYear();

    const userDoc = firebase.default.firestore().collection("Users").doc(firebase.auth().currentUser.uid);
    const finDoc = firebase.default.firestore().collection("Cash&Goals").doc(firebase.auth().currentUser.uid);  
    const userCollection = firebase.default.firestore().collection('Users').doc(firebase.auth().currentUser.uid).collection('Transactions');
    userDoc.onSnapshot((doc) => setCashSavings((doc.get("CashSavings"))))

    function makeDeposit() {
        userDoc.update({"CashSavings" : CashAmount + transamt}).then((result) => 
        userCollection.add({
            TransAccount: "Cash",
            TransAmount: transamt,
            TransType: "Deposit",
            TransDate: date
        })).then((result) => setModalVisible(false));
    }    
    
    function makeWithdrawal() {
        if (transamt > CashAmount) {
          WithdrawalFailedAlert("Withdrawal Amount cannot exceed Savings")
        } else {
        userDoc.update({"CashSavings" : CashAmount - transamt}).then((result) => 
        userCollection.add({
            TransAccount: "Cash",
            TransAmount: transamt,
            TransType: "Withdrawal",
            TransDate: date
        })).then((result) => setModalVisible(false));
        }
    }

    function WithdrawalFailedAlert(args) {
        Alert.alert(  
            'Transaction Failed',  
             args,
            [  
                {text: 'OK', onPress: () => {}},  
            ]  
       );     
    }
    
    return (
        <View style={globalStyles.container}>
            
            <View style={globalStyles.chartContainer}>
                <Text style={{fontSize: 30, color: '#ddd'}}> Current Balance: {CashAmount}</Text>
            </View>
            
        
                <Modal 
                    animationType = "slide"
                    visible = {modalVisible}
                    style = {globalStyles}
                    onRequestClose = {() => setModalVisible(false)}
                >
                    <View style={globalStyles.container}>
              
                        
                        <TextInput style={globalStyles.input}
                            placeholder = "Enter Transaction Amount"
                            onChangeText = {(val) => setTransactionAmount((parseFloat(val)))}
                            keyboardType = 'numeric'
                            
                        /> 
                        
                        <PlusButton
                            onPress = {() => makeDeposit()}
                            text = "Make Deposit"
                            
                        />

                        <MinusButton
                            onPress = {() => makeWithdrawal()}
                            text = "Make Withdrawal" 
                        />

                    </View>

                 </Modal>
            

            <FlatButton
                 onPress = {() => setModalVisible(!modalVisible)}
                 text= "Make Transaction"
            />
            <StatusBar style = 'light'/>
        </View>
    )
}
