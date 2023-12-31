import React, { useState, useEffect } from "react";
import type { FC } from "react";
import { BsFillExclamationTriangleFill } from "react-icons/bs";
import Panel from "./Panel";
import { eventEmitter } from './index'; // Import the event emitter

interface NodeProps {
  nodeData: { data: any } | null;
}

const NodeDisplay: FC<NodeProps> = ({ nodeData }) => {
  const [visibleNode, setVisibleNode] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [clickedNodeId, setClickedNodeId] = useState(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false); 

  useEffect(() => {
    // Subscribe to the 'nodeClicked' event
    const handleNodeClick = (nodeId: any) => {
      console.log('Received node ID:', nodeId); // Log the node ID
      setIsPanelOpen(true); 
      setClickedNodeId(nodeId);
    };
    
    eventEmitter.on('nodeClicked', handleNodeClick);

    // Clean up the subscription
    return () => {
      eventEmitter.off('nodeClicked', handleNodeClick);
    };
  }, []);

  useEffect(() => {
    // Reset clickedNodeId whenever searchTerm changes
    setClickedNodeId(null);
  }, [searchTerm]);

  const handleClick = (nodeId: any) => {
    console.log('we are in the nodeid');
    if (visibleNode === nodeId) {
      setVisibleNode(null);
    } else {
      setVisibleNode(nodeId);
    }
    //console.log('isPanelOpen:', isPanelOpen); // log the value of isPanelOpen
  };

  const resetSearch = () => {
    setSearchTerm('');
    setClickedNodeId(null);
  };

  useEffect(() => {
    console.log('isPanelOpen changed:', isPanelOpen);
  }, [isPanelOpen]);
  

  return (
    <Panel isDeployed={isPanelOpen} setIsDeployed={setIsPanelOpen}
      title={
        <>
          <BsFillExclamationTriangleFill className="text-muted" /> Node Index
        </>
      }
    >
      <p>
        This is going to be used to display descriptions and more information about the nodes.
      </p>
      <input 
        type="text" 
        placeholder="Search by node name or ID" 
        value={searchTerm} 
        onChange={(e) => setSearchTerm(e.target.value)} 
      />
      <button className="search-button" onClick={resetSearch}>Search</button>
      {isPanelOpen && nodeData && nodeData.data.sort((a: any, b: any) => a.name - b.name).filter((node: any) => {
  // If a node has been clicked, filter based on nodeId
  if (clickedNodeId) {
    return node.name === clickedNodeId;
  }
  // If no node has been clicked, filter based on search term
  return node.name.includes(searchTerm) || node.value.name.includes(searchTerm);
}).map((node: any) => {
  const nodeLink = `https://cwe.mitre.org/data/definitions/${node.name}.html`;
  return (
    <div className={`node-container ${visibleNode === node.name ? 'clicked' : ''}`} key={node.name}>
      <h3 className="node-id" onClick={() => handleClick(node.name)}>CWE-{node.name}: {node.value.name}</h3>
      {/* <p className="node-name">{node.value.name}</p> */}
      {visibleNode === node.name && (
        <>
          <p>Name: {node.value.name}</p>
          <p>Description: {JSON.stringify(node.value.description)}</p>
          <p>Link: <a className="node-link" href={nodeLink} target="_blank" rel="noopener noreferrer">{nodeLink}</a></p>
        </>
      )}
    </div>
  );
})}
    </Panel>
  );
};

export default NodeDisplay;







