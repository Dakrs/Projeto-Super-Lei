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


import Sync from './Screens/SyncScreen';
import AddTodoScreen from './Screens/AddTodoScreen'
import HomeScreen from './Screens/HomeScreen'


var myDate1 = new Date();
var myDate2 = new Date("2016-05-15");

var todosArray = [
{_id : "223332",
  title: "Teste1",
  origin: "Github",
  priority: 3,
  description: "eu sozinho no mundo á esprra delas ssdsadsa sasaddsa asfsad a",
  date: myDate1,
},
{
  _id : "223323",
  title: "Teste2",
  origin: "Outlook",
  date: myDate2,
  priority: 3,
},
{
  _id : "22332",
  title: "Teste3",
  origin: "Github",
 
  priority: 3,
},{
  _id : "22322",
  title: "TESTE4",
  origin: "Github",
 
  priority: 3,
}
]

export default function App() {

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {key:'home',title:'Home',icon:'home',color:"#FFFFFF"},
    { key: 'sync', title: 'Sync', icon: 'sync',color:"#FFFFFF" },
    { key: 'add', title: 'Add', icon: 'plus',color:"#FFFFFF" },
    { key: 'history', title: 'History', icon: 'history',color:"#FFFFFF" },
  ]);
  const [todos, setTodos]= useState([])

  useEffect(()=>{
    setTodos(todosArray)
  },[])


  const submitNewTodo= (name,priority,description) => {
    setTodos((prevTodos)=>[...prevTodos, {
                    _id : "33432",
                     title : name,
                     origin: "App", 
                     priority : priority, 
                     description :description }
                      ])                 
  }

  const completeTodo = (id) => {
      setTodos(todos.filter(item => item._id !== id))
  }

  const cancelTodo = (id) => {
    setTodos(todos.filter(item => item._id !== id))
  
}




  const HomeScreenRoute = () => <HomeScreen  Todos={todos} completeTodo={completeTodo} cancelTodo={cancelTodo} />;
  const SyncRoute = () => <Sync></Sync>;
  const HistoryRoute = () => <Text>History</Text>;
  const  AddScreenRoute = () => <AddTodoScreen submitNewTodo={submitNewTodo}></AddTodoScreen>


  const renderScene = BottomNavigation.SceneMap({
    home: HomeScreenRoute ,
    sync: SyncRoute,
    add: AddScreenRoute,
    history: HistoryRoute
    
  });
  

    return (
      <NavigationContainer>
      <BottomNavigation
      navigationState={{index,routes}}
      onIndexChange={setIndex}
      renderScene={renderScene}
      inactiveColor={"#000000"}
      activeColor={"#000000"}
    />
    </NavigationContainer>
             
            );
          }
      
    
        


