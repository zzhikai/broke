import React, {useState, useEffect} from 'react'
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

//Stock buttons will have their own button
export default function Stocks({navigation}) {
    
 
  
  const [modalVisible, setModalVisible] = useState(false); 
    const [OldPrice, setOldPrice] = useState(0);
    const [OldNumShares, setOldNumShares] = useState(0);
    const [AvgPrice, setAvgPrice] = useState(0);
    //const [NumShares, setNumShares] = useState(0);
    //const [Ticker, setTicker] = useState('');
    const [TickerExist, setTickerExist] = useState(false)

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
    const updateStockHolding = async (ticker, price, numShares) => {
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
            stockDoc.set({
                "Price" : newPrice,
                "Shares" : newNumOfShares
            })
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

            await firebase.firestore().collection("Users")
                .doc(firebase.auth().currentUser.uid)
                .collection("stocks")
                .doc(`${ticker}`)
                .set({
                Price: Price,
                Shares: NumShares
            })
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
            stocks.push({
              ...documentSnapshot.data(),
              key: documentSnapshot.id,
            });
          });
          
          setStockList(stocks);
          
        });
    
      // Unsubscribe from events when no longer in use
      return () => subscriber();
    }, []);

    
    // stockList.forEach((ticker) => ticker.currPrice = 100)
    
    // function to calculate percentage profit or loss
    
    // function to get stock current price
    const axios = require('axios');
    const params = {
      access_key: '01c3389e120c2749472cf5cc01a2391b'
    }

    const getQuote = (ticker) => {
      
      const url = `http://api.marketstack.com/v1/eod?access_key=${params.access_key}&symbols=${ticker}`
      
      const quote = () => axios.get(url)
        .then(response => {
          const apiResponse = response.data;
          if (Array.isArray(apiResponse['data'])) {
            //console.log(apiResponse['data'][0]['close'])
            return apiResponse['data'][0]['close']
          }
        }).catch(error => {
          console.log(error.response.data);
        });
        //let price = await quote();
        //return price;
      return quote();
    }
    

    function getCurrPrice(ticker) {
      
      const url = `http://api.marketstack.com/v1/eod?access_key=${params.access_key}&symbols=${ticker}`
      
      const quote = () => axios.get(url)
        .then(response => {
          const apiResponse = response.data;
          if (Array.isArray(apiResponse['data'])) {
            //console.log(apiResponse['data'][0]['close'])
            return apiResponse['data'][0]['close']
          }
        }).catch(error => {
          console.log(error.response.data);
        });
        //let price = await quote();
        //return price;
        return quote();
    }
    
    const addToStockList = async (ticker) => {
      let price = await getQuote(ticker);
      let price1 = await price;

      console.log("Add to stocklist price:" + price)
      return price1;

    }

    
    var combined = [];
  
    

    // map creates a new array
    // resolvedValues is array of currPrices
    Promise.all(stockList.map(item => getCurrPrice(item.key)))
      .then((result) => {
        
          for( var i = 0; i < stockList.length; i = i + 1) {
            
            // console.log(result[i])
            stockList[i].currPrice = result[i]
            combined[i] = stockList[i]
            console.log(combined[i])
          }
          
          // console.log(item);
          
        })
    
    /*.then((resolvedValues) => {resolvedValues.forEach((value) => {  }); });*/
      
    // merge the two arrays
    
    console.log("PROMISE LAND: " + combined[0]);

    // console.log("New stock arr:" + newStockArr[0]);
    // do i need to await here
    // stockList.forEach((ticker) => ticker.currPrice = addToStockList(ticker.key))
    
    // stockList.forEach((ticker) => ticker.currPrice = getCurrPrice(ticker.key))
    
    /*const perChange = async (ticker, pricePaid) => {
      let currPrice = await getCurrPrice(ticker);
      let percent = getPercentageChange(currPrice, pricePaid);
     
      return percent;
    }*/

    /*function getPercentageChange(currPrice, pricePaid) {
      // let currentPrice = getCurrPrice(ticker);
      
      return (((currPrice - pricePaid) / pricePaid) * 100 ).toFixed(1);
      
      
    }*/
    
    // stockList.forEach((ticker) => getCurrPrice(ticker))
    // console.log("StockList index 0: ");
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
            {/*lIST keeps rerendering constantly whenever something is being type, due to use effect?
              Remove reverse
            */}
      <FlatList
              data={stockList}
              renderItem={({ item }) => ( 
                
                

               <StockButton ticker = {item.key} num = {item.Shares} pricePaid ={item.Price} currPrice= {item.currPrice} />

                  
            )}
            />
      
       {/*
      percentage = {perChange(item.key, item.Price)} 
      } */}
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
  

