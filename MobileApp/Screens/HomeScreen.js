import TodosScreen from './TodosScreen';
import DetailsScreen from './DetailsScreen';


import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

const Stack = createStackNavigator();

export default class HomeScreen extends React.Component {

    render(){
        return(
    <Stack.Navigator
    initialRouteName="TodosScreen"
    >
    <Stack.Screen
      name="TodosScreen"
      component={TodosScreen}
      options={
        {headerShown:false}}
    />
     <Stack.Screen
      name="Details"
      component={DetailsScreen}
      
    />
    </Stack.Navigator>
    )
    }
}