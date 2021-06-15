import React, {useState, useEffect} from 'react'
import {View, Text, FlatList, InteractionManager} from 'react-native';
import { screenStyles } from './screenStyles';
import {globalStyles} from '../../globalStyles/globalStyles';
import {StatusBar} from 'expo-status-bar';
import * as firebase from 'firebase';
import TransactionBubble from '../Buttons/transactionBubble';


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
            <View style = {globalStyles.container}>
            
            <FlatList
              data={transactions.reverse()}
              renderItem={({ item }) => (
               
               <TransactionBubble account = {item.TransAccount} type = {item.TransType} date = {item.TransDate} amount = {item.TransAmount} />
                  
            )}
            />

            </View>
          );      
}
