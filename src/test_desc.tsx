import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import SingleNodeDescriptionPanel from './single_node_description_panel';
import DescriptionPanel from './description_panel';
import NearestNeighborTravDescriptionPanel from './nearest_neighbor_traversal_description';
import NodeDisplay from './node_display';
import RiskTraversalDescriptionPanel from './risk_visual_description'
import NearestNeighborExtraPanel from './nearest_neighbor_extra_panel';
import './styles.css'
import type { Data } from './nearest_neighbor_extra_panel'; // replace with the actual file path
import Risk_Visual_Panel_v2 from './risk_visual_desciption_v2';
import Top_Bottom_Visual_Panel from './top_bottom_visual_description';

function App() {
  const [mode, setMode] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  const [nodeDescriptionsData, setNodeDescriptionsData] = useState<{ data: any } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [nearestNeighborData, setNearestNeighborData] = useState<Data>({ path: [], edge_weights: [], total_risk: 0 });


  // First useEffect hook for adding the event listeners
  useEffect(() => {
    const modeSelect = document.getElementById('mode-select');
    const dataSelect = document.getElementById('data-select');

    if (modeSelect) {
      modeSelect.addEventListener('change', function(event) {
        setMode((event.target as HTMLSelectElement).value);
      });
    }

    if (dataSelect) {
      dataSelect.addEventListener('change', function(event) {
        setSelectedOption((event.target as HTMLSelectElement).value);
      });
    }
  }, []); // Empty dependency array so this runs only once when the component mounts

  // Second useEffect hook for fetching the data
  useEffect(() => {
    if (!selectedOption || (mode !== 'single-node' && mode !== 'better-traversal-visual' && mode !== 'start-node-distance' && mode !== 'updated-traversal-visual' && mode !== 'top-bottom-traversal-visual')) {
      return;
    }

    setIsLoading(true); // Set loading state to true when starting to fetch data

    //http://127.0.0.1:5000/all_node_description_data.json -- for local hosting
    //http://jwilson9567.pythonanywhere.com -- this is for online hosting
    fetch('https://jwilson9567.pythonanywhere.com/all_node_description_data.json', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `data_type=${selectedOption}`,
    })
    .then(response => response.json())
    .then(data => {
      console.log("Printing descriptions for all nodes for node_display element: ")
      console.log(data);
      setNodeDescriptionsData(data); // Store the data in state
      setIsLoading(false); // Set loading state to false when data has been fetched
    });
  }, [selectedOption, mode]); // selectedOption as a dependency

  return (
    <div className="panel-container">
      {isLoading ? (
        <div>Loading...</div> // Display loading indicator when isLoading is true
      ) : (
        <>
          {mode === '' && <DescriptionPanel />}
          {mode === 'single-node' && <SingleNodeDescriptionPanel />}
          {mode === 'single-node' && <NodeDisplay nodeData={nodeDescriptionsData} selectedOption={selectedOption} />}
          {mode === 'start-node-distance' && <NearestNeighborTravDescriptionPanel />}
          {mode === 'start-node-distance' && <NearestNeighborExtraPanel data={nearestNeighborData} />}
          {mode === 'start-node-distance' && <NodeDisplay nodeData={nodeDescriptionsData} selectedOption={selectedOption} />}
          {mode === 'better-traversal-visual' && <RiskTraversalDescriptionPanel />}
          {mode === 'better-traversal-visual' && <NodeDisplay nodeData={nodeDescriptionsData} selectedOption={selectedOption} />}
          {mode === 'updated-traversal-visual' && <Risk_Visual_Panel_v2 />}
          {mode === 'updated-traversal-visual' && <NodeDisplay nodeData={nodeDescriptionsData} selectedOption={selectedOption} />}
          {mode === 'top-bottom-traversal-visual' && <Top_Bottom_Visual_Panel />}
          {mode === 'top-bottom-traversal-visual' && <NodeDisplay nodeData={nodeDescriptionsData} selectedOption={selectedOption} />}
          {/* Add similar lines for the other modes... */}
        </>
      )}
    </div>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);







