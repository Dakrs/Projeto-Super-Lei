/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import React, { useEffect, useState } from 'react';
import { BottomNavigation, Text} from 'react-native-paper';

import { NavigationContainer } from '@react-navigation/native';


import { getUser } from '../../utils'
import api from '../../Services/api'



import Sync from './SyncScreen';
import AddTodoScreen from './AddTodoScreen'
import HomeScreen from './HomeScreen'
import ExitScreen from './ExitScreen'


var myDate1 = new Date();
var myDate2 = new Date("2016-05-15");

var todosArray = [
{_id : "223332",
  name: "Teste1",
  origin: "Github",
  priority: 3,
  description: "eu sozinho no mundo á esprra delas ssdsadsa sasaddsa asfsad a",
  date: myDate1,
},
{
  _id : "223323",
  name: "Teste2",
  origin: "Outlook",
  date: myDate2,
  priority: 3,
},
{
  _id : "22332",
  name: "Teste3",
  origin: "Github",
 
  priority: 3,
},{
  _id : "22322",
  name: "TESTE4",
  origin: "Github",
 
  priority: 3,
}
]

export default function Home({navigation}) {

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {key:'home',title:'Home',icon:'home',color:"#FFFFFF"},
    { key: 'sync', title: 'Sync', icon: 'sync',color:"#FFFFFF" },
    { key: 'add', title: 'Add', icon: 'plus',color:"#FFFFFF" },
    { key: 'history', title: 'History', icon: 'history',color:"#FFFFFF" },
    { key:  'exit', title:'Exit', icon: 'exit-to-app',color:"#FFFFFF"}
  ]);
  const [todos, setTodos]= useState([])

  useEffect(()=>{
    async function loadTodos(){
      var user= await getUser()
      user=JSON.parse(user)
      var response = await api.get('/api/tasks/'+user.user)
      response.data.forEach(element => {
        if(element.date)
            element.date= new Date(element.date)
      });
      console.log(response.data)
      setTodos(response.data)
    }
    loadTodos();
    
  

    
  },[])


  async function  submitNewTodo(name,priority,description){
    var user= await getUser()
    user=JSON.parse(user)
      var response= await api.post('/api/tasks/'+user.user, {
        name : name,
        priority : priority,
        description : description,
        origin : "Mobile App"
      })
      setTodos((prevTodos)=>[...prevTodos,response.data])       
    }
              

  const completeTodo = (id) => {
    api.put('api/state/confirm/'+id)
    .then(response => {
      setTodos(todos.filter(item => item._id !== id))
    })
    .catch(err => console.log(err))
  }

  const cancelTodo = (id) => {
    api.put('api/state/cancel/'+id)
    .then(response => {
      setTodos(todos.filter(item => item._id !== id))
    })
    .catch(err => console.log(err))
  
}


async function  syncGoogle (){

      var user= await getUser()
      user=JSON.parse(user)
      await api('/google/tasks/'+ user.user)
      await api('/google/calendar/' + user.user)
      await api('/google/emails/' + user.user)
      var response = await api.get('/api/tasks/'+user.user)
      response.data.forEach(element => {
        if(element.date)
            element.date= new Date(element.date)
      });
      console.log(response.data)
      setTodos(response.data)
    }


async function syncOutlook () {
  var user= await getUser()
  user=JSON.parse(user)
  await api('/outlook/calendar/' + user.user)
  await api('/outlook/emails/' + user.user)
  var response = await api.get('/api/tasks/'+user.user)
  response.data.forEach(element => {
    if(element.date)
        element.date= new Date(element.date)
      });
      setTodos(response.data)
}





  const HomeScreenRoute = () => <HomeScreen  Todos={todos} completeTodo={completeTodo} cancelTodo={cancelTodo} />;
  const SyncRoute = () => <Sync syncGoogle={syncGoogle}syncOutlook={syncOutlook} ></Sync>;
  const HistoryRoute = () => <Text>History</Text>;
  const  AddScreenRoute = () => <AddTodoScreen submitNewTodo={submitNewTodo}></AddTodoScreen>
  const ExitScreenRoute = ()  =><ExitScreen navigation={navigation}></ExitScreen>

 
  const renderScene = BottomNavigation.SceneMap({
    home: HomeScreenRoute ,
    sync: SyncRoute,
    add: AddScreenRoute,
    history: HistoryRoute,
    exit : ExitScreenRoute
    
  });
  

    return (
      <NavigationContainer>
      <BottomNavigation
      style={{flex:1}}
      navigationState={{index,routes}}
      onIndexChange={setIndex}
      renderScene={renderScene}
      inactiveColor={"#000000"}
      activeColor={"#000000"}
    />
    </NavigationContainer>
             
            );
          }
      
    
