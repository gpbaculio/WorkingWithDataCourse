import {useMemo} from 'react';

import {useDispatch, useSelector} from 'react-redux';
import {bindActionCreators} from 'redux';

import * as modalActions from 'store/modal/actions';
import {AppReducerType} from 'store/store';

const useModal = () => {
  const dispatch = useDispatch();

  const state = useSelector(({modal}: AppReducerType) => modal);

  const actions = useMemo(
    () => bindActionCreators(modalActions, dispatch),
    [dispatch],
  );

  return {
    state,
    actions,
  };
};

export default useModal;
