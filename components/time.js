import React, { Component } from 'react';
import {
  Text, View
} from 'react-native';
// import SvgUri from 'react-native-svg-uri';

// const clockIcon = require('../__assets__/clock.svg');

class Time extends Component {
  constructor() {
    super();
    this.state = {
    };
  }

  // eslint-disable-next-line no-nested-ternary
  getStr = (value, str) => (Math.floor(value) === 0 ? '' : Math.floor(value) === 1 ? `${Math.floor(value)} ${str}` : `${Math.floor(value)} ${str}s`);

  getTimeDiffrence = (time) => {
    let timeDiffrence = '';
    const currentTime = new Date().getTime() + 1000 * 60 * 60 * 25;
    const inMilliSeconds = currentTime - time;
    const inSeconds = inMilliSeconds / 1000;
    const inMinutes = inSeconds / 60;
    if (inMinutes < 60) {
      timeDiffrence = `${this.getStr(inMinutes, 'minute')} ago`;
      return timeDiffrence;
    }
    const inHours = inMinutes / 60;
    const remainingMinutes = inMinutes % 60;
    if (inHours < 24) {
      timeDiffrence = `${this.getStr(inHours, 'hour')} ${this.getStr(remainingMinutes, 'minute')} ago`;
      return timeDiffrence;
    }
    const inDays = inHours / 24;
    if (inDays < 30) {
      const remainingHours = inHours % 24;
      const inMinutes1 = (remainingHours - Math.floor(remainingHours)) * 60;
      if (remainingHours < 1) {
        return `${this.getStr(inDays, 'day')} ${this.getStr(inMinutes1, 'minute')} ago`;
      }
      return `${this.getStr(inDays, 'day')} ${this.getStr(remainingHours, 'hour')} ${this.getStr(inMinutes1, 'minute')} ago`;
    }
    return 'Long time ago';
  }

  render() {
    const { time } = this.props;
    return (
      <View style={{ margin: 5, marginTop: 0, flexDirection: 'row' }}>
        {/* <SvgUri source={clockIcon} width="15" height="15" style={{ margin: 2 }} /> */}
        <Text>{this.getTimeDiffrence(time)}</Text>
      </View>
    );
  }
}

export default Time;
