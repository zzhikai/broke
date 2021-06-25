import React, {useState, useEffect} from 'react'
import {View, StyleSheet, Text, FlatList, InteractionManager, SafeAreaView} from 'react-native';
import { screenStyles } from './screenStyles';
import {globalStyles} from '../../globalStyles/globalStyles';
import {StatusBar} from 'expo-status-bar';
import * as firebase from 'firebase';
import TransactionBubble from '../Buttons/transactionBubble';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

export default function Transactions() {

    const [transactions, settransactions] = useState([]); // Initial empty array of users
      
        useEffect(() => {
            const subscriber = firebase.default.firestore()
              .collection('Users').doc(firebase.auth().currentUser.uid).collection('Transactions').orderBy("TransDate", "desc")
              .onSnapshot(querySnapshot => {
                const users = [];
          
                querySnapshot.forEach(documentSnapshot => {
                  users.push({
                    ...documentSnapshot.data(),
                    key: documentSnapshot.id,
                  });
                });
          
                settransactions(users);
                
              });
          
            // Unsubscribe from events when no longer in use
            return () => subscriber();
          }, []);
      
          
          
          return (
            
            
            <View style = {styles.transactionContainer}>
            
            <FlatList
              data={transactions}
              renderItem={({ item }) => (
               
               <TransactionBubble account = {item.TransAccount} type = {item.TransType} date = {item.TransDate} amount = {item.TransAmount} ticker = {item.Ticker}/>
                  
            )}
            />
            </View>
            
          );      
}
const styles = StyleSheet.create({ 
  transactionContainer: {
    //marginTop: hp('2%'),
    marginTop: Platform.OS == 'ios' ? 0 : -5,
    paddingTop: hp('5%'),
    padding: 15,
    backgroundColor:'#001039',
    flex: 1
  },
})