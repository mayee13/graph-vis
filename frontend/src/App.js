import React, { useState, useEffect } from 'react';
import GraphEditor from './components/GraphEditor';
import './App.css';
import WelcomePage from './components/WelcomePage';
import SavedGraphs from './components/SavedGraphs';

const App = () => {
    const [graphs, setGraphs] = useState([]);
    const [currentGraph, setCurrentGraph] = useState({ nodes: ["A"], links: [] });
    const [graphName, setGraphName] = useState("");
    const [pageState, setPageState] = useState(3);

    // Fetch saved graphs on component mount
    useEffect(() => {
        fetchSavedGraphs();
    }, []);


    const saveGraph = async (graph) => {
        if (!graphName) {
            alert("Please enter a name for your graph.");
            return;
          }
          try {
            const response = await fetch("http://127.0.0.1:5000/save-graph", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                name: graphName,
                nodes: graph.nodes,
                links: graph.links,
              }),
            });
      
            const data = await response.json();
            if (data.message === "Graph saved or updated successfully!") {
              console.log(data.message)
              alert(data.message);
              fetchSavedGraphs(); // Refresh the list of saved graphs
            }
          } catch (error) {
            console.error("Error saving graph:", error);
          }
    }

    const fetchSavedGraphs = async () => {
        try {
            const response = await fetch("http://127.0.0.1:5000/saved-graphs");
            const data = await response.json();
            setGraphs(data);
          } catch (error) {
            console.error("Error fetching saved graphs:", error);
          }
    }

    const fetchGraphByName = async (name) => {
        try {
            const response = await fetch(`http://127.0.0.1:5000/graph/${name}`);
            const data = await response.json();
            if (!data.error) {
              setCurrentGraph(data);
              setGraphName(data.name);
              setPageState(2); 
            } else {
              console.error(data.error);
            }
          } catch (error) {
            console.error("Error fetching graph:", error);
          }
    }
    
    const doCreate = (name) => {
      console.log("do create!");
        if (!name) {
            alert("Please enter a name for your graph.");
            console.log("no name :(")
            return;
        }
        setGraphName(name); 
        setPageState(2); 
    }

    const doBackClick = () => {
        setPageState(1); 
        setCurrentGraph({ nodes: ["A"], links: [] })
        setGraphName("")
    }

    const doHome = () => {
      setPageState(3); 
    }

    const deleteGraph = async(name) => {
        try {
            const response = await fetch(`http://localhost:5000/delete-graph/${name}`, {
                method: 'DELETE',
            });
    
            if (response.ok) {
                const result = await response.json();
                console.log(result.message); // Log success message
                alert(result.message)
            } else {
                const error = await response.json();
                console.error(error.error); // Log error message
            }
        } catch (error) {
            console.error('Error deleting graph:', error);
        }
    }

    if (pageState === 1) {
      return (
        <div><SavedGraphs 
        graphs={graphs} 
        fetchGraphByName={fetchGraphByName} 
        doCreate={doCreate} 
        doHome={doHome}/></div>
      )
    } else if (pageState === 3) {
        return <div><WelcomePage onBack={doBackClick}/></div>
    }
    return (
        <div style={{ padding: '10px' }}>
            <h2>Graph Editor</h2>
            <GraphEditor 
            data = {currentGraph}
            graphName={graphName} 
            onSaveClick={saveGraph} 
            onBackClick={doBackClick} 
            onDeleteClick={deleteGraph}/>
        </div>
    );
};

export default App;