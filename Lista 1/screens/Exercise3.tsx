import React from 'react';
import { View, StyleSheet } from 'react-native';
import Constants from 'expo-constants';

export default function Exercise3() {
  return (
    <View style={styles.container}>
      {/* Parte superior (igual ao Exercício 2) */}
      <View style={styles.topHalf}>
        <View style={[styles.rightColumn, styles.lime]} />
        <View style={styles.leftColumn}>
          <View style={[styles.half, styles.teal]} />
          <View style={[styles.quarter, styles.aquamarine]} />
        </View>
      </View>
      
      {/* Parte inferior (nova divisão com teal e skyblue) */}
      <View style={styles.bottomHalf}>
        
        <View style={[styles.half, styles.salmon]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight,
  },
  topHalf: {
    flex: 0.5,
    flexDirection: 'row',
  },
  leftColumn: {
    flex: 0.5,
    flexDirection: 'column',
  },
  rightColumn: {
    flex: 0.5,
  },
  bottomHalf: {
    flex: 0.5,
    flexDirection: 'row',
  },
  quarter: {
    flex: 1,
  },
  half: {
    flex: 1,
  },
  lime: {
    backgroundColor: 'lime',
  },
  aquamarine: {
    backgroundColor: 'aquamarine',
  },
  salmon: {
    backgroundColor: 'salmon',
  },
  teal: {
    backgroundColor: 'teal',
  },
});