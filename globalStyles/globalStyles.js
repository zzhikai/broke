import { StyleSheet } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

export const globalStyles = StyleSheet.create({
    // the page is contained inside this
    container: {
        // made the stack header transparent
        paddingTop: 'auto',
        marginTop: 'auto',
        flex: 1,
        padding: 15,
        paddingTop: 40,
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
        color: '#333',
    },
    chartContainer: {
        //flex: 1,
        //flexWrap: 'wrap',
        position:'relative',
        alignItems: 'center',
        justifyContent:'center',
        
        // width: '0%',
        paddingTop: 110,
        height: '62%',
        borderColor: 'white',

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
        marginTop: 'auto',
        textAlign: 'center',
  },

    welcomeMessage: {
         color: 'white',
         fontSize: hp('3'),
         position: 'absolute',
         paddingTop: 69,
         paddingLeft: 10,        
         
  },

   subMessage: {
    color: 'white',
    fontSize: hp('2'),
    position: 'absolute',
    paddingTop: 100,
    paddingLeft: 10,  
   }
});