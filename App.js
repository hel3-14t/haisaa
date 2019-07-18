/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

// packages
import React, { Component } from 'react';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import LinearGradient from 'react-native-linear-gradient';
// import { Alert } from 'react-native';

// screens
// import firebase from 'react-native-firebase';
import SignUpScreen from './screens/signUpScreen';
import OTPVerification from './screens/OTPVerification';
import MainScreen from './screens/mainScreen';
import LoginScreen from './screens/loginScreen';
import ResetPassword from './screens/resetPassword';

// constants
import { THEME_COLOR, FLAG_COLOR_BLUE, COLOR_1, COLOR_2, FLAG_COLOR_WHITE, FLAG_COLOR_ORANGE } from './constants/styleConstants';

const MainNavigator = createStackNavigator(
  {
    SignUp: { screen: SignUpScreen },
    OTP: { screen: OTPVerification },
    Main: { screen: MainScreen },
    Login: { screen: LoginScreen },
    ResetPassword: { screen: ResetPassword }
  },
  {
    initialRouteName: 'Login',
    defaultNavigationOptions: {
      headerStyle: {
        shadowOpacity: 0,
        elevation: 0,
        backgroundColor: FLAG_COLOR_ORANGE
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
        color: FLAG_COLOR_WHITE
      },
    },
  }
);

const AppContainer = createAppContainer(MainNavigator);

class App extends Component {
  render() {
    return <AppContainer />;
  }
}

export default App;
