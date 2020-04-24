// @flow
import React from 'react';
import { Dimensions, View } from 'react-native';
import gql from 'graphql-tag';
import { useQuery, useMutation } from 'react-apollo';
import { useAuth } from '../../customHooks';
import { Description, Button, Heading, InlineLoader } from '../../components/atoms';
import { WHITE, LIGHTEST_GRAY, ORANGE, LIGHT_GRAY } from '../../styles/colors';
import { ProfileName, TimeAndDistance, CustomModal, Message } from '../../components/molecules';
import { margin } from '../../styles/mixins';
import { FONT_SIZE_20 } from '../../styles/typography';

const heightForDescription = Dimensions.get('screen').height - 380

const QUERY = gql`
query Help($id: String!){
  help(id:$id) {
    status,
    description,
    usersAccepted {
      uid
      username
      mobileNo
      xp
      stars
    },
    usersRequested {
      uid
      username
      xp,
      mobileNo,
      stars
    },
    usersRejected {
        uid
    },
    usersCancelled {
        uid
    }
    timeStamp,
    noPeopleRequired,
    latitude,
    longitude,
    creatorName
  }
}
`;

const HELP_UPDATE_SCHEMA = gql`
  mutation UpdateHelp($id:String!,$key:String!,$value:Any){
    updateHelp(id:$id,key:$key,value:$value, type:"array", operation:"push"){
      _id
    }
  }
`;

const isUserIsThereInUsers = (users, userUid) => users.some((user) => user.uid === userUid);

const HelpRequestScreen = ({ route } : { route: Object }) => {
    const { params } = route;
    const { idOfHelpRequest } = params;
    const { data, loading, error } = useQuery(QUERY, { variables: { id: idOfHelpRequest }, pollInterval: 100 });
    const [updateHelp, { loading: loadingForUpdateHelp, error: errorForUpdateHelp }] = useMutation(HELP_UPDATE_SCHEMA);
    const { user } = useAuth();

    if(!user || !data) return <CustomModal variant="loading" />
    const { uid, attributes, username } = user;
    const { name , phone_number} = attributes;
    const { help } = data;
    const { description, distance, timeStamp, usersRequested, creatorName, usersRejected, usersAccepted, usersCancelled } = help;
    
    const handleHelp = () => {
        if(!loadingForUpdateHelp)
            updateHelp({ variables: { id: idOfHelpRequest, key: "usersRequested", value: { uid, name , xp: 0, mobileNo: phone_number , stars: 0, username } } });
    }

    let footer;
    if(errorForUpdateHelp) {
        footer = <InlineLoader variant="error" message="something went wrong" />
    } else if(loadingForUpdateHelp) {
        footer = <InlineLoader />
    } else if(isUserIsThereInUsers(usersRequested, uid)) {
        footer = <Message>Verification pending</Message>
    } else if(isUserIsThereInUsers(usersRejected, uid)) {
        footer = <Message>You can't help(Rejected)</Message>
    } else if((isUserIsThereInUsers(usersAccepted, uid))) {
        footer = <Message>Your already helping this guy</Message>
    } else if(isUserIsThereInUsers(usersCancelled, uid)) {
        footer = <Message>You Rejected to help this guy</Message>
    } else {
        footer = (
            <View style={{flexDirection: "row", justifyContent: 'flex-end', padding: 10 }}>
                <Button bgColor={LIGHTEST_GRAY}>Refer</Button>
                <View style={{width: 10}} />
                <Button onPress={handleHelp} loading={loadingForUpdateHelp} bgColor={ORANGE} textColor={WHITE}>Help</Button>
            </View>
        );
    }

    return (
        <View style={{flex: 1}}>
            <View style={{flex: 5, backgroundColor: WHITE, padding: 20 }}>
                <ProfileName name={creatorName} />
                <View style={{height: 20 }} />
                <Description height={heightForDescription}>{description}</Description>
                <TimeAndDistance timeStamp={timeStamp} distance={distance} />
            </View>
            {footer}
        </View>
    );
}

export default HelpRequestScreen;
