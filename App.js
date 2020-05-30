/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

const App: () => React$Node = () => {
  return (
    <>
      <ScrollView>
        <Text style={styles.hello}> Hello World </Text>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  hello: {
    textAlign: 'center',
    fontSize: 40,
    marginTop: 250
  }
});

export default App;
