import 'react-native-gesture-handler'; // part of react native navigator

import React from 'react';
import {Text, StyleSheet, LogBox} from 'react-native';
import {NavigationContainer} from '@react-navigation/native'; // the wrapper for navigation
import {createStackNavigator} from '@react-navigation/stack' // the navigation screen goes under the stack

import Home from './screens/Home';
import TimeTable from './screens/TimeTable';
import Icon from 'react-native-vector-icons/FontAwesome';

const Stack = createStackNavigator(); // creating an instance of a stack navigator

const App = () => {

  LogBox.ignoreAllLogs()

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="home" component={Home} options={({navigation}) => ({
          headerStyle: {backgroundColor: '#809ffc'},
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          title: "HOME",
          headerRight: () => (
            // <Text style={styles.editButton} onPress={() => console.log("clicked edited")}>Edit</Text>
            <Icon style={styles.editButton} name="edit"  color="white" size={20} onPress={(i) => navigation.navigate('timetable')}/>
          )
        })}/>
        <Stack.Screen name="timetable" component={TimeTable} options={{
          headerStyle: {backgroundColor: '#809ffc'},
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          title: "TIMETABLE"
        }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
const styles = StyleSheet.create({
  editButton: {
    marginRight: 15,
  }
})

export default App;