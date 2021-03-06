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
    const [Transaction, setTransactionAmount] = useState(0);
    const [CashAmount, setCashSavings] = useState(0);
    var today = new Date();
    var date = today.getDate() + '/' + (today.getMonth() + 1) + '/' + today.getFullYear();

    const userDoc = firebase.default.firestore().collection("Users").doc(firebase.auth().currentUser.uid);
    const finDoc = firebase.default.firestore().collection("Cash&Goals").doc(firebase.auth().currentUser.uid);  
    const userCollection = firebase.default.firestore().collection('Users').doc(firebase.auth().currentUser.uid).collection('Transactions');
    userDoc.onSnapshot((doc) => setCashSavings((doc.get("CashSavings"))))

    function makeDeposit() {
        userDoc.update({"CashSavings" : CashAmount + Transaction}).then((result) => 
        userCollection.add({
            TransAccount: "Cash",
            TransAmount: Transaction,
            TransType: "Deposit",
            TransDate: date
        })).then((result) => setModalVisible(false));
    }    
    
    function makeWithdrawal() {
        if (Transaction > CashAmount) {
          WithdrawalFailedAlert("Withdrawal Amount cannot exceed Savings")
        } else {
        userDoc.update({"CashSavings" : CashAmount - Transaction}).then((result) => 
        userCollection.add({
            TransAccount: "Cash",
            TransAmount: Transaction,
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

    const [data, setData] = useState({
        cash:'',
        isValidCashInput: true,
    })
    const [Cash, setCash] = useState('')

    const resetData = () => {
        setData({
            cash:'',
            isValidCashInput:true,
        })
    }

    const cashInputChange = (val) => {
        // not replacing minus sign
        let value = parseFloat(val.replace(/[ #*;,<>\{\}\[\]\\\/]/gi, ''))
   
        console.log("num of shares in decimal: " + value)
        if (parseFloat(value) > 0 && value != null) {
         setData({
           ...data,
           cash: value,
           isValidCashInput: true,
         })
    
         setTransactionAmount(value);
        } else {
         setData({
           ...data,
           number: value,
           isValidCashInput: false,
         })
        }
      }

      const makeTransactionHandle = (cash, type) => {
        // fix deposit not beinf able to be 0.21231 by parsefloat
        if (parseFloat(cash) < 0 || parseFloat(cash) == 0 || cash.length == 0 || cash.length == 0) {
             // numbers can become an empty string and end up passing
             setCash('')
             Alert.alert("Invalid Input Values!", 'Amount must be more than 0',[{text: 'Okay'}])
            
            //cashRef.clear()
            
            // resetData()
            return;
        } else {
    
          if (type == 'Withdrawal') {
            console.log("Making Withdrawal :" + cash)
            makeWithdrawal()
            resetData();
            
            setCashSavings(0);
            setCash('')
            return;
          
          } else if (type == 'Deposit') {
          // can get to sell stock when no input for price and number
            console.log("Making Deposit :" + cash)
            makeDeposit()
            resetData();
            
            setCashSavings(0);
            setCash('')
            return;
          } else {
            return;
          }
          
        }
      
    
       }  
    const cashRef = React.createRef()
    return (
        <View style={globalStyles.container}>
            
            <View style={globalStyles.cashContainer}>
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
                            value = {Cash}
                            //value = {data.cash}
                            // onPressOut= {(val) => cashInputChange(val)}
                            // onEndEditing = {(val) => cashInputChange(val)}
                            onChangeText = {(val) => (cashInputChange(val), setCash(val))}
                            //value = {data.cash}
                                // setT ransactionAmount((parseFloat(val)))}
                            
                            keyboardType = 'numeric'
                            ref = {cashRef}
                            
                        /> 
                        {!data.isValidCashInput ? 
                        <View> 
                        <Text style={{color: 'red', alignSelf:'center'}}>Please enter valid amount</Text>
                        </View> : null}

                        
                        <PlusButton
                            // change data.cash into cash setCash, once completely backspace still got no residual value to add
                            onPress = {() =>  (makeTransactionHandle(Cash, 'Deposit'))}
                            text = "Make Deposit"
                            
                        />

                        <MinusButton
                            onPress = {() => makeTransactionHandle(Cash, 'Withdrawal')}
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
