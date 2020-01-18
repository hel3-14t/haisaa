import React, { useState, useContext } from "react";
import { Text, Input } from "react-native-elements";
import Icon from "react-native-vector-icons/Feather";
import { View, TouchableOpacity, Modal, StyleSheet, Alert } from "react-native";
import { FLAG_COLOR_WHITE, FLAG_COLOR_ORANGE, FONT_FAMILY } from "../../../constants/styleConstants";
import Context from '../../../context';
import gql from "graphql-tag";
import { useMutation } from "react-apollo";
import Button from "../../common/button";

const LIMIT = 3;

const HELP_REQUEST = gql`
  mutation CreateHelpRequest($uid:String!,$mobileNo:String!,$lat:Float!,$long:Float!,$desc:String!, $time:Date!, $name:String!, $noPeopleRequired:Int!){
    createHelp(data:{
      creator:$uid,
      mobileNo:$mobileNo,
      name:$name,
      latitude:$long,
      longitude:$lat,
      timeStamp: $time,
      noPeopleAccepted:0,
      noPeopleRequested:0,
      status:"REQUESTED",
      description:$desc,
      noPeopleRequired:$noPeopleRequired
    }){
      _id
    }
  }
`;

const noOfPeopleSelectBoxOptions = [1, 2, 3, 4, 5, 6];

const Option = ({ val }) => {
  return (
    <TouchableOpacity onPress={() => handleCheckBox(val)} style={getCheckBoxStyle(val)} key={val}>
      <Text style={getCheckBoxTextStyle(val)}>{val}</Text>
    </TouchableOpacity>
  );
}

const HelpRequestForm = () => {
  const [state, setState] = useState({
    formVisible: false,
    noPeopleRequired: 1,
    description: "",
    latitude: null,
    longitude: null,
    locationProviderAvailable: false,
    locationErrorMessage: "",
  });
  const contextValue = useContext(Context);

  const { currentUser } = contextValue;

  const { uid, displayName, phoneNumber } = currentUser;

  const [createHelp, { }] = useMutation(HELP_REQUEST);

  handleCheckBox = (val) => {
    setState({ ...state, noPeopleRequired: val, [`checkBox${val}`]: true });
  }

  handleAddHelpRequest = () => {
    setState({ ...state, formVisible: !state.formVisible });
  };

  getCheckBoxStyle = (val) => [styles.defaultCheckBoxStyle, state.noPeopleRequired === val ? styles.activeCheckBox : styles.inActiveCheckBox];

  getCheckBoxTextStyle = (val) => state.noPeopleRequired === val ? styles.activeText : styles.inActiveText;

  requestHelp = () => {
    const { description, noPeopleRequired } = state;
    const { longitude, latitude, locationProviderAvailable, locationErrorMessage, getPosition } = contextValue;
    if (description.length < LIMIT) {
      Alert.alert(`description should contain minimum ${LIMIT} characters`);
    } else if (locationProviderAvailable === false && latitude === null && longitude === null) {
      Alert.alert(locationErrorMessage ? locationErrorMessage : "location error");
      getPosition();
    } else {
      setState({ ...state, formVisible: !state.formVisible });
      createHelp({
        variables: {
          uid,
          mobileNo: phoneNumber,
          lat: latitude,
          long: longitude,
          desc: description,
          time: new Date().getTime(),
          name: displayName,
          noPeopleRequired
        }
      });
    }
  }

  return (
    <>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={handleAddHelpRequest}
        style={styles.touchableOpacityStyle}
      >
        <Icon name="plus" size={40} color={FLAG_COLOR_WHITE} />
      </TouchableOpacity>
      <Modal
        animationType='fade'
        transparent
        visible={state.formVisible}
        onRequestClose={handleAddHelpRequest}
      >
        <View style={styles.modalOuterContaner}>
          <View style={styles.modalInnerContainer}>
            <Text style={styles.question}>Can you type some description?</Text>
            <Input
              inputContainerStyle={styles.descriptionContainerStyle}
              multiline={true}
              numberOfLines={4}
              onChangeText={value => setState({ ...state, description: value })}
            />
            <Text style={styles.question}>How many people do you require?</Text>
            <View style={styles.noPeopleSelector}>
              {noOfPeopleSelectBoxOptions.map((val) => <Option key={val} val={val} />)}
            </View>
            <View style={styles.buttons}>
              <Button onPress={() => setState({ ...state, formVisible: !state.formVisible })}>Cancel</Button>
              <Button onPress={requestHelp}>Requset Help</Button>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

export default HelpRequestForm;

const styles = StyleSheet.create({
  modalOuterContaner: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    flexDirection: "row",
  },
  modalInnerContainer: {
    flex: 1,
    padding: 10,
    margin: 10,
    backgroundColor: FLAG_COLOR_WHITE,
    justifyContent: 'center',
    alignItems: "center",
    borderRadius: 10
  },
  touchableOpacityStyle: {
    position: 'absolute',
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    right: 30,
    bottom: 30,
    backgroundColor: FLAG_COLOR_ORANGE,
    borderRadius: 15
  },
  descriptionContainerStyle: {
    borderWidth: 1,
    borderColor: FLAG_COLOR_ORANGE,
    borderRadius: 5
  },
  noPeopleSelector: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  activeCheckBox: {
    backgroundColor: FLAG_COLOR_ORANGE,
    borderColor: FLAG_COLOR_ORANGE,
  },
  defaultCheckBoxStyle: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 10,
    paddingRight: 10,
    margin: 5,
    borderRadius: 5
  },
  inActiveCheckBox: {
    backgroundColor: FLAG_COLOR_WHITE,
    borderColor: FLAG_COLOR_ORANGE,
  },
  activeText: {
    color: FLAG_COLOR_WHITE,
    fontSize: 20,
    fontFamily: FONT_FAMILY
  },
  inActiveText: {
    color: FLAG_COLOR_ORANGE,
    fontSize: 20,
    fontFamily: FONT_FAMILY
  },
  buttons: {
    height: 60,
    display: 'flex',
    flexDirection: 'row'
  },
  question: {
    fontSize: 20,
    paddingTop: 5
  }
});