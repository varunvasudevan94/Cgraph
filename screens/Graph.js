import React, { Component, useEffect, useState } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';

import Graph from 'graph-data-structure';
import NetworkGraph from './G';
import _ from 'lodash';

import { MY_GRAPH, AFFECTED_LIST, POSITIVE, P1_DEFAULT } from '../consts';
import { fetchData } from '../utils';


const dfs = (graph, root, visited) => {
  if (visited[root]) {
    return 0;
  }
  const children = graph[root];
  visited[root] = true;
  const _ret = children.map(x => dfs(graph, x, visited));

}
const updateStatus = (graph, affectedList) => {
  const keys = _.keys(graph);
  const visited = _.fromPairs(_.zip(keys, keys.map(x => false)));

  const _ret = affectedList.map(x => dfs(graph, x, visited));

  const newAffectedList = _.keys(_.keys(visited)
  .filter(key => visited[key])
  .reduce((obj, key) => {
    obj[key] = visited[key];
    return obj;
  }, {}));

  return newAffectedList;
}

export default function () {
    useEffect(() => {
    // XXX -  Move Read contacts to utils
    (async () => {
      const rawGraphData = await fetchData(MY_GRAPH);
      if (rawGraphData) {
            const nodes = _.keys(rawGraphData).map(x => x);
            const newValues = _.keys(rawGraphData).map(x => rawGraphData[x].map(y => nodes.indexOf(y)))
            const newKeys = _.keys(rawGraphData).map( x => nodes.indexOf(x));
            const newGraph = _.fromPairs(_.zip(newKeys, newValues));
            setNodes(nodes);
            setGraphData(newGraph);
            const rawAffectedList = await fetchData(AFFECTED_LIST);

            if (rawAffectedList) {
                  // Compute this from the graph
                  // Find the connected parts over here
                  updateList = updateStatus(rawGraphData, rawAffectedList);
                  const affectedList = updateList.map(x => nodes.indexOf(x));

                  setAffectedList(affectedList);
            }
      }
     })();
    }, []);

    const [ graphData, setGraphData] = useState({});
    const [ affectedList, setAffectedList] = useState([]);
    const [ nodes, setNodes ] = useState([]);


    return (
        <View style={styles.container}>
          <NetworkGraph
            selectedCircleIndex={nodes.indexOf(P1_DEFAULT)}
            markCircles={affectedList}
            circleTitles={nodes}
            connections={graphData}
            containerHeight={300}
            containerWidth={300}
            centralCircleRadius={40}
            otherCircleLinesColor="black"
            otherCirclesRadius={40}
            distanceFromCenter={100}
            onCircleClick={(x)=>null}/>
       </View>
    );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    backgroundColor: '#F5FCFF',
    flexDirection: 'row'
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
