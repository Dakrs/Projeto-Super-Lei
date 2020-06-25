
import React, {useState, } from 'react';
import NavigationBar from 'react-native-navbar';
import {View,StyleSheet} from 'react-native';
import { IconButton,Menu,Divider} from 'react-native-paper';




const titleConfig = {
    title: 'Your ToDos',
  };
 

  export default class NavBar extends React.Component {

    state = {
      visible: false,
    };
  
    _openOptions = () => this.setState({ visible: true });
  
    _closeOptions = () => this.setState({ visible: false });
  

    render(){
    return (
        <View styles={style.container}>
        <NavigationBar
        title={titleConfig}
        rightButton={
          <Menu
          visible={this.state.visible}
          onDismiss={this._closeOptions}
          anchor={
            <IconButton icon="dots-vertical" onPress={this._openOptions}>Show menu</IconButton>
          }
        >
          <Menu.Item onPress={() => {}} title="Reset" />
          <Divider/>
          <Menu.Item onPress={() => {}} title="Time" />
          <Divider/>
          <Menu.Item onPress={() => {}} title="Origin" />

        </Menu>
          }/>
      </View>
    )
  }
}

export const style = StyleSheet.create({
  container: {
      flex: 1,
    },
})