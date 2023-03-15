import React, {ReactNode} from 'react';
import {Modal, StyleSheet} from 'react-native';

import {
  interpolateColor,
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import useModal from 'store/hooks/useModal';
import {colors} from 'themeConfig';
import DynamicAnimatedPressable from './DynamicAnimatedPressable';
import DynamicView from './DynamicView';

type OverlayProps = {children?: ReactNode; onPress?: () => void};

const Overlay = ({children, onPress}: OverlayProps) => {
  const {state: modalState, actions} = useModal();

  const showOverlay = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      showOverlay.value,
      [0, 1],
      [colors.transparent, colors.overlayBackground],
    );

    return {
      backgroundColor,
    };
  });

  useAnimatedReaction(
    () => modalState.showModal,
    showModal => {
      if (showModal) {
        showOverlay.value = withTiming(1, {duration: 100});
      }
    },
  );

  const onOverlayPress = () => {
    showOverlay.value = withTiming(0, {duration: 100}, isFinished => {
      if (isFinished) {
        runOnJS(actions.setShowModal)(false);
        if (onPress) {
          runOnJS(onPress)();
        }
      }
    });
  };

  return (
    <Modal transparent statusBarTranslucent>
      <DynamicView flex={1} alignItems="center" justifyContent="center">
        <DynamicAnimatedPressable
          flex={1}
          disabled={!onPress}
          style={animatedStyle}
          onPress={onOverlayPress}
          {...StyleSheet.absoluteFillObject}
        />
        {children}
      </DynamicView>
    </Modal>
  );
};

export default Overlay;
