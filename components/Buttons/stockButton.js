import React from 'react';
import { StyleSheet, TouchableOpacity, Text, View, Dimensions, FlatList } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

// button for Auth page only, buttons inside will be different
export default function stockButton({ticker, num, percentage, currPrice, pricePaid}) {
  
  // bc the percentage passed into the text is a function not the actual percentage
    return (
        
        // <TouchableOpacity onPress={onPress}>
        <View style={styles.button}>
            <View style={styles.buttonRowText}>
            
            <Text style={styles.buttonText}>{ticker}</Text>
            {/* put in vertical stack 
            //cannot display percentage it seems
            */}
                <View style={styles.rightColumn}>
                    <Text style={styles.rightButtonText}>{num} </Text>
                    
                    <Text style={styles.percentageText}>{}</Text>
                </View> 
   
            </View> 
        </View>
        // </TouchableOpacity>
        
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
    alignItems: 'center'
    // justifyContent: 'center',

  },

  rightButtonText: {
    // color: 'white',
    //flexBasis: 100,
    fontSize: hp('2%'),
    // fontSize: 15,
    //flex: 2,
    color:'black',
    // fontWeight: 'bold',
    // textTransform: 'uppercase',
    
  },

  buttonText: {
    // color: 'white',
    flex: 5,
    // flexBasis: 300,
    
    color:'black',
    // fontWeight: 'bold',
    // textTransform: 'uppercase',
    marginLeft: 10,
    fontSize: 16,
    // textAlign: 'center',
  },
  // need to form a bottom textas well
  rightColumn: {
    flex: 1,
    // margin: 3,
    
    flexDirection: 'column',
    justifyContent: 'center'
  },
  percentageText: {
    //fontSize: hp('2%'),  
    //fontSize: 15,
    color: 'green',
    fontWeight: 'bold'
  }

});
