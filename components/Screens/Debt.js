import React from 'react'
import {View, Text} from 'react-native';
import { screenStyles } from './screenStyles';
import {globalStyles} from '../../globalStyles/globalStyles';
import { StatusBar } from 'expo-status-bar';

export default function Debt() {
    return (
        <View style={globalStyles.container}>
            <Text> Debt Screen </Text>
            <StatusBar style = 'light'/>
        </View>
    )
}
