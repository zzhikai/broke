import React, { useState } from 'react'
import { View, Text, FlatList, Alert} from 'react-native';
import * as firebase from 'firebase';
import {VictoryPie} from 'victory-native';
import HomeButton from '../Buttons/homeButton';
import {globalStyles} from '../../globalStyles/globalStyles';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {StatusBar} from 'expo-status-bar';


export default function Home({ navigation }) {
    
  const userDoc = firebase.default.firestore().collection("Users").doc(firebase.auth().currentUser.uid);
  
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
  // this is for the piechart for breakdown of assets
  const data = [
    {x: "Cash" + ' - ' + ((CashSavings/(CashSavings+StockValue))*100).toFixed(2) + '%', y: CashSavings},
    {x: "Stock" + ' - ' + ((StockValue/(CashSavings+StockValue))*100).toFixed(2) + '%', y: StockValue},
   // {x: "Left to Go", y: Goal - CashSavings - StockValue}
  ];
  function setGoalsAlert() {
    console.log("Goals Alert Ran")
    Alert.alert(  
      'Goals need to be set to more than 0',
        "Please set Goals in Profile",  

      [  
          {text: 'OK', onPress: () => console.log('OK Pressed')},  
      ]  
    );  
  }

  const checkGoal = () => {
    console.log("Check Goal running")
    if (Goal == 0) {
      setGoalsAlert();
    } 
   }

  const button_data = [{name: "Cash", val: CashSavings}, {name: "Stocks" , val : StockValue}, {name: "Debt", val: DebtValue} ];
  // setTimeout(() => checkGoal(), 3000)
  // checkGoal();
  // temporary fix to setGoals
  
  if(isNaN((((CashSavings+StockValue - DebtValue)/Goal) * 100))){
  
    return (
      
      <View style={globalStyles.container}>
       <Text style = {globalStyles.welcomeMessage}> Hello {name}!</Text>
       <Text style = {globalStyles.subMessage}>Welcome to Broke!</Text>
        <View style={globalStyles.chartContainer}>
        
      <VictoryPie 
        style={{
          labels: {
            fill: 'white'
          }
        }}
        colorScale = {['#8A949B','#FAFAFA']} 
        // innerRadius = {90} 
        // radius={145}
        innerRadius= {wp('20%')}
        radius={wp('30%')}
        data = {[{x: "No Data", y: 100}, ]}  >
  
      </VictoryPie>
        </View>
        
        <FlatList
              data={button_data}
              renderItem={({ item }) => ( 
                // error inside item.val.tofixed(2) bc when first open stock amount is null, no number attached to it 
                // resulting in type error
                // Cash, Stocks, Debt buttons here
                <HomeButton text = {item.name} onPress = {() => navigation.navigate(item.name)} num = {item.val.toFixed(2)} />
  
            )}
            
          />
  
       <StatusBar style = 'light'/>
      </View>
      )


  } if (StockValue == 0 && CashSavings == 0) {
   
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
        colorScale = {['#8A949B','#FAFAFA']} 
        // innerRadius = {90} 
        // radius={145}
        innerRadius= {wp('20%')}
        radius={wp('30%')}
        data = {[{x : "No Data", y : 100}]}  >
  
      </VictoryPie>
        </View>
        
        <FlatList
              data={button_data}
              renderItem={({ item }) => ( 
                
                <HomeButton text = {item.name} onPress = {() => navigation.navigate(item.name)} num = {item.val.toFixed(2)} />
  
            )}
            
          />
  
       <StatusBar style = 'light'/>
      </View>
      )

  } else {
  
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
      colorScale = {['#8A949B','#FAFAFA']} 
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
              // Cash, Stocks, Debt buttons here
              <HomeButton text = {item.name} onPress = {() => navigation.navigate(item.name)} num = {item.val.toFixed(2)} />

          )}
          
        />

     <StatusBar style = 'light'/>
    </View>
    )
}
}




