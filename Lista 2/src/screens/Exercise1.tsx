import React from 'react';
import { View, StyleSheet } from 'react-native';
import Constants from 'expo-constants';

export default function Exercise1() {
  return (
    <View style={styles.container}>
      <View style={[styles.half, styles.crimson]} />
      <View style={[styles.half, styles.salmon]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight,
    flexDirection: 'column',
  },
  half: {
    flex: 0.5,
  },
  crimson: {
    backgroundColor: 'crimson',
  },
  salmon: {
    backgroundColor: 'salmon',
  },
});