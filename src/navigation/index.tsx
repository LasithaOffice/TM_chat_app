import { View, Text } from 'react-native'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from '../screens/login';
import CreateAccount from '../screens/createAccount';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import Home from '../screens/home';

const Stack = createNativeStackNavigator();

const MainNavigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name='Login' component={Login} options={
          {
            headerShown: false
          }
        } />
        <Stack.Screen name='CreateAccount' component={CreateAccount} options={
          {
            title: "Create Account",
            headerStyle: {
              backgroundColor: '#111',
            },
            statusBarBackgroundColor: '#111',
            headerTintColor: '#fff'
          }
        } />
        <Stack.Screen name='Home' component={Home} options={
          {
            headerShown: false
          }
        } />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default MainNavigation