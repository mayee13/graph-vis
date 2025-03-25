import { Heap } from "./heap";

export const dijkstra = async (links, startNode, endNode, updateVisual) => {
    const nodeMap = new Map(); 

    for (const link of links) {
        if (nodeMap.has(link.source)) {
            nodeMap.get(link.source).push(link); 
        } else { 
            nodeMap.set(link.source, [link]); 
        }
    }

    // set of visited end nodes
    const visited = new Set();  
    
    const active = new Heap(comparePaths);
    const startPath = {start: startNode, end: startNode, steps: [], weight: 0}
    active.add(startPath); 

    while (!active.isEmpty()) {
        const minPath = active.remove();
        
        await new Promise((resolve) => {
            setTimeout(() => {
                updateVisual([...visited], minPath.end)
                resolve(); 
            }, 1000)
        });

        if (minPath.start === startNode && minPath.end === endNode) {
            visited.add(minPath.end);
            return minPath;  
        } 

        if (visited.has(minPath.end)) {
            continue; 
        }

        visited.add(minPath.end);
        
        if (!nodeMap.has(minPath.end)) {
            continue; 
        }
        for (const link of nodeMap.get(minPath.end)) {
            if (!visited.has(link.target)) {
                const newPath = {
                    start: startNode, 
                    end: link.target, 
                    steps: minPath.steps.concat([link]), 
                    weight: minPath.weight + parseInt(link.weight)
                }
                active.add(newPath); 
            }
        }

    }
    return undefined; 
}

const comparePaths = (pathA, pathB) => {
    return pathA.weight - pathB.weight; 
}