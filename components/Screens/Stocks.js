import React, {useState, useEffect,} from 'react'
import {View, Text, Modal, TextInput, Alert, FlatList} from 'react-native';
import { screenStyles } from './screenStyles';
import {globalStyles} from '../../globalStyles/globalStyles';
import HomeButton from '../Buttons/homeButton';
import StockButton from '../Buttons/stockButton';
import {VictoryChart, VictoryPie} from 'victory-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {StatusBar} from 'expo-status-bar';
import FlatButton from '../Buttons/button';
import MinusButton from '../Buttons/negativeButton';
import PlusButton from '../Buttons/positiveButton';
import * as firebase from 'firebase';
import { set } from 'react-native-reanimated';

//Stock buttons will have their own button
export default function Stocks() {
    
 
  
    const [modalVisible, setModalVisible] = useState(false); 
    const [totalValue, setTotalValue] = useState(0);
   
    
    

    const data = [
    
        {x: "Apple", y: 100},
        {x: "Tesla", y: 200},
        {x: "Nike", y: 300},
        /*{x: "Left to Go", y: Goal - CashSavings - StockValue}*/
      ];
    // check if ticker exist\
    const [Price, setPrice] = useState(0);
    const [NumShares, setNumShares] = useState(0);
    const [Ticker, setTicker] = useState('');
    

    // checkTickerExist
    // createTicker holdings
    // add to ticker holdings
    // remove from ticker holdings / delete
    const getPriceOfTicker = (ticker) => {
        //let price = stockPriceDoc()
        const stockPriceDoc = () => firebase.default.firestore()
            .collection("Users")
            .doc(firebase.auth().currentUser.uid)
            .collection("stocks")
            .doc(ticker)
            .get()
            .then(documentSnapshot => { 
                return documentSnapshot.data().Price
        })    
        
        return stockPriceDoc();

    }

    const getNumSharesOfTicker = (ticker) => {
        //let num = stockNumSharesDoc()
        const stockNumSharesDoc = () => firebase.default.firestore()
            .collection("Users")
            .doc(firebase.auth().currentUser.uid)
            .collection("stocks")
            .doc(ticker)
            .get()
            .then(documentSnapshot => { 
                return documentSnapshot.data().Shares
        })    
        
        return stockNumSharesDoc();

    }
    const updateStockHolding = async (ticker) => {
        // await this function to complete
        let checkTicker = await checkTickerExist(ticker);
        if (checkTicker) {
            // await functions return first to get prevPrice and prevHoldings
            let prevPrice = await getPriceOfTicker(ticker);
            let prevHoldings = await getNumSharesOfTicker(ticker);
            console.log("UPDATE:" + checkTicker)
            console.log("Adding to existing")
            const stockDoc = firebase.default.firestore()
                          .collection("Users")
                          .doc(firebase.auth().currentUser.uid)
                          .collection("stocks")
                          .doc(ticker)
            // make a function that returns the number for these info, thn use that to 
            // use await so that it completes and is assigned to the variable?
            //stockDoc.get().then((doc) => oldPrice = parseFloat(doc.data('Price'))) 
            // stockDoc.get().then((doc) => oldNum = parseFloat(doc.data('Shares'))) 
            
            // stockDoc.onSnapshot((doc) => oldPrice = parseFloat(doc.get('Price')))
            //stockDoc.onSnapshot((doc) => oldNum = parseFloat(doc.get('Shares')))
            
            
            let newNumOfShares = NumShares + prevHoldings;
            let newPrice = (prevPrice * prevHoldings + Price * NumShares) / newNumOfShares;
            // set instead of update
            // below version used await 
            console.log("Old Price: " + prevPrice)
            console.log("Old num: " + prevHoldings)
            stockDoc.update({
                "Price" : newPrice,
                "Shares" : newNumOfShares
            }).then(() => setModalVisible(false))
            // need to catch error? if something happen console.log error out 
            /*stockDoc.get().then((doc) => prevPrice = parseInt(doc.data().Price)).then((result) =>
            stockDoc.get().then((doc) => prevHoldings = parseInt(doc.data().Shares))).then((result) => 
            stockDoc.update({"Price": parseInt((prevPrice * prevHoldings + Price * NumShares)/(prevHoldings + NumShares)), "Shares": prevHoldings + NumShares})).then((result) => {     
                console.log("Old Price: " + prevPrice)
                console.log("Old num: " + prevHoldings)
            });*/
            
        } else {
            // create new stock
            console.log("UPDATE:" + checkTicker)
            console.log('Create Stock Holding Called')
            
            // await will wait for this to be completed
            console.log("Price: " + Price)
            console.log("Number: " + NumShares)

           firebase.firestore().collection("Users")
                .doc(firebase.auth().currentUser.uid)
                .collection("stocks")
                .doc(`${ticker}`)
                .set({
                Price: Price,
                Shares: NumShares
            }).then(() => setModalVisible(false));
            // check if Price and NumShares have been updated from 0

            
        }
        // when selling remove etc
 
    }

    const checkTickerExist = (ticker) =>  {
        const tickerDocRef = () => firebase.firestore().collection("Users")
            .doc(firebase.auth().currentUser.uid)
            .collection("stocks")
            .doc(ticker)
            .get().then(documentSnapshot => { 
                if (documentSnapshot.exists) {
                    console.log("1st Output Check: true")
                    return true;
                } else {
                    console.log("1st Output Check: false")
                    return false;
                }
            })    
        return tickerDocRef()
    
    }

    // build array for the all the ticker to do the api call later
    const [stockList, setStockList] = useState([]);
    
   
    
    
    
    useEffect(() => {
      const subscriber = firebase.default.firestore()
        .collection('Users').doc(firebase.auth().currentUser.uid).collection('stocks')
        .onSnapshot(querySnapshot => {
          const stocks = [];
    
          querySnapshot.forEach(documentSnapshot => {
            getCurrPrice(documentSnapshot.id).then((result) => {
              stocks.push({
              ...documentSnapshot.data(),
              key: documentSnapshot.id,
              currPrice: result,
              currValue: result * documentSnapshot.data().Shares, 
              perChange: (((result - documentSnapshot.data().Price) / documentSnapshot.data().Price) * 100).toFixed(2)
            })
            console.log(stocks[stocks.length - 1])
            setTotalValue(totalValue + stocks[stocks.length - 1].currValue);
            setStockList(stocks);
          })
          
          });
          
          
          
          
          
          
          
        });
    
      
      return () => subscriber();
    }, [setModalVisible]);
 

   

    
    
  
    const axios = require('axios');
    const params = {
       // access_key: '01c3389e120c2749472cf5cc01a2391b'
       access_key: '0'
    }

   
    function getCurrPrice(ticker) {
      
      
      const url = `http://api.marketstack.com/v1/eod?access_key=${params.access_key}&symbols=${ticker}`
      
      const quote = async () => axios.get(url)
        .then(response => {
          const apiResponse = response.data;
          if (Array.isArray(apiResponse['data'])) {
            //console.log(apiResponse['data'][0]['close'])
            return apiResponse['data'][0]['close']
          }
        }).catch(error => {
          return 69;
          console.log(error.response.data);
        });
        
        
        return (quote());
        
    }

   

    
 
    
      
     

 
   return (
    
     
      <View style={globalStyles.container}>
       <Text style = {{color :'white'}}>{totalValue}</Text>
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
            
      <FlatList
              data={stockList}
              renderItem={({ item }) => ( 
                
                

               <StockButton ticker = {item.key} num = {item.Shares} pricePaid ={item.Price} currPrice= {item.currPrice} />

                  
            )}
            />
      
      
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
                  onChangeText = {(val) => setPrice((parseInt(val)))}
                  keyboardType = 'numeric'   /> 
              <TextInput style={globalStyles.input}
                  placeholder = "Number of Shares"
                  onChangeText = {(val) => setNumShares((parseInt(val)))}
                  keyboardType = 'numeric'   /> 

              <PlusButton
                  // Buy
                  onPress = {() => updateStockHolding(Ticker, Price, NumShares) }
                  text = "Add Stock"  />

          </View>
        </Modal>
        <FlatButton
                 onPress = {() => setModalVisible(!modalVisible)}
                 // {() => navigation.navigate('StockTransaction')} 
                 text= "Make Transaction"
            />

      </View>



    </View>
    


       /* <View style={screenStyles.container}>
            <Text>Stock Screen</Text>
        </View>*/
  )}
  

