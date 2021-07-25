import React, {useState} from 'react'
import {View, Text, Modal, TextInput, Alert} from 'react-native';
import {globalStyles} from '../../globalStyles/globalStyles';
import {StatusBar} from 'expo-status-bar';
import FlatButton from '../Buttons/button';
import MinusButton from '../Buttons/negativeButton';
import PlusButton from '../Buttons/positiveButton';
import * as firebase from 'firebase';

export default function Debt() {

    const [modalVisible, setModalVisible] = useState(false); 
    const [Transaction, setTransactionAmount] = useState(0);
    const [Debt, setDebt] = useState(0);
    var today = new Date();
    var date = today.getDate() + '/' + (today.getMonth() + 1) + '/' + today.getFullYear();

    const userDoc = firebase.default.firestore().collection("Users").doc(firebase.auth().currentUser.uid); // access all the fields in the doc

    const userCollection = firebase.default.firestore().collection('Users').doc(firebase.auth().currentUser.uid).collection('Transactions');
    userDoc.onSnapshot((doc) => setDebt((doc.get("Debt"))))

    function makeDeposit() {
        userDoc.update({"Debt" : Debt + Transaction}).then((result) => 
        userCollection.add({
            TransAccount: "Debt",
            TransAmount: Transaction,
            TransType: "Add",
            TransDate: date
        })).then((result) => setModalVisible(false));
    }    
    
    function makeWithdrawal() {
        if (Transaction > Debt) {
          WithdrawalFailedAlert("Paid amount cannot exceed Debt")
        } else {
        userDoc.update({"Debt" : Debt - Transaction}).then((result) => 
        userCollection.add({
            TransAccount: "Debt",
            TransAmount: Transaction,
            TransType: "Paid",
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

    const debtInputChange = (val) => {
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
            
            setDebt(0);
            setCash('')
            return;
          
          } else if (type == 'Deposit') {
          // can get to sell stock when no input for price and number
            console.log("Making Deposit :" + cash)
            makeDeposit()
            resetData();
            
            setDebt(0);
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
                <Text style={{fontSize: 30, color: '#ddd'}}> Current Debt: {Debt}</Text>
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
                            onChangeText = {(val) => (debtInputChange(val), setCash(val))}
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
                            text = "Add Debt"
                            
                        />

                        <MinusButton
                            onPress = {() => makeTransactionHandle(Cash, 'Withdrawal')}
                            text = "Clear Debt" 
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