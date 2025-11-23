import React from 'react';
import { View, StyleSheet } from 'react-native';
import Constants from 'expo-constants';

export default function Exercise2() {
  return (
    <View style={styles.container}>
      <View style={styles.topHalf}>
        <View style={[styles.quarter, styles.lime]} />
        <View style={[styles.quarter, styles.aquamarine]} />
      </View>
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
  topHalf: {
    flex: 0.5,
    flexDirection: 'row',
  },
  half: {
    flex: 0.5,
  },
  quarter: {
    flex: 0.5,
  },
  //crimson: {
    //backgroundColor: 'crimson',
 // },
  salmon: {
    backgroundColor: 'salmon',
  },
  lime: {
    backgroundColor: 'lime',
  },
  aquamarine: {
    backgroundColor: 'aquamarine',
  },
});