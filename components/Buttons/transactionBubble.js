import React from 'react';
import { StyleSheet, TouchableOpacity, Text, View, Dimensions, FlatList } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

// button for Auth page only, buttons inside will be different
export default function transactionBubble({account,amount,date,type, ticker}) {
  console.log("ticker: " + ticker)
  return (
    
      <View style={styles.button}>
        <View style={styles.buttonRowText}>
          
          <Text style={styles.dateText}>{date}</Text>
          <Text style={styles.buttonText}>{ticker}</Text>
          <Text style={styles.buttonText}>{account}</Text>
          <Text style={styles.buttonText}>{type}</Text>
          <Text style={styles.buttonText}>{amount}</Text>


        </View> 
      </View>
  
  );
}

const styles = StyleSheet.create({
  button: {
    // marginVertical: 5,
    height: hp('8%'),
    //padding: 30,
    margin: 8,
    borderRadius: 8,
    //paddingVertical: 14,
    // paddingHorizontal: 10,
    // backgroundColor: '#f01d71',
    backgroundColor:'white',
    justifyContent: 'center',
  },
  
  buttonRowText: {
    
    flexDirection: 'row',

    margin: 10,
    fontSize: hp('5%'),
    //padding: 5,
    // fontSize: 16,
    color: 'black',
    justifyContent: 'center',

  },

  rightButtonText: {
    // color: 'white',
    //flexBasis: 100,
    fontSize: hp('2%'),
    flex: 2,
    color:'black',
    // fontWeight: 'bold',
    // textTransform: 'uppercase',
    // fontSize: 16,
  },

  dateText: {
    flex: 3,
    fontSize: hp('2%'),
    color: 'grey'
  },

  buttonText: {
    // color: 'white',
    flex: 2,
    flexDirection: 'row',
    // flexBasis: 300,
    color:'black',
    // fontWeight: 'bold',
    // textTransform: 'uppercase',
    fontSize: hp('2%'),
    // fontSize: 13,
    // textAlign: 'center',
  }
});
