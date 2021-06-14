import React from 'react'
import {View, Text} from 'react-native';
import { screenStyles } from './screenStyles';
import {globalStyles} from '../../globalStyles/globalStyles';
import {StatusBar} from 'expo-status-bar';


export default function Transactions() {
    return (
        <View style={globalStyles.container}>
            <Text> Transactions</Text>
            <StatusBar style = 'light'/>
        </View>
    )
}
