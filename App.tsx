/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {
  Animated,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  useWindowDimensions,
  View,
} from 'react-native';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';
import MainNavigation from './src/navigation';
import { Provider } from 'react-redux';
import { store } from './src/redux/store';
import Avatar from './src/components/avatar';
import { Icon } from '@rneui/base';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';


function App(): React.JSX.Element {
  const backgroundStyle = {
    backgroundColor: Colors.darker,
    flex: 1,
  };

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <View style={{
          flex: 1,
        }}>
          <StatusBar
            barStyle={'light-content'}
            backgroundColor={backgroundStyle.backgroundColor}
          />
          <NavigationContainer>
            <MainNavigation />
          </NavigationContainer>
        </View>
      </SafeAreaProvider>
    </Provider >
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
