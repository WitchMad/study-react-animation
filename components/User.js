/* Core */
import React, {useEffect, useRef} from 'react';

/* Presentational */
import {
  View,
  Text,
  Image,
  Alert,
  StyleSheet,
  Dimensions,
  Animated,
  TouchableWithoutFeedback,
  PanResponder,
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';

const {width} = Dimensions.get('window');

export default function User(props) {
  const {user} = props;

  const offset = useRef(new Animated.ValueXY({x: 0, y: 50})).current;
  const opacity = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,

      onPanResponderTerminationRequest: () => false,

      onPanResponderMove: Animated.event(
        [
          null,
          {
            dx: offset.x,
          },
        ],
        {useNativeDriver: false},
      ),

      onPanResponderTerminate: () => {
        Animated.spring(offset.x, {
          toValue: 0,
          bounciness: 10,
          useNativeDriver: false,
        }).start();
      },

      onPanResponderRelease: () => {
        if (offset.x._value < -200) {
          Alert.alert('Deleted!');
        }
        Animated.spring(offset.x, {
          toValue: 0,
          bounciness: 10,
          useNativeDriver: false,
        }).start();
      },
    }),
  ).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(offset.y, {
        useNativeDriver: false,
        toValue: 0,
        bounciness: 20,
      }),
      Animated.timing(opacity, {
        useNativeDriver: false,
        toValue: 1,
        duration: 500,
      }),
    ]).start();
  }, []); // eslint-disable-line

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={{
        transform: [
          ...offset.getTranslateTransform(),
          {
            rotateZ: offset.x.interpolate({
              inputRange: [width * -1, width],
              outputRange: ['-50deg', '50deg'],
            }),
          },
        ],
        opacity,
      }}>
      <TouchableWithoutFeedback onPress={props.onPress}>
        <View style={styles.userContainer}>
          <Image style={styles.thumbnail} source={{uri: user.thumbnail}} />

          <View style={[styles.infoContainer, {backgroundColor: user.color}]}>
            <View style={styles.bioContainer}>
              <Text style={styles.name}>{user.name.toUpperCase()}</Text>
              <Text style={styles.description}>{user.description}</Text>
            </View>
            <View style={styles.likesContainer}>
              <Icon name="heart" size={12} color="#FFF" />
              <Text style={styles.likes}>{user.likes}</Text>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  userContainer: {
    marginTop: 10,
    borderRadius: 10,
    flexDirection: 'column',
    marginHorizontal: 15,
  },

  thumbnail: {
    width: '100%',
    height: 150,
  },

  infoContainer: {
    backgroundColor: '#57BCBC',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 15,
  },

  bioContainer: {
    flex: 1,
  },

  name: {
    color: '#FFF',
    fontWeight: '900',
    fontSize: 10,
  },

  description: {
    color: '#FFF',
    fontSize: 13,
    marginTop: 2,
  },

  likesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 20,
  },

  likes: {
    color: '#FFF',
    fontSize: 12,
    marginLeft: 5,
  },
});
