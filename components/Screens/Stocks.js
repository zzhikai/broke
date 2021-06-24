import React, {useState, useEffect,} from 'react'
import {View, Text, Modal, TextInput, Alert, FlatList} from 'react-native';
import {globalStyles} from '../../globalStyles/globalStyles';
import StockButton from '../Buttons/stockButton';
import {VictoryPie} from 'victory-native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {StatusBar} from 'expo-status-bar';
import FlatButton from '../Buttons/button';
import MinusButton from '../Buttons/negativeButton';
import PlusButton from '../Buttons/positiveButton';
import * as firebase from 'firebase';

//Stock buttons will have their own button
export default function Stocks({navigation}) {

    const [modalVisible, setModalVisible] = useState(false); 
    const [totalValue, setTotalValue] = useState(0);
    // totalValue does not reset, hence will keep using previous value whenever we update
    const userDoc = firebase.default.firestore().collection("Users").doc(firebase.auth().currentUser.uid);
    const userCollection = firebase.default.firestore().collection('Users').doc(firebase.auth().currentUser.uid).collection('Transactions');
    const stockCollection = firebase.default.firestore().collection("Users").doc(firebase.auth().currentUser.uid).collection("Stocks")
    var today = new Date();
    var date = today.getDate() + '/' + (today.getMonth() + 1) + '/' + today.getFullYear();
    const data1 = [
    
        {x: "Apple", y: 100},
        {x: "Tesla", y: 200},
        {x: "Nike", y: 300},
        /*{x: "Left to Go", y: Goal - CashSavings - StockValue}*/
      ];
    // check if ticker exist\
    const [Price, setPrice] = useState(0);
    const [NumShares, setNumShares] = useState(0);
    const [Ticker, setTicker] = useState('');
    const [isLoading, setLoading] = useState(true);

    const getPriceOfTicker = (ticker) => {
        //let price = stockPriceDoc()
        const stockPriceDoc = () => stockCollection
            .doc(ticker)
            .get()
            .then(documentSnapshot => { 
                return documentSnapshot.data().Price
        })    
        
        return stockPriceDoc();

    }

    const getNumSharesOfTicker = (ticker) => {
        //let num = stockNumSharesDoc()
        const stockNumSharesDoc = () => stockCollection
            .doc(ticker)
            .get()
            .then(documentSnapshot => { 
                return documentSnapshot.data().Shares
        })    
        
        return stockNumSharesDoc();

    }


    // sell/remove stock

    const removeStockHolding = async (ticker) => {
      
      let checkTicker = await checkTickerExist(ticker)
    
      if (checkTicker) {
      
         let prevHoldings = await getNumSharesOfTicker(ticker);
         if (NumShares > prevHoldings) {
           TickerFailedAlert("Number of Shares sold more than owned")
         } else if (NumShares == prevHoldings) {
            const stockDoc = stockCollection.doc(ticker)
            // delete the stock
            stockDoc.delete()
             
            .then((result) => userCollection.add({
              TransAccount: "Stock",
              TransAmount: NumShares * Price,
              TransType: "Sell",
              TransDate: date,
              Ticker: ticker,
            }))
            .then(() => setModalVisible(false))
            
         }  else {
           // update it normally
            let prevPrice = await getPriceOfTicker(ticker);
            let prevHoldings = await getNumSharesOfTicker(ticker);
            
            const stockDoc = stockCollection
                          .doc(ticker)
          
            let newNumOfShares = prevHoldings - NumShares;
            
            stockDoc.update({
                // "Price" : newPrice,
                // Price remains the same
                "Shares" : newNumOfShares
            })
            .then((result) => userCollection.add({
              TransAccount: "Stock",
              TransAmount: NumShares * Price,
              TransType: "Sell",
              TransDate: date,
              Ticker: ticker,
            }))
            .then(() => setModalVisible(false))
         }
      
      } else {
        // ticker does not exist in holding, reset textinput 
        TickerFailedAlert("No Such Stock Owned"); 
      }

    }

    function updateTotalStockValue() {
      userDoc.update({
        TotalStockValue: totalValue
      })
    }

    function TickerFailedAlert(args) {
      Alert.alert(  
          'Transaction Failed',  
           args,
          [  
              {text: 'OK', onPress: () => {}},  
          ]  
     );     
  }
    // under buy/add stock
    const updateStockHolding = async (ticker) => {
        // await this function to complete
        // setTotalValue(0);
        let checkTicker = await checkTickerExist(ticker);
        if (checkTicker) {
            // await functions return first to get prevPrice and prevHoldings
            let prevPrice = await getPriceOfTicker(ticker);
            let prevHoldings = await getNumSharesOfTicker(ticker);
            console.log("UPDATE:" + checkTicker)
            console.log("Adding to existing")
            const stockDoc = stockCollection
                          .doc(ticker)
         
            let newNumOfShares = NumShares + prevHoldings;
            let newPrice = (prevPrice * prevHoldings + Price * NumShares) / newNumOfShares;
            // set instead of update
            // below version used await 
            
            stockDoc.update({
                "Price" : newPrice,
                "Shares" : newNumOfShares
            })
            .then((result) => userCollection.add({
              TransAccount: "Stock",
              TransAmount: NumShares * Price,
              TransType: "Buy",
              TransDate: date,
              Ticker: ticker,
            }))
            .then(() => setModalVisible(false))
            // need to catch error? if something happen console.log error out 
            
            
        } else {
           
            console.log("UPDATE:" + checkTicker)
            console.log('Create Stock Holding Called')
            
            // await will wait for this to be completed
            console.log("Price: " + Price)
            console.log("Number: " + NumShares)
            // in the end need to include MIC when we support other exchanges
           let nameOfCompany = await getName(ticker)

           if (nameOfCompany === 'NA') {
             // suppose to do alert here
             TickerFailedAlert("No such ticker supported")
           
           } else {
            console.log(nameOfCompany);
            stockCollection
              .doc(`${ticker}`)
              .set({
                Name: nameOfCompany,
                Price: Price,
                Shares: NumShares
              })
              .then((result) => userCollection.add({
                TransAccount: "Stock",
                TransAmount: NumShares * Price,
                TransType: "Buy",
                TransDate: date,
                Ticker: ticker,
              }))
              .then(() => setModalVisible(false))
              // check if Price and NumShares have been updated from 0

          }
        }
        // when selling remove etc
 
    }

    // inside firestore
    const checkTickerExist = (ticker) =>  {
        const tickerDocRef = () => stockCollection
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
      
      //setTotalValue(0);
      const subscriber = stockCollection
        // added this to do alphabetical order
        // not working
        //.orderBy('Name', 'asc' )
        .onSnapshot(querySnapshot => {
          const stocks = [];

          let stockValue = 0;
          let count = 0;
          
          querySnapshot.forEach(documentSnapshot => {
            console.log(count++);
            getCurrPrice(documentSnapshot.id).then((result) => {
              
              stocks.push({
              ...documentSnapshot.data(),
              key: documentSnapshot.id,
              currPrice: result,
              currValue: result * documentSnapshot.data().Shares, 
              perChange: (((result - documentSnapshot.data().Price) / documentSnapshot.data().Price) * 100).toFixed(2)
            })
            console.log(stocks[stocks.length - 1].key)
            stockValue = stockValue + stocks[stocks.length - 1].currValue
            // setTotalValue(totalValue + stocks[stocks.length - 1].currValue);
            console.log("Curr price result: " + result);
            // trying to get the totalStockValue
            setTotalValue(stockValue);
            console.log(stockValue)
            // setLoading(false)
            })
            
            setStockList(stocks);
            setLoading(false)
            console.log("Updating Stock value on Home page")
            
            
            
          
          });
          // update here how many times does it access
          
        })
     
      return () => subscriber();
    }, []);
    

    
    
    
    const axios = require('axios');
    const params = {
       // access_key: '01c3389e120c2749472cf5cc01a2391b'
       access_key: '0'
    }

   
    function getCurrPrice(ticker) {
      
      // Obtain the latest end-of-day data for a given stock symbol. Example: /tickers/AAPL/eod/latest
      const url = `http://api.marketstack.com/v1/eod/latest?access_key=${params.access_key}&symbols=${ticker}`
      // output 1 day
      // `http://api.marketstack.com/v1/eod?access_key=${params.access_key}&symbols=${ticker}`
      // output 100 day page limit
      
      const quote = async () => axios.get(url)
        .then(response => {
          const apiResponse = response.data;
          if (Array.isArray(apiResponse['data'])) {
            //console.log(apiResponse['data'][0]['close'])
            return apiResponse['data'][0]['close']
          }
        }).catch(error => {
          return 150;
          console.log(error.response.data);
        });
        
        
        return quote();
        
    }
    //either return name or catch error and return that this does not exist, NA
    function getName(ticker) {
      
      
      const url = `http://api.marketstack.com/v1/tickers/${ticker}?access_key=${params.access_key}`
      
      const quote = async () => axios.get(url)
        .then(response => {
          const apiResponse = response.data;
          if (Array.isArray(apiResponse['data'])) {
            return 'NA'
            //console.log(apiResponse['data'][0]['close'])
            // return apiResponse['data'][0]['name']
          }
        }).catch(error => {
          // console.log(error.response.data);
          return 'Apple';
          //return 'Tesla';
          // return 'Disney'
        });
        
        
        return quote();
        
    }
   
  updateTotalStockValue();

   const [data, setData] = useState({
     ticker:'',
     price:'',
     number:'',
     isValidTextInput: true,
     isValidPriceInput: true,
     isValidNumberInput: true,

   })

   const resetData = () => {
    setData({
      ticker:'',
      price:'',
      number:'',
      isValidTextInput: true,
      isValidPriceInput: true,
      isValidNumberInput: true,
    })

   }

   const textInputChange = (val) => {
     if (val.length > 0) {
       setData({
         ...data,
         ticker: val,
         isValidTextInput: true,
       })
     } else {
       setData({
          ...data,
          ticker: val,
          isValidTextInput: false,
        })
       
     }
   }
   // for price and number of shares
   const numberInputChange = (val) => {
     // console.log("val == null:" + (val == null))
     if (parseFloat(val) > 0 && val != null) {
      setData({
        ...data,
        number: val,
        isValidNumberInput: true,
      })
     } else {
      setData({
        ...data,
        number: val,
        isValidNumberInput: false,
      })
     }
   }

   const priceInputChange = (val) => {
    if (parseFloat(val) > 0 && val != null) {
     setData({
       ...data,
       price: val,
       isValidPriceInput: true,
     })
    } else {
     setData({
       ...data,
       price: val,
       isValidPriceInput: false,
     })
    }
  }

   const makeTransactionHandle = (ticker,price, number, type) => {
    console.log("Im here!")
    console.log("Negative Price Check:" + price);
   
    if (ticker.length === 0)  {
      Alert.alert("Invalid Input!", 'Ticker field cannot be empty.', 
                  [{text: 'Okay'}])
      return;
      
    } else if (parseInt(price) < 0 || parseInt(number) < 0 || price.length == 0 || number.length == 0) {
         // numbers can become an empty string and end up passing
        Alert.alert("Invalid Input Values!", 'Price and Number field must be more than 0',[{text: 'Okay'}])
        return;
    } else {

      if (type == 'Buy') {
        console.log("Im here!2")
        updateStockHolding(ticker).then(() => resetData())
        return;
      
      } else if (type == 'Sell') {
      // can get to sell stock when no input for price and number
        console.log("Im here! Sell")
        removeStockHolding(ticker).then(() => resetData())
        return;
      } else {
        return;
      }
      
    }
  

   }

   if (isLoading){
     return(
      <View style= {globalStyles.container}>
       <View style = {globalStyles.chartContainer}>
         <Text style = {{fontSize: 20, color: 'white', flex: 1}}>LOADING</Text>
       </View>
      </View> 
     )

   } else {
  
   
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
            data = {data1}  >
          </VictoryPie>
      </View>
      
      
        <FlatList
            data={stockList}
            renderItem={({ item }) => ( 

              <StockButton ticker = {item.key} num = {item.Shares} pricePaid ={item.Price} currPrice= {item.currPrice} />

          )}
          
        />
        
        <StatusBar style = 'light'/>
      
        <Modal 
          animationType = "slide"
          visible = {modalVisible}
          style = {globalStyles}
          onRequestClose = {() => (setModalVisible(false), resetData())}>
          
          <View style = {globalStyles.container}>
              <TextInput style={globalStyles.input}
                  autoCapitalize = 'characters'
                  placeholder = "Ticker Symbol"
                  onChangeText = {(val) => (textInputChange(val), setTicker(val))}
                  // onBlur = {(val) =>textInputChange(val)}
                  
                  />      
             {!data.isValidTextInput ? 
                <View> 
                  <Text style={{color: 'red', alignSelf:'center'}}>Please enter your ticker</Text>
                </View> : null}
              <TextInput style={globalStyles.input}
                  placeholder = "Enter Price"
                  onChangeText = {(val) => (priceInputChange(val),setPrice((parseInt(val))))}
                  keyboardType = 'numeric'   /> 
              {!data.isValidPriceInput ? 
                <View> 
                  <Text style={{color: 'red', alignSelf:'center'}}>Please enter valid price</Text>
                </View> : null}

              <TextInput style={globalStyles.input}
                  placeholder = "Number of Shares"
                  onChangeText = {(val) => (numberInputChange(val),setNumShares((parseInt(val))))}
                  // onBlur = {(val) => numberInputChange(val)}
                  keyboardType = 'numeric'   /> 
              {!data.isValidNumberInput ? 
                <View> 
                  <Text style={{color: 'red', alignSelf:'center'}}>Please enter valid number</Text>
                </View> : null}
              
              
              <PlusButton
                  // Buy
                  onPress =  {() => makeTransactionHandle(data.ticker, data.price, data.number, 'Buy') }
                  // {() => updateStockHolding(Ticker) }
                  text = "Buy"  />

              <MinusButton
                  // Sell
                  onPress = {() => makeTransactionHandle(data.ticker, data.price, data.number,'Sell') }
                  // {() => removeStockHolding(Ticker) }
                  text = "Sell"  />

          </View>
        </Modal>
        <FlatButton
                 onPress = {() => setModalVisible(!modalVisible)}
                 // {() => navigation.navigate('TestFeature')} 
                 
                 // {() => navigation.navigate('StockTransaction')} 
                 text= "Make Transaction"
            />

      



    </View>

  )}
            }
  

