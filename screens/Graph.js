import React, { Component, useEffect, useState } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';
import AwesomeHierarchyGraph from 'react-native-d3-tree-graph'
import Graph from 'graph-data-structure';
import _ from 'lodash';

import { MY_GRAPH, AFFECTED_LIST, POSITIVE } from '../consts';
import { getData } from '../utils';

const fetchData = async () => {
  const graphDataStr = await getData(MY_GRAPH);
  const graphData = graphDataStr ? JSON.parse(graphDataStr) : {};
  return graphData ? graphData : null;
}

const recursiveTree = (nodeList) => {
  if (nodeList.length <= 0) {
    return [];
  }
  const head = nodeList.pop();
  console.log(head);
  console.log(nodeList);
  return {id: head,
    name: head,
    nodeTextStyle: { fontSize: 12 },
    imageUrl: { href: { uri: "https://facebook.github.io/react-native/docs/assets/favicon.png"}},
    nodeImageStyle: { imageHeight: 60 , imageWidth: 60, opacity: 1 },
    children : [recursiveTree(nodeList)]};
}
export default function () {
  const [graphData, setGraphData] = useState({});
  useEffect(() => {
    // XXX -  Move Read contacts to utils
    (async () => {
      const rawGraphData = await fetchData();
          if (rawGraphData) {
            const links = _.flatten(_.keys(rawGraphData)
                            .map(x => rawGraphData[x]
                            .map(y => {return {source :x, target :y, weight: 1}})));
            const nodes = _.keys(graph).map(x => {return {id:x}})
            const gr = {links: links, nodes: nodes};
            const graph = Graph(gr);
            setGraphData(recursiveTree(graph.depthFirstSearch()));
          }
      })();
    }, []);


    return (
        <View style={styles.container}>
        <View style={{flex:1}}>
        <AwesomeHierarchyGraph
         root = {graphData}
         siblings = {{}}
        />
        </View>
       </View>
    );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
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
