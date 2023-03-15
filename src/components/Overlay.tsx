import React from 'react';
import {StyleSheet} from 'react-native';

import {
  interpolateColor,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import DynamicAnimatedView from './DynamicAnimatedView';
import useModal from 'store/hooks/useModal';
import {colors} from 'themeConfig';

const Overlay = () => {
  const {state: modalState} = useModal();

  const showOverlay = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      showOverlay.value,
      [0, 1],
      [colors.transparent, colors.overlayBackground],
    );

    return {
      backgroundColor,
      display: showOverlay.value === 1 ? 'flex' : 'none',
    };
  });

  useAnimatedReaction(
    () => modalState.showModal,
    showModal => {
      showOverlay.value = withTiming(showModal ? 1 : 0);
    },
  );

  return (
    <DynamicAnimatedView
      style={animatedStyle}
      backgroundColor="#495E57"
      {...StyleSheet.absoluteFillObject}
    />
  );
};

export default Overlay;
