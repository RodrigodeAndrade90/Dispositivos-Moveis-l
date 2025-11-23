import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import Constants from 'expo-constants';
import logo from '../assets/adaptive-icon.png';

export default function Exercise5() {
  const handleImagePress = () => {
    Alert.alert('Boa noite!');
  };

  return (
    <View style={styles.container}>
      {/* Parte superior */}
      <View style={styles.topHalf}>
        <View style={[styles.rightColumn, styles.lime, styles.centerContent]}>
          <TouchableOpacity onPress={handleImagePress}>
            <Image source={logo} style={styles.image} />
          </TouchableOpacity>
        </View>
        <View style={styles.leftColumn}>
          <View style={[styles.half, styles.teal, styles.centerContent]}>
            <TouchableOpacity onPress={handleImagePress}>
              <Image source={logo} style={styles.image} />
            </TouchableOpacity>
          </View>
          <View style={[styles.quarter, styles.aquamarine, styles.centerContent]}>
            <TouchableOpacity onPress={handleImagePress}>
              <Image source={logo} style={styles.image} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      
      {/* Parte inferior */}
      <View style={styles.bottomHalf}>
        <View style={[styles.half, styles.salmon, styles.centerContent]}>
          <TouchableOpacity onPress={handleImagePress}>
            <Image source={logo} style={styles.image} />
          </TouchableOpacity>
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
    width: 64,
    height: 64,
    resizeMode: 'cover',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});