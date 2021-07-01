import { StyleSheet, Platform } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

export const globalStyles = StyleSheet.create({
    // the page is contained inside this
    container: {
        //height: hp('100%'),
        marginTop: Platform.OS == 'ios' ? 0 : -5,
        flex: 1,
        
        padding: 15,
        backgroundColor:'#001039'
    },

    modalContainer: {
        paddingTop: 'auto',
        marginTop: 'auto',
        flex: 1,
        padding: 15,
        paddingTop: 40,
        backgroundColor: 'rgba(0, 0, 0, 1)'
    },

    authContainer: {
        justifyContent: 'center',
        marginTop: 'auto',
        flex: 1,
        // alignItems: 'center',
        
        paddingTop: 50,
        padding: 20,
        backgroundColor:'#001039'
        
    },
    // header text on every page
    titleText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
    },
    chartContainer: {
        //flex: 1,
        //flexWrap: 'wrap',
        // position:'relative',
        alignItems: 'center',
        justifyContent:'center',
        paddingTop: hp('5%'),
        // using hp instead bc hp uses the available space instead of the entire screen
        height: hp('60%'),
        borderColor: 'white',
        // borderBottomColor: 'green',

    },

    paragraph: {
        marginVertical: 8,
        lineHeight: 20,
    },
    
    // text input, have the border as well as the background and the inner text
    input: {
        backgroundColor: 'white',
        // borderWidth: 1,
        borderColor: '#a6a6a6',
        borderWidth: 1,
        margin: 5,
        padding: 10,
        fontSize: 18,
        borderRadius: 6,
    },
 
    errorText: {
         color: 'crimson',
        fontWeight: 'bold',
        marginBottom: 10,
        marginTop: 6,
        textAlign: 'center',
  },

    welcomeMessage: {
         color: 'white',
         fontSize: hp('3%'),
         position: 'absolute',
         paddingTop: 40,
         paddingLeft: 15,        
         
  },

   subMessage: {
    color: 'white',
    fontSize: hp('2%'),
    position: 'absolute',
    //margin: 10,
    paddingTop: 70,
    paddingLeft: 15,  
   }
});