import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import Constants from 'expo-constants';
import logo from '../assets/adaptive-icon.png';

export default function Exercise4() {
  return (
    <View style={styles.container}>
      {/* Parte superior */}
      <View style={styles.topHalf}>
        <View style={[styles.rightColumn, styles.lime]}>
          <Image source={logo} style={styles.image} />
        </View>
        <View style={styles.leftColumn}>
          <View style={[styles.half, styles.teal]}>
            <Image source={logo} style={styles.image} />
          </View>
          <View style={[styles.quarter, styles.aquamarine]}>
            <Image source={logo} style={styles.image} />
          </View>
        </View>
      </View>
      
      {/* Parte inferior */}
      <View style={styles.bottomHalf}>
        <View style={[styles.half, styles.salmon]}>
          <Image source={logo} style={styles.image} />
        </View>
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
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});