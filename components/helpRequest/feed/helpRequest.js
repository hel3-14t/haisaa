import React, { useState, useEffect} from "react";
import { View, StyleSheet } from "react-native";
import HelpDescription from "../common/helpDescription";
import Time from "../../common/time";
import HelpButton from "../buttons/helpButton";
import ReferButton from "../buttons/referButton";
import { firebaseOnEventListner, firebaseOnEventListnerTurnOff } from "../../../fireBase/database";
import NoOfHelpers from './noOfHelpers';
import Distance from '../../common/distance';
import Card from "../../common/card";

const HelpRequest = (props) => {
  const { data } = props;
  const { pushUps, pullUps, noPeopleRequested, noPeopleAccepted, noPeopleRequired, description,distance, timeStamp, key, status} = data;
  const [state, setState] = useState(
    {
      pushUps, 
      pullUps, 
      noPeopleRequested, 
      noPeopleAccepted, 
      noPeopleRequired,
      status,
      disableHelp: false,
      helpErrorMessage: ""
    }
  );

  updateState = (data) => {
    if(Object.keys(state).includes(data.key)){
      setState( { ...state,[data.key]: data.val() })
    }
  }

  useEffect(() => {
    firebaseOnEventListner(`helps/${key}`,"child_changed",updateState);
    return (() => {
      firebaseOnEventListnerTurnOff(`helps/${key}`)
    });
  });

  return (
    <Card>
        <HelpDescription data={{ description }}/>
        <NoOfHelpers noPeopleAccepted={state.noPeopleAccepted} noPeopleRequired={state.noPeopleRequired} />
        <View style={styles.buttons}>
          <HelpButton data={data} />
          <ReferButton data={data} />
        </View>
        <View style={styles.timeAndDistance}>
          <Time time={timeStamp} /><Distance distance={distance} />
        </View>
    </Card>
  );
} 

export default HelpRequest;

const styles = StyleSheet.create({
  outerContanier: {
    margin:10,
    borderRadius: 5,
    flexDirection: "row",
    elevation: 5
  },
  buttons:{
    flex: 1,
    flexDirection: "row",
    justifyContent:'space-evenly'
  },
  timeAndDistance:{
    flex: 1,
    flexDirection: 'row',
  }
});
