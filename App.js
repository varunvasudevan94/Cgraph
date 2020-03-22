import * as React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

import Home from './screens/Home';
import Graph from './screens/Graph';
import NewForm from './screens/NewForm';
import Status from './screens/Status';

function MainStackNavigator() {
  const Stack = createStackNavigator();
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Home'>

        <Stack.Screen
            name='Home'
            component={Home}
            options={{ title: 'Home Screen' }} />

        <Stack.Screen
            name='Graph'
            component={Graph}
            options={{ title: 'Visualize' }}
        />

        <Stack.Screen
            name='NewForm'
            component={NewForm}
            options={{ title: 'New Entry' }}
        />

        <Stack.Screen
            name='Status'
            component={Status}
            options={{ title: 'Change Status' }}
        />

      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default MainStackNavigator
