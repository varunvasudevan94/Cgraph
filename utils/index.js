
import { AsyncStorage, Alert } from 'react-native';
import _ from 'lodash';

import { MY_GRAPH, AFFECTED_LIST, POSITIVE } from '../consts';

export const getData = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      // We have data!!
      return value;
    }
  } catch (error) {
    // Error retrieving data
    return null;
  }
};

export const setData = async (submit, stat1, stat2, P1, P2) => {
  if (submit) {
    try {
      if (stat1 || stat2) {
        const prevAffectedListStr = await getData(AFFECTED_LIST);
        const prevAffectedList = prevAffectedListStr ? JSON.parse(prevAffectedListStr) : [];
        console.log(prevAffectedList);
        if (stat1 === POSITIVE) {
          prevAffectedList.push(P1);
        }
        if (stat2 === POSITIVE) {
          prevAffectedList.push(P2);
        }
        const _ret = await
                    AsyncStorage.setItem(AFFECTED_LIST,
                      JSON.stringify(_.uniq(prevAffectedList)));
      }

      const prevDataStr = await getData(MY_GRAPH);
      const prevData = prevDataStr ? JSON.parse(prevDataStr) : {};

      const P1Data = {node : P1, status: stat1};
      const P2Data = {node : P2, status: stat2};

      prevData[P1]  = prevData[P1] ? _.concat(prevData[P1], P2) : [P2];
      prevData[P2]  = prevData[P2] ? _.concat(prevData[P2], P1) : [P1];

      const _ret = await
                  AsyncStorage.setItem(MY_GRAPH, JSON.stringify(prevData));

      Alert.alert('Data Submitted');
    } catch (error) {
      // Report Error
    }
  }
};
