import React, {useState} from 'react'
import {View, Text, Modal, TextInput, Alert} from 'react-native';
import { screenStyles } from './screenStyles';
import {globalStyles} from '../../globalStyles/globalStyles';
import HomeButton from '../Buttons/homeButton';
import {VictoryChart, VictoryPie} from 'victory-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {StatusBar} from 'expo-status-bar';
import FlatButton from '../Buttons/button';
import MinusButton from '../Buttons/negativeButton';
import PlusButton from '../Buttons/positiveButton';
import * as firebase from 'firebase';
//Stock buttons will have their own button
export default function Stocks() {
    const [modalVisible, setModalVisible] = useState(false); 
    const [OldPrice, setOldPrice] = useState(0);
    const [OldNumShares, setOldNumShares] = useState(0);
    const [AvgPrice, setAvgPrice] = useState(0);
    const [NumShares, setNumShares] = useState(0);
    const [Ticker, setTicker] = useState('');
    const [TickerExist, setTickerExist] = useState(false)

    const data = [
    
        {x: "Apple", y: 100},
        {x: "Tesla", y: 200},
        {x: "Nike", y: 300},
        /*{x: "Left to Go", y: Goal - CashSavings - StockValue}*/
      ];
    // check if ticker exist\
   /* const checkTickerExist = () => {
      const tickerDocRef = firebase.firestore().collection("Users")
      .doc(firebase.auth().currentUser.uid)
      .collection("stocks")
      .doc(`${Ticker}`)

      tickerDocRef.get().then(documentSnapshot => {
        // is setTickerExist async also 
        setTickerExist(documentSnapshot.exists).then(() => {
          console.log("Document exists: " + documentSnapshot.exists)
          console.log("Ticker exist ?" + TickerExist)
        })
      })
    }*/
    function checkTickerExist(ticker) {
     

      const tickerRef = firebase.firestore().collection("Users")
        .doc(firebase.auth().currentUser.uid)
        .collection("stocks")
        .doc(`${ticker}`)
        
        console.log(ticker)

        tickerRef.get().then(documentSnapshot => {
          setTickerExist(documentSnapshot.exists)
          console.log("Document exists: " + documentSnapshot.exists)
          console.log("Ticker exist ?" + TickerExist)
        })
      
      // THERE IS error whenever the doc does not exist?
      // need to solve this exist problem first
     

    }
    function createStockHolding(ticker) {
    
      console.log('Create Stock Holding Called')

      firebase.firestore().collection("Users")
        .doc(firebase.auth().currentUser.uid)
        .collection("stocks")
        .doc(`${ticker}`)
        .set({
          Price: AvgPrice,
          Shares: NumShares
        })
    }

    // add another arg , buy/sell
    // based on that two buttons can use the same function
    // it is using the previous TickerExist, instead of updating, hence data is not accurate
    // aft creating and addding shares, once i create another one that does not exist, it will still be true
    function updateStockHolding(ticker, price, shares, type) {
      // checkTickerExist(ticker)
      // check Ticker Exist is async as a result the function does not wait for checkTickerExist to complete
      // once true, even tho called checkTickerExist, still remained true causing unhandled promise rejection
      // console.log(checkTickerExist(ticker))
      //console.log(TickerExist);
      // checkTickerExist(ticker).then()
      if (type === 'buy') {
        
        console.log(TickerExist)
        if (TickerExist) {
          //console.log('ticker exist')
          // bc TickerExist not resetted, the stockDoc for the new Ticker is created
          // and value is set into the field of the new Doc
          const stockDoc = firebase.default.firestore()
                          .collection("Users")
                          .doc(firebase.auth().currentUser.uid)
                          .collection("stocks")
                          .doc(`${ticker}`)

          stockDoc.onSnapshot((doc) => setOldPrice(doc.get('Price')))
          
          stockDoc.onSnapshot((doc) => setOldNumShares(doc.get('Shares')))
          console.log("Prev price: " + OldPrice)
          console.log("Prev num of shares: " + OldNumShares)
          // this part returning 0 for old price and oldNumShares for the first time
          const newNumOfShares = (OldNumShares + shares)
          const newPrice = ((OldPrice * OldNumShares+ price * shares) / newNumOfShares)
          console.log("New price: " + newPrice)
          console.log("New num of shares: " + newNumOfShares)
          // change to set instead of update, thn 2nd transaction will not cause it to reset
          // does not work properly bc it takes the old price
          // unfound entity error gone when inputting all new symbol, but TickerExist becomes true due to prev add

          stockDoc.set({
            "Price" : newPrice,
            "Shares" : newNumOfShares
          }).then((result) => setModalVisible(false))
          
        } else {
          // i set auto and usecreateStockHolding, bc i recall createStockHolding, end up reseting?
          // ticker dont exist yet
          
          console.log('Reached Else case')
          console.log(ticker)
          createStockHolding(ticker)
          const stockDoc = firebase.default.firestore()
                          .collection("Users")
                          .doc(firebase.auth().currentUser.uid)
                          .collection("stocks")
                          .doc(`${ticker}`)
          
          stockDoc.update({
            "Price" : AvgPrice,
            "Shares" : NumShares
          }).then((result) => setModalVisible(false))
          console.log(AvgPrice)
          console.log(NumShares)
          // setTickerExist(true);
        }
      }
    }
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
            innerRadius= {wp('20%')}
            radius={wp('30%')}
            data = {data}  >
          </VictoryPie>
      </View>
    
     
        <HomeButton text="Apple" onPress = {() => console.log("Transaction for this Stock" )} num = {100}/>
        <HomeButton text="Tesla" onPress = {() => console.log("Transaction for this Stock" )} num = {200}/>
        {/*<HomeButton text="Nike" onPress = {() => console.log("Transaction for this Stock" )} num = {300}/>*/}
        <StatusBar style = 'light'/>
      <View>
        <Modal 
          animationType = "slide"
          visible = {modalVisible}
          style = {globalStyles}
          onRequestClose = {() => setModalVisible(false)}>
          
          <View>
              <TextInput style={globalStyles.input}
                  placeholder = "Ticker Symbol"
                  onChangeText = {(val) => setTicker(val)} />      
             
              <TextInput style={globalStyles.input}
                  placeholder = "Enter Purchase Price"
                  onChangeText = {(val) => setAvgPrice((parseFloat(val)))}
                  keyboardType = 'numeric'   /> 
              <TextInput style={globalStyles.input}
                  placeholder = "Number of Shares"
                  onChangeText = {(val) => setNumShares((parseFloat(val)))}
                  keyboardType = 'numeric'   /> 

              <PlusButton
                  // Buy
                  onPress = {() => (checkTickerExist(Ticker), updateStockHolding(Ticker, AvgPrice, NumShares, 'buy'))}
                  text = "Add Stock"  />

          </View>
        </Modal>
        <FlatButton
                 onPress = {() => setModalVisible(!modalVisible)}
                 text= "Make Transaction"
            />

      </View>



    </View>
    


       /* <View style={screenStyles.container}>
            <Text>Stock Screen</Text>
        </View>*/
  )}
  

