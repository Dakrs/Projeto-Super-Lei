/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import React from 'react';
import { BottomNavigation, Text,Portal,Modal,Divider,Menu,Provider } from 'react-native-paper';
import {
  StyleSheet,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

import Sync from './Screens/SyncScreen';
import HomeScreen from './Screens/HomeScreen';

const HomeScreenRoute = () => <HomeScreen/>

const SyncRoute = () => <Sync/>;
    

const AddRoute = () => <Text>Text</Text>


const HistoryRoute = () => <Text>Recents</Text>;

    
export default class App extends React.Component {
  state = {
  index: 0,
  routes: [
    {key:'home',title:'Home',icon:'home',color:"#FFFFFF"},
    { key: 'sync', title: 'Sync', icon: 'sync',color:"#FFFFFF" },
    { key: 'add', title: 'Add', icon: 'plus',color:"#FFFFFF" },
    { key: 'history', title: 'History', icon: 'history',color:"#FFFFFF" },
    ],
  };
        
          _handleIndexChange = index => this.setState({ index });
        
          _renderScene = BottomNavigation.SceneMap({
            home: HomeScreenRoute,
            sync: SyncRoute,
            add: AddRoute,
            history: HistoryRoute,
          });
  
          

          
          render(){
            return (
                <NavigationContainer>
                <BottomNavigation
                navigationState={this.state}
                onIndexChange={this._handleIndexChange}
                renderScene={this._renderScene}
                inactiveColor={"#000000"}
                activeColor={"#000000"}
              />
              </NavigationContainer>
               
             
            );
          }
        }
    
        
