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
import * as yup from 'yup';
import { Formik } from 'formik';

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
      let stockValue = 0;
      const subscriber = stockCollection
        // added this to do alphabetical order
        // not working
        //.orderBy('Name', 'asc' )
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
    

  // validation for the modal form
  
  
  const transactionSchema = yup.object({
    ticker : yup.string()
      .required("Ticker required")
      .min(1),
    price: yup.string()
      .required()
      .test('Is price valid', 'Price must be a positive number', (value) => {
        return parseFloat(value) > 0 && value !== null
      }),
    /*price: yup.number()
      .required("Please input Price of Stock")
      .positive("Price must be positive"),*/
    number: yup.string()
    .required()
    .test('Is number valid', 'Number must be a positive number', (value) => {
      return parseFloat(value) > 0 && value !== null
    }),
    /*number: yup.number()
      .required("Please input Number of Stocks")
      .positive("Number must be positive"),*/

  })






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
      
        <Modal 
          animationType = "slide"
          visible = {modalVisible}
          style = {globalStyles}
          onRequestClose = {() => setModalVisible(false)}>
        <Formik
          initialValues={{ ticker: '', price: '', number: ''}}
          validationSchema={transactionSchema}
          onSubmit={(values, actions) => {
            actions.resetForm()
            // update or sell handled by the 2 functions alrd
            // have 2 function, so pass in the values to decide which one to use?
            // for example values = {buy/sell, ticker}
            //if (values.type = buy) => updateStockHolding
            // else => removestockHolding
          }}>
          { (props) => (
          <View style = {globalStyles.container}>
              <TextInput style={globalStyles.input}
                  autoCapitalize = 'characters'
                  placeholder = "Ticker Symbol"
                  onChangeText = {(props.handleChange('ticker'), (val) => setTicker(val))} 
                  onBlur={props.handleBlur('ticker')}
                  value={props.values.ticker}
                  />      
              <Text style={{fontSize: 10, color: 'red', padding: 5, textAlign: 'center', marginBottom: 10, marginTop: 6}}>
                  {/*props.touched  keeps track of which input has been touched
                    only outputs right side(props.error.ticker) 
                    if both statements evaluate to true*/}
                  {props.touched.ticker && props.errors.ticker}
              </Text>
              <TextInput style={globalStyles.input}
                  placeholder = "Enter Price"
                  // onChangeText = {(val) => setPrice((parseInt(val)))}
                  keyboardType = 'numeric'   
                  onChangeText = {(props.handleChange('price'), (val) => setPrice((parseInt(val))))} 
                  onBlur={props.handleBlur('price')}
                  //value={props.values.price}
                  /> 
              <Text style={{fontSize: 10, color: 'red', padding: 5, textAlign: 'center'}}>
              
              {props.touched.price && props.errors.price}
              </Text>
              <TextInput style={globalStyles.input}
                  placeholder = "Number of Shares"
                  //onChangeText = {(val) => setNumShares((parseInt(val)))}
                  keyboardType = 'numeric'   
                  onChangeText = {(props.handleChange('number'), (val) => setNumShares((parseInt(val))))} 
                  onBlur={props.handleBlur('number')}
                  // value={props.values.number}
                  /> 
              <Text style={{fontSize: 10, color: 'red', padding: 5, textAlign: 'center'}}>
              
              {props.touched.number && props.errors.number}
              </Text>
              <PlusButton onPress={props.handleSubmit} text="props submit function"/>
              <PlusButton
                  // Buy
                  onPress = {() => updateStockHolding(Ticker) }
                  text = "Buy"  />

              <MinusButton
                  // Sell
                  onPress = {() => removeStockHolding(Ticker) }
                  text = "Sell"  />

          </View>
          )}
        </Formik>
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
  

