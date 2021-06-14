import React from 'react';
import { StyleSheet, TouchableOpacity, Text, View, Dimensions } from 'react-native';


// button for Auth page only, buttons inside will be different
export default function FlatButton({ text, onPress, num}) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.button}>
        <Text style={styles.buttonText}>{text}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    margin: 10,
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 10,
    // backgroundColor: '#f01d71',
    backgroundColor:'white',
  },
  buttonText: {
    // color: 'white',
    color:'black',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    fontSize: 16,
    textAlign: 'center',
  }
});
