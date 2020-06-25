
import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';

import {Card,
  Title,
  Paragraph,
  Button} from 'react-native-paper';
  import { Icon, Divider } from 'react-native-elements'

const DetailsScreen = ({navigation ,route})=> {
    
  const {todoInfo}= route.params
    return (
<Card style={styles.card}>
          <Card.Content style={styles.cardContent}>
            <Title>{todoInfo.title}</Title>
            {todoInfo.description ? (
            <View>
            <Title>Description</Title>
            <Paragraph>
              {todoInfo.description}
            </Paragraph>
            </View>
            ) : (
               <View></View> 
            )}


          <Title>Details</Title>  
          <Paragraph>Priority</Paragraph>
          <Paragraph>{todoInfo.priority}</Paragraph>
          <Paragraph>Expire Date</Paragraph>
          <Paragraph>{todoInfo.date}</Paragraph>
          <Paragraph>Origin</Paragraph>
          <Paragraph>{todoInfo.origin}</Paragraph>       
      
            
          </Card.Content>

        </Card>
    )}
 
    const styles = StyleSheet.create({
        card: {
          flex:1,
          marginLeft: 25,
          marginRight:25,
          marginBottom:10,
          marginTop:10,
          

        },
        date:{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center"
          
        },
        dateSize: {
          fontSize: 12,
          color:'grey' 
        },
      
        comban:{
          fontSize: 10,
        }
      
      });    
      export default DetailsScreen;
