// @flow
import React from 'react';
import { Input } from 'react-native-elements';
import { WHITE, INPUT_BORDER_COLOR, INPUT_TEXT_COLOR } from '../../styles/colors';
import { StyleSheet } from 'react-native';

type InputComponentProps = {
  label?: string,
  secureTextEntry?: boolean,
  updateParentState: Function
}

const InputComponent = (props: InputComponentProps) => {
  const { label = "", secureTextEntry = false, updateParentState } = props;
  const { labelStyle, containerStyle, inputContainerStyle, inputStyle } = styles;
  return (
    <Input
      label={label}
      labelStyle={labelStyle}
      inputContainerStyle={inputContainerStyle}
      inputStyle={inputStyle}
      containerStyle={containerStyle}
      secureTextEntry={secureTextEntry}
      onChangeText={value => updateParentState(value)}
    />
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    marginTop: 10,
    marginBottom: 10
  },
  labelStyle: {
    backgroundColor: WHITE,
    zIndex: 2,
    left: 40,
    top: -10,
    alignSelf: 'flex-start',
    position: 'absolute',
    paddingLeft: 5,
    paddingRight: 5
  },
  inputContainerStyle: {
    borderColor: INPUT_BORDER_COLOR,
    borderWidth: 1.5,
    borderRadius: 25,
    paddingLeft: 15,
  },
  inputStyle: {
    color: INPUT_TEXT_COLOR
  },
});
export default InputComponent;