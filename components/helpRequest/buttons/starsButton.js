import React, { useState } from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { FLAG_COLOR_WHITE, FLAG_COLOR_ORANGE, FLAG_COLOR_GREEN } from "../../../constants/styleConstants";
import { updateFirebaseWithURL } from "../../../fireBase/database";
import { HELPS_COMPLETED_DB } from "../../../constants/appConstants";
import Icon from "react-native-vector-icons/FontAwesome";
import gql from "graphql-tag";
import { useMutation } from "react-apollo";

const UPDATE_HELP = gql`
    mutation UpdateHelp($id:String!, $key:String!,$value:Any, $type:String!, $operation:String!){
        updateHelp(id:$id, key:$key, value:$value, type:$type, operation:$operation){
            _id
        }
    }
`;

const Stars = (props) => {
    const { uidOfUser, keyOfHelpRequest } = props;
    const [starsGivenByUser,setStarsGivenByUser] = useState(0);
    const [updateHelp] = useMutation(UPDATE_HELP);

    handleGiveStars = () => {
        updateHelp({variables:{id:keyOfHelpRequest, key:"usersAccepted", value:{ [uidOfUser]: {stars: starsGivenByUser} }, type:"array", operation:"update"}})
    }

    return (
        <>
            <TouchableOpacity onPress={() => setStarsGivenByUser(1)}><Icon name={starsGivenByUser > 0 ? "star" : "star-o"} size={20} color={FLAG_COLOR_ORANGE} /></TouchableOpacity>
            <TouchableOpacity onPress={() => setStarsGivenByUser(2)}><Icon name={starsGivenByUser > 1 ? "star" : "star-o"} size={20} color={FLAG_COLOR_ORANGE} /></TouchableOpacity>
            <TouchableOpacity onPress={() => setStarsGivenByUser(3)}><Icon name={starsGivenByUser > 2 ? "star" : "star-o"} size={20} color={FLAG_COLOR_ORANGE} /></TouchableOpacity>
            <TouchableOpacity onPress={() => setStarsGivenByUser(4)}><Icon name={starsGivenByUser > 3 ? "star" : "star-o"} size={20} color={FLAG_COLOR_ORANGE} /></TouchableOpacity>
            <TouchableOpacity onPress={() => setStarsGivenByUser(5)}><Icon name={starsGivenByUser > 4 ? "star" : "star-o"} size={20} color={FLAG_COLOR_ORANGE} /></TouchableOpacity>
            <TouchableOpacity onPress={handleGiveStars}><Icon name="check-square" size={22} color={FLAG_COLOR_GREEN} /></TouchableOpacity> 
        </>
    )
}

export default Stars;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        backgroundColor: FLAG_COLOR_WHITE,
        borderWidth: 1,
        borderColor: FLAG_COLOR_ORANGE,
        margin: 10,
        borderRadius: 5,
        padding: 5,
    },
    help: {
        width: 50,
        fontSize: 20,
        color: FLAG_COLOR_ORANGE
    },
    text: {
        fontSize: 20
    }
});