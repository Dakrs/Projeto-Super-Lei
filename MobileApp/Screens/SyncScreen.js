import * as React from 'react';
import {StyleSheet,View} from 'react-native'
import { Menu,Divider,Provider } from 'react-native-paper';

export default class Sync extends React.Component {

  render(){
    return(
      <View>
          <Menu.Item  icon='github-circle' onPress={() => {}} title="Github" />
          <Divider/>
          <Menu.Item icon='google'onPress={() => {}} title="Google" />
          <Divider/>
          <Menu.Item  icon= 'microsoft' onPress={() => {}} title="Outlook" /> 
      
      </View>
      
    )
  }
}


  const styles = StyleSheet.create({
    Appbar: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        justifyContent:'space-between'
    },
    Item: {
      backgroundColor: '#FFFFFF',
    }

  });

  
          