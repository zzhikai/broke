import React from 'react';
import { StyleSheet, TouchableOpacity, Text, View, Dimensions, FlatList } from 'react-native';

import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

// button for Auth page only, buttons inside will be different
export default function stockButton({ticker, num, percentage, currPrice, pricePaid, stockName}) {
    console.log(stockName)
    // bc the percentage passed into the text is a function not the actual percentage
    const arrowSymbol = x => (x > 0 ? '▲' : '▼')
    const positiveOrNegative = (percentageChange) => 
      (percentageChange > 0 
          ? styles.positive
          : styles.negative)
    return (
        
        // <TouchableOpacity onPress={onPress}>
        <View style={styles.button}>
            <View style={styles.textInnerContainer}>
            
            <Text style={styles.buttonText}>{ticker}</Text>
            <Text style={styles.rightButtonText}>{currPrice * num}</Text>
            
            </View> 
          
            <View style={styles.belowTextInnerContainer}>
              <Text ellipsizeMode="tail" numberOfLines={1} style={styles.belowButtonText}>
                {stockName}
              </Text>
              <Text style={[styles.belowRightButtonText,positiveOrNegative(percentage)]}>
                {percentage}%
                {arrowSymbol(percentage)}
              </Text>
            </View> 

        </View>
        
        
    )
    
}

const styles = StyleSheet.create({
  button: {
    height: hp('8%'),
    margin: 8,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor:'white',
    justifyContent: 'center',
  },
  
  buttonRowText: {
    flexDirection: 'row',
    margin: 10,
    //fontSize: hp('5%'),
    color: 'black',
    alignItems: 'center'
  },

  rightButtonText: {
    // put inside textContainer?
    fontSize: hp('2%'),
    flex: 2,
    alignItems: 'center',
    textAlign: 'center',
    color:'black',

  },

  belowRightButtonText: {
    // put inside belowTextcontainer
    fontSize: hp('1.5%'),
    flex: 2,
    alignItems: 'center',
    textAlign: 'center',
    
  },

  buttonText: {
    // color: 'white',
    flex: 5,
    // flexBasis: 300,
    
    color:'black',
    marginLeft: 10,
    fontSize: hp('2%'),
    alignContent: 'center',
    // textAlign: 'center',
  },
  belowButtonText: {
    flex: 5,
    color:'black',
    marginLeft: 10,
    fontSize: hp('1.5%'),
    alignContent: 'center',
    color:'#7E7E7E',
    //color:'#616161',
  },
  // need to form a bottom textas well
  rightColumn: {
    flex: 2,
    flexDirection: 'column',
    justifyContent: 'center'
  },
  percentageText: {
    color: 'green',
    fontWeight: 'bold'
  },
  textInnerContainer: {
    marginBottom: 0,
    marginTop: hp('2%'),
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    flexGrow: 1,
  },
  belowTextInnerContainer: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    flexGrow: 1,
    marginTop: 0,
    marginBottom: hp('1%'),
  },
  companyName: {
    color: 'black',
    flex: 1,
    fontSize: 13,
    paddingRight: 1,
    marginLeft: 10,
  },
  positive: {
    color: '#03C04A',
  },
  negative: {
    color: 'red'
  }

});
