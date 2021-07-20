import React, {useState, useEffect,} from 'react'
import {View, Text, Modal, TextInput, Alert, FlatList} from 'react-native';
import {globalStyles} from '../../globalStyles/globalStyles';
import StockButton from '../Buttons/stockButton';
import {VictoryLabel, VictoryPie} from 'victory-native';
import Svg from 'react-native-svg';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {StatusBar} from 'expo-status-bar';
import FlatButton from '../Buttons/button';
import MinusButton from '../Buttons/negativeButton';
import PlusButton from '../Buttons/positiveButton';
import getCompanyName from '../StockAPIFunctions/getCompanyName';
import getCurrentPrice from '../StockAPIFunctions/getCurrentPrice';
import * as firebase from 'firebase';

const colorPaletteOne = [ '#AC8181','#CFCECA','#F8F8FF','#C9A959', '#253D5B']
//Stock buttons will have their own button
export default function Stocks({navigation}) {

    const [modalVisible, setModalVisible] = useState(false); 
    // this is total stock value
    const [totalValue, setTotalValue] = useState(0);
    // totalValue does not reset, hence will keep using previous value whenever we update
    const [totalPerChange, setTotalPerChange] = useState(0);
    // this will be total percentage change of the stock portfolio
    const userDoc = firebase.default.firestore().collection("Users").doc(firebase.auth().currentUser.uid);
    const userCollection = firebase.default.firestore().collection('Users').doc(firebase.auth().currentUser.uid).collection('Transactions');
    const stockCollection = firebase.default.firestore().collection("Users").doc(firebase.auth().currentUser.uid).collection("Stocks")
    var today = new Date();
    var date = today.getDate() + '/' + (today.getMonth() + 1) + '/' + today.getFullYear();
    // insert new
    // check if ticker exist\
    const [Price, setPrice] = useState(0);
    const [NumShares, setNumShares] = useState(0);
    const [Ticker, setTicker] = useState('');
    const [isLoading, setLoading] = useState(true);
  
   // cannot move this out will cause app to have error 
   // likely to mean cannot move anything that connect to firestore docs out
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
      
         let prevHoldings = await  getNumSharesOfTicker(ticker);
        // getNumOfShares(ticker) //
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
        TotalStockValue: parseFloat(totalValue.toFixed(2))
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
            console.log("updating stock prev number: " + prevHoldings)
            // console.log("UPDATE:" + checkTicker)
            console.log("Adding to existing")
            const stockDoc = stockCollection
                          .doc(ticker)
         
            let newNumOfShares = parseFloat(NumShares) + prevHoldings;
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
           
            
            console.log('Create Stock Holding Called')
            
            
            // in the end need to include MIC when we support other exchanges
           // let nameOfCompany = await getName(ticker)
           let nameOfCompany = await getCompanyName(ticker)
           console.log("noc" + (nameOfCompany))
           console.log("Testing Orhad")

           if (nameOfCompany === 'NA') {
             // suppose to do alert here
             TickerFailedAlert("No such ticker supported")
           
           } else {
            // console.log(nameOfCompany);
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
                    // console.log("1st Output Check: true")
                    return true;
                } else {
                    // console.log("1st Output Check: false")
                    return false;
                }
            })    
        return tickerDocRef()
    
    }

    // build array for the all the ticker to do the api call later
    const [stockList, setStockList] = useState([]);
    var pieChartArray = [];

    
    useEffect(() => {
      
      //setTotalValue(0);
      const subscriber = stockCollection
        // added this to do alphabetical order
        // not working
        //.orderBy('Name', 'asc' )
        .onSnapshot(querySnapshot => {
          const stocks = [];

          let stockValue = 0;
          
          
          querySnapshot.forEach(documentSnapshot => {
            
            getCurrentPrice(documentSnapshot.id).then((result) => {
              stockData.push({x: documentSnapshot.data().Name, y: result * documentSnapshot.data().Shares})
              stocks.push({
              ...documentSnapshot.data(), 
              // provides the old price and old num Shares
              // added this to see if can get name out
              name: documentSnapshot.data().Name,
              key: documentSnapshot.id,
              currPrice: result,
              currValue: result * documentSnapshot.data().Shares, 
              perChange: (((result - documentSnapshot.data().Price) / documentSnapshot.data().Price) * 100).toFixed(2)
            })
            
            stockValue = stockValue + stocks[stocks.length - 1].currValue
            // updates totalStock value in field 
            setTotalValue(stockValue);
         
            })
            setStockList(stocks);

          });

        })
        
      return () => subscriber();
    }, []);
    
    const axios = require('axios');
    const params = {
      access_key: '01c3389e120c2749472cf5cc01a2391b'
      // '34c968023042747b40e1af689bf81751'
       // access_key: '0'
    }
   
  
  
  // updateTotalStockValue supposed to be outside of Useeffect
  updateTotalStockValue();
  const updatePieChartArray = () => {
    for ( let i = 0; i < stockList.length; i++ ) {

      pieChartArray.push({
        x: stockList[i].name,
        y: stockList[i].currValue
        
      })
    }

  
  }
  updatePieChartArray();

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
     let value = val.replace(/[- #*;,.<>\{\}\[\]\\\/]/gi, '')
     
     console.log("value changed: " + value )
     if (value.length > 0) {
       setData({
         ...data,
         ticker: value,
         isValidTextInput: true,
       })
       setTicker(value)
     } else {
       setData({
          ...data,
          ticker: value,
          isValidTextInput: false,
        })
       
     }
   }
   // for price and number of shares
   const numberInputChange = (val) => {
     // console.log("val == null:" + (val == null))
     // omitted the fullstop
     // does not replace period . & -
     // given input is 1.5.5, parsefloat and setdata will make it 1.5
     let value = parseFloat(val.replace(/[ #*;,<>\{\}\[\]\\\/]/gi, ''))

     console.log("num of shares in decimal: " + value)
     if (parseFloat(value) > 0 && value != null) {
      setData({
        ...data,
        number: value,
        isValidNumberInput: true,
      })
      // console.log("Setting NumShare with type: " + typeof(parseFloat(value)) + " data: " + value)
      setNumShares(value);
     } else {
      setData({
        ...data,
        number: value,
        isValidNumberInput: false,
      })
     }
   }

   const priceInputChange = (val) => {
     // does not replace period . & -
    let value = parseFloat(val.replace(/[ #*;,<>\{\}\[\]\\\/]/gi, ''))
     
    console.log("Price in decimal: " + value)
    if (parseFloat(value) > 0 && value != null) {
     setData({
       ...data,
       price: value,
       isValidPriceInput: true,
     })
     console.log("Setting Price with type: " + typeof(parseFloat(value)) + " data: " + value + "Float version: " + parseFloat(value))
     setPrice(value);
    } else {
     setData({
       ...data,
       price: value,
       isValidPriceInput: false,
     })
    }
  }

   const makeTransactionHandle = (ticker,price, number, type) => {
    //console.log("Im here!")
    //console.log("Negative Price Check:" + price);
    // console.log("Number String Check:" + number);
    // let tickerUpdate = ticker.replace(/[- #*;,.<>\{\}\[\]\\\/]/gi, '')
    //tickerUpdate();
    // if any of ticker, price, number contains punctuation whole thing shld reset right
    // 
    //console.log("ticker remove symbols: " + tickerUpdate)
    if (ticker.length === 0)  {
      Alert.alert("Invalid Input!", 'Ticker field cannot be empty.', 
                  [{text: 'Okay'}])
      setSymbol('')
      setPx('')
      setNum('')
      return;
      
    } else if (parseFloat(price) <= 0 || parseFloat(number) <= 0 || price.length == 0 || number.length == 0) {
         // numbers can become an empty string and end up passing
        Alert.alert("Invalid Input Values!", 'Price and Number field must be more than 0',[{text: 'Okay'}])
        setSymbol('')
        setPx('')
        setNum('')
        return;
    } else {

      if (type == 'Buy') {
        console.log("Im here! Buy")
        updateStockHolding(ticker).then(() => resetData())
        setSymbol('')
        setPx('')
        setNum('')
        return;
      
      } else if (type == 'Sell') {
      // can get to sell stock when no input for price and number
        console.log("Im here! Sell")
        removeStockHolding(ticker).then(() => resetData())
        setSymbol('')
        setPx('')
        setNum('')
        return;
      } else {
        return;
      }
      
    }
  

   }

   const [Symbol, setSymbol] = useState('')
   const [Px, setPx] = useState('')
   const [Num, setNum] = useState('')


   return (
    
     
      <View style={globalStyles.container}>
       {/*<Text style = {{color :'white'}}>{totalValue}</Text>*/}
        <View style={globalStyles.chartContainer}>
          <Svg style= {globalStyles.pieChartContainer}>
          <VictoryPie 
            style={{
              labels: {
                fill: 'white',
                fontSize: 10,
                
              }
              
            }}
            colorScale = {[ '#AC8181','#CFCECA','#F8F8FF','#C9A959', '#253D5B', '#956ab3' ,'#6b0000', '#342141','#90f009', '#8bfdf1','#ff5dab','#118273', ]}
            // {['#d5ddef','#4c394f','#616063']} 
            innerRadius= {wp('20%')}
            radius={wp('30%')}
            // data = {data1}  
            
            data = {pieChartArray}>
          </VictoryPie>
          <VictoryLabel
            textAnchor= "middle"
            x = {wp('50%')} y ={hp('25%')}
            style= {{ color: 'white', fill: 'white', fontSize: 20 }}
          text= {totalValue.toFixed(2)}/>
          </Svg>  
      </View>
      
      
        <FlatList
            data={stockList}
            renderItem={({ item }) => ( 

              <StockButton ticker = {item.key} num = {item.Shares} pricePaid ={item.Price} currPrice= {item.currPrice} stockName={item.name} percentage ={item.perChange} />

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
                  value = {Symbol}
                  onChangeText = {(val) => (textInputChange(val), setSymbol(val))}
                    // , setTicker(val))}
                  // onBlur = {(val) =>textInputChange(val)}
                  
                  />      
             {!data.isValidTextInput ? 
                <View> 
                  <Text style={{color: 'red', alignSelf:'center'}}>Please enter your ticker</Text>
                </View> : null}
              <TextInput style={globalStyles.input}
                  placeholder = "Enter Price"
                  onChangeText = {(val) => (priceInputChange(val), setPx(val))}
                  value = {Px}
                    // setPrice((parseFloat(val))))}
                  keyboardType = 'numeric'   /> 
              {!data.isValidPriceInput ? 
                <View> 
                  <Text style={{color: 'red', alignSelf:'center'}}>Please enter valid price</Text>
                </View> : null}

              <TextInput style={globalStyles.input}
                  placeholder = "Number of Shares"
                  // change made here, use numberINputChange to set State instead
                  value = {Num}
                  onChangeText = {(val) => (numberInputChange(val), setNum(val))}
                    // ,setNumShares((parseFloat(val))))}
                  // onBlur = {(val) => numberInputChange(val)}
                  keyboardType = 'numeric'   /> 
              {!data.isValidNumberInput ? 
                <View> 
                  <Text style={{color: 'red', alignSelf:'center'}}>Please enter valid number</Text>
                </View> : null}
              
              
              <PlusButton
                  // Buy
                  onPress =  {() => makeTransactionHandle(Symbol, Px, Num, 'Buy') }
                  // the below version will allow to input and remove number transaction to cross bc data has the input 
                  // and did not remove the last output
                  // onPress =  {() => makeTransactionHandle(data.ticker, data.price, data.number, 'Buy') }
                  // {() => updateStockHolding(Ticker) }
                  text = "Buy"  />

              <MinusButton
                  // Sell
                  onPress = {() => makeTransactionHandle(Symbol, Px, Num,'Sell') }
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
            
  

