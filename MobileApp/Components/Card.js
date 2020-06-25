
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

  const myCard = ({navigation , todoInfo}) => {
    return (
<Card style={styles.card}>
          <Card.Content style={styles.cardContent}>
            <Title>{todoInfo.title}</Title>
              <Button icon="plus" color="#000000"  compact='false' onPress={() => navigation.navigate('Details',{todoInfo:todoInfo})}></Button> 
          </Card.Content>

          <Card.Content style={styles.cardContent}>
            <Paragraph style={styles.dateSize}>{todoInfo.origin}</Paragraph>
            <View style={styles.date}>
            <Icon
  name='date-range' size={10} color="grey" />
            <Paragraph style={styles.dateSize}>{todoInfo.date}</Paragraph>
          </View>
          </Card.Content>
           <Divider></Divider> 
          <Card.Content style={styles.cardContent}>
            <View style={styles.date}>
              <Icon name='check' size={10} color="green" />
              <Paragraph style={styles.comban}>Complete</Paragraph>
            </View>
            <View style={styles.date}>
              <Icon name='block' size={10} color="red" />
              <Paragraph style={styles.comban}>Cancel</Paragraph>
            </View>
            
          </Card.Content>

        </Card>
    )
  }


    const styles = StyleSheet.create({
        card: {
          flex:1,
          marginLeft: 25,
          marginRight:25,
          marginBottom:10,
          marginTop:10,
          

        },
        cardContent: {
          flex :1,
          backgroundColor: "#eaeaea",
          flexDirection:'row',  
          justifyContent:'space-between',
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

      export default myCard;