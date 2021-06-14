import React, { useState } from 'react'
import { View, Text} from 'react-native';
import * as firebase from 'firebase';
import {VictoryPie} from 'victory-native';
import HomeButton from '../Buttons/homeButton';
import {globalStyles} from '../../globalStyles/globalStyles';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {StatusBar} from 'expo-status-bar';

export default function Home({ navigation }) {
    
  const userDoc = firebase.default.firestore().collection("Users").doc(firebase.auth().currentUser.uid);
  const finDoc = firebase.default.firestore().collection("Cash&Goals").doc(firebase.auth().currentUser.uid);  
  
  const [name, setName] = useState('');
  const [CashSavings, setCashSavings] = useState(0);
  const [StockValue, setStockValue] = useState(0);
  const [DebtValue, setDebtValue] = useState(0);
  const [Goal, setGoal] = useState(0);

  finDoc.onSnapshot((doc) => setCashSavings(doc.get("CashSavings")))
  finDoc.onSnapshot((doc) => setGoal(doc.get("TargetNetWorth")))
  userDoc.onSnapshot((doc) => setName(doc.get("name")))

  const data = [
    {x: "Cash", y: CashSavings},
    {x: "Stock", y: StockValue},
   // {x: "Left to Go", y: Goal - CashSavings - StockValue}
  ];
    
    return (
    <View style={globalStyles.container}>
     <Text style = {globalStyles.welcomeMessage}> Hello {name}!</Text>
     <Text style = {globalStyles.subMessage}> You've reached {((CashSavings+StockValue)/Goal) * 100}% of your goal</Text>
      <View style={globalStyles.chartContainer}>
      
    <VictoryPie 
      style={{
        labels: {
          fill: 'white'
        }
      }}
      colorScale = {['green','red','blue']} 
      // innerRadius = {90} 
      // radius={145}
      innerRadius= {wp('20%')}
      radius={wp('30%')}
      data = {data}  >

    </VictoryPie>
      </View>
      <HomeButton text="Cash" onPress = {() => navigation.navigate("Cash")} num = {CashSavings}/>
      <HomeButton text="Stocks" onPress = {() => navigation.navigate('Stocks')} num = {StockValue}/>
      <HomeButton text="Debt" onPress = {() => navigation.navigate('Debt')} num = {DebtValue}/>

     <StatusBar style = 'light'/>
    </View>
    )
}




