import React from 'react';
import { StyleSheet, TouchableOpacity, Text, View, Dimensions, FlatList, Image } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { images } from '../../globalStyles/images';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// button for Auth page only, buttons inside will be different
// for each text, different image? 
export default function homeButton({ text, onPress, num}) {
  var icon;
  if (text == 'Stocks') {
    icon = 'chart-line'
  } else if ( text == 'Cash' ) {
    icon = 'currency-usd'
  } else {
    icon = 'bank-outline'
  }
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.button}>
        <View style={styles.buttonRowText}>
        <MaterialCommunityIcons name={icon} size={hp('3%') } />
          <Text style={styles.buttonText}>{text}</Text>
          <Text style={styles.rightButtonText}>{num}</Text>

        </View> 
      </View>
    </TouchableOpacity>
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
    //fontSize: hp('2%'),
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
    alignItems : 'center',
    textAlign: 'center',
    // fontWeight: 'bold',
    // textTransform: 'uppercase',
    //fontSize: 16,
  },

  buttonText: {
    // color: 'white',
    flex: 5,
    // flexBasis: 300,
    color:'black',
    // fontWeight: 'bold',
    // textTransform: 'uppercase',
    //fontSize: 16,
    fontSize: hp('2%'),
    // textAlign: 'center',
  }
});
