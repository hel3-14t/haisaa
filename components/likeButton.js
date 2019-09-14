import React, { Component } from "react";
import { TouchableOpacity, StyleSheet, Text , ActivityIndicator} from "react-native";
import firebase from "react-native-firebase";
import Icon from "react-native-vector-icons/AntDesign";
import { FLAG_COLOR_WHITE, FLAG_COLOR_ORANGE } from "../constants/styleConstants";
import { updateFirebase, pushToFirebase } from '../fireBase/database';

export default class LikeButton extends Component {
    constructor(props){
      super(props);
      const {data } = this.props;
      this.uid = firebase.auth().currentUser.uid;
      this.helpRequest = this.props.helpRequest;
      this.usersLiked = this.helpRequest.child("usersLiked");
      this.state = {
        likes: data.likes,
        userLiked: false,
        likedUserKey: null,
        isLoading: false
      }
    }
  
    componentDidMount() {
      this.helpRequest.on("child_changed", data => {
        this.setState( { [data.key]: data.val() })
      });
      this.setLikeStatus();
    }
    
    componentWillUnmount(){
        this.helpRequest.off();
    }

    handleLike = async () => {
      if(this.state.isLoading)return;
      this.setState({isLoading : true});
      const { likes,userLiked } = this.state;
      const i = userLiked ? -1 : 1;
      updateFirebase(this.helpRequest, "likes", likes + i);
      let key = null;
      if(!userLiked){
        const data = await pushToFirebase(this.usersLiked, this.uid);
        key = data.key;
      }
      this.setLikeStatus(key);
      this.setState({ isLoading : false });
    }
  
    setLikeStatus = (key) => {
      if(!this.state.userLiked){
      this.usersLiked.orderByValue(this.uid).equalTo(this.uid).limitToFirst(1).once("value", data => {
          if (data.val()) {
              this.setState({ userLiked: true });
          }
        });
      } else {
        this.usersLiked.child(this.state.likedUserKey).remove();
        this.setState({ userLiked: false });
      }
      this.setState({likedUserKey: key ? key : null});
    };
    
    render(){
      const { likes,userLiked, isLoading } = this.state;
      return (
        <TouchableOpacity style={[styles.container,{backgroundColor: userLiked ? FLAG_COLOR_WHITE:FLAG_COLOR_ORANGE}]} onPress={this.handleLike}>
          <Icon name="like1" color={userLiked ? FLAG_COLOR_ORANGE : FLAG_COLOR_WHITE} size={20} style={styles.likeIcon}/>
          <Text style={userLiked ? styles.textActive : styles.textInactive}>{likes}</Text>
          {isLoading && <ActivityIndicator color={userLiked?FLAG_COLOR_ORANGE:FLAG_COLOR_WHITE} />}
        </TouchableOpacity>
      );
    }
  }


  const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: "row",
      justifyContent: "center",
      backgroundColor: FLAG_COLOR_WHITE,
      borderWidth: 1,
      borderColor: FLAG_COLOR_ORANGE,
      margin: 3,
      borderRadius: 5,
      padding: 10
    },
    likeIconActive:{
    },
    likeIconInactive:{
    },
    textActive:{
        fontSize: 15,
        color: FLAG_COLOR_ORANGE
    },
    textInactive:{
      fontSize: 15,
      color: FLAG_COLOR_WHITE
  }
  });