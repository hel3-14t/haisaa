// @flow
import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { ORANGE, WHITE } from '../../styles/colors';

const ProfileLetter = (props : { letter : String }) => {
  const { letter } = props;
  return (
    <View style={styles.textContainer}>
      <View style={styles.textWrapper}>
        <Text style={styles.text}>{letter}</Text>
      </View>
    </View>
  );
};

export default ProfileLetter;

const styles = StyleSheet.create({
  text: { fontSize: 28, color: WHITE },
  textWrapper: {
    position: 'absolute', 
    top: -5, 
    left: 0, 
    right: 0, 
    bottom: 0, 
    justifyContent: 'center', 
    alignItems: 'center',
  },
  textContainer: {
    backgroundColor: ORANGE,
    borderRadius: 15,
    width: 30,
    height: 30
  }
});
