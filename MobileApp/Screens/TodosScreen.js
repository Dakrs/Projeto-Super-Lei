/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React,{useState, useEffect,}  from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  StatusBar,
} from 'react-native';

import NavBar from '../Components/NavBar';
import MyCard from '../Components/Card'
import { Provider as PaperProvider} from 'react-native-paper';

const todos = [
{_id : "223332",
  title: "Teste1",
  origin: "Google",
  priority: 3,
  description: "eu sozinho no mundo á esprra delas ssdsadsa sasaddsa asfsad a",
  date: "01 Feb 2017",
},
{
  _id : "223323",
  title: "Teste2",
  origin: "Google",
  date: "04 Feb 2017",
  priority: 3,
},
{
  _id : "22332",
  title: "Teste3",
  origin: "Outlook",
  date: "06 Feb 2017",
  priority: 3,
}
]




const TodosScreen = ({navigation})=> {
  

  return (
    <PaperProvider style={styles.font}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={{flex: 1, flexDirection:'column'}} >
      <NavBar style={{flex: 1}}/>
      <ScrollView style={{flex:1} }>
        {todos.map((todo) =>{
          return(
            <MyCard key={todo._id} navigation={navigation} todoInfo={todo}></MyCard>
          )
        })}
      </ScrollView>
      </SafeAreaView>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  font: {
    fontFamily:"Helvetica, Arial, sans-serif"
  }
})

export default TodosScreen;
