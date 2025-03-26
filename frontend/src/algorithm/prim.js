import { Heap } from "./heap";

export const prim = async (links, startNode, endNode, updateVisual) => {
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
    
    const active = new Heap(compareEdge);
    const startEdge = {start: startNode, end: startNode, weight: 0}
    active.add(startEdge); 

    while (!active.isEmpty()) {
        const minEdge = active.remove();
        
        await new Promise((resolve) => {
            setTimeout(() => {
                updateVisual([...visited], minEdge.end)
                resolve(); 
            }, 1000)
        });

        // if (minEdge.start === startNode && minEdge.end === endNode) {
        //     visited.add(minEdge.end);
        //     return minEdge;  
        // } 

        if (visited.has(minEdge.end)) {
            continue; 
        }

        visited.add(minEdge.end);
        
        if (!nodeMap.has(minEdge.end)) {
            continue; 
        }
        for (const link of nodeMap.get(minEdge.end)) {
            if (!visited.has(link.target)) {
                const newPath = {
                    start: link.source, 
                    end: link.target, 
                    weight: link.weight
                }
                active.add(newPath); 
            }
        }

    }
    return undefined; 
}

const compareEdge = (edgeA, edgeB) => {
    return edgeA.weight - edgeB.weight; 
}