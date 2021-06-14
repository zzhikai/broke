import React from 'react'
import {View, Text} from 'react-native';
import { screenStyles } from './screenStyles';
import {globalStyles} from '../../globalStyles/globalStyles';
import HomeButton from '../Buttons/homeButton';
import {VictoryChart, VictoryPie} from 'victory-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {StatusBar} from 'expo-status-bar';

//Stock buttons will have their own button
export default function Stocks() {
  
    const data = [
        /*{x: "Cash", y: CashSavings},
        {x: "Stock", y: StockValue},
        {x: "Left to Go", y: Goal - CashSavings - StockValue}*/
        {x: "Apple", y: 100},
        {x: "Tesla", y: 200},
        {x: "Nike", y: 300},
        /*{x: "Left to Go", y: Goal - CashSavings - StockValue}*/
      ];
    
    return (


        
        <View style={globalStyles.container}>
      <View style={globalStyles.chartContainer}>

    <VictoryPie 
      style={{
        labels: {
          fill: 'white'
        }
      }}
      colorScale = {['#d5ddef','#4c394f','#616063']} 
      // 90 / 145 , 
      // how to scale to different screens
      innerRadius= {wp('20%')}
      radius={wp('30%')}
      
      // innerRadius = {75} 
       // radius={125}
      data = {data}  >

    </VictoryPie>
      </View>
      {/*<FlatButton text="Cash" onPress = {() => navigation.navigate("Cash")} num = {CashSavings}/>
      <FlatButton text="Stocks" onPress = {() => navigation.navigate('Stocks')} num = {CashSavings}/>
      <FlatButton text="Debt" onPress = {() => navigation.navigate('Debt')} num = {CashSavings}/>
      */}
      <HomeButton text="Apple" onPress = {() => console.log("Transaction for this Stock" )} num = {100}/>
      <HomeButton text="Tesla" onPress = {() => console.log("Transaction for this Stock" )} num = {200}/>
      <HomeButton text="Nike" onPress = {() => console.log("Transaction for this Stock" )} num = {300}/>
      <StatusBar style = 'light'/>
    </View>
       /* <View style={screenStyles.container}>
            <Text>Stock Screen</Text>
        </View>*/
    )
}
