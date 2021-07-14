import React, { useState } from 'react'
import { View, Text, FlatList} from 'react-native';
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

  //userDoc.onSnapshot((doc) => setCashSavings(doc.get("CashSavings")))
  //userDoc.onSnapshot((doc) => setGoal(doc.get("TargetNetWorth")))
  // userDoc.onSnapshot((doc) => setName(doc.get("name")))
  userDoc.onSnapshot( (doc) => {
    setCashSavings(doc.get("CashSavings"))
    setGoal(doc.get("TargetNetWorth"))
    setName(doc.get("name"))
    setStockValue(doc.get("TotalStockValue"))
    setDebtValue(doc.get("Debt"))
  })
  
  const data = [
    {x: "Cash", y: CashSavings},
    {x: "Stock", y: StockValue},
   // {x: "Left to Go", y: Goal - CashSavings - StockValue}
  ];

  const button_data = [{name: "Cash", val: CashSavings}, {name: "Stocks" , val : StockValue}, {name: "Debt", val: DebtValue} ];
    
    return (
    <View style={globalStyles.container}>
     <Text style = {globalStyles.welcomeMessage}> Hello {name}!</Text>
     <Text style = {globalStyles.subMessage}> You've reached {(((CashSavings+StockValue - DebtValue)/Goal) * 100).toFixed(2)}% of your goal</Text>
      <View style={globalStyles.chartContainer}>
      
    <VictoryPie 
      style={{
        labels: {
          fill: 'white'
        }
      }}
      colorScale = {['#7C8577','#FFF8DC', '#cde6c7']} 
      // innerRadius = {90} 
      // radius={145}
      innerRadius= {wp('20%')}
      radius={wp('30%')}
      data = {data}  >

    </VictoryPie>
      </View>
      
      <FlatList
            data={button_data}
            renderItem={({ item }) => ( 
              // error inside item.val.tofixed(2) bc when first open stock amount is null, no number attached to it 
              // resulting in type error
              <HomeButton text = {item.name} onPress = {() => navigation.navigate(item.name)} num = {item.val.toFixed(2)} />

          )}
          
        />

     <StatusBar style = 'light'/>
    </View>
    )
}




