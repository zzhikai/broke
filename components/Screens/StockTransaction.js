import React, {useState} from 'react'
import {View, Text, TextInput} from 'react-native';
import { screenStyles } from './screenStyles';
import {globalStyles} from '../../globalStyles/globalStyles';
import { StatusBar } from 'expo-status-bar';
import * as firebase from 'firebase';
import PlusButton from '../Buttons/positiveButton';
import { parse } from 'react-native-svg';
// buttons textinput to enter stock Ticker
// price, number
// reference to the doc if exisiting
// else need to create new one
// do everything inside one function
// have to check if ticker exist inside the doc first

export default function StockTransaction() {

    
    
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



    return (
        <View style={globalStyles.container}>

            <View style= {globalStyles.chartContainer}>
                <Text style={{ 
                    fontSize: 20,
                    color: 'white',
                    fontWeight: 'bold'
                }}> Make Stock Transaction Screen </Text>
                <StatusBar style = 'light'/>
            </View>
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
                  onPress = {() => updateStockHolding(Ticker, Price, NumShares)}
                  text = "Add Stock"  />

          </View>


        </View>
    )
}
