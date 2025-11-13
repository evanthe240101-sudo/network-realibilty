// Parse the edge list and return adjacency list
function parseEdges(text) {
  const lines = text.trim().split(/\n/).map(l => l.trim()).filter(Boolean);
  if (lines.length === 0) return { n: 0, edges: [] };

  let first = lines[0].split(/\s+/);
  let n = isNaN(first[0]) ? 0 : parseInt(first[0]);
  let start = (first.length === 2) ? 1 : 0;

  const edges = [];
  for (let i = start; i < lines.length; i++) {
    const [u, v] = lines[i].split(/\s+/).map(Number);
    if (!isNaN(u) && !isNaN(v)) edges.push([u, v]);
    n = Math.max(n, u, v);
  }

  const adj = Array.from({ length: n + 1 }, () => []);
  for (const [u, v] of edges) {
    adj[u].push(v);
    adj[v].push(u);
  }
  return { n, adj };
}

// Tarjan algorithm for articulation points and biconnected components
function findAPandBCC(adj) {
  const n = adj.length - 1;
  const disc = new Array(n + 1).fill(0);
  const low = new Array(n + 1).fill(0);
  const aps = new Set();
  const bccs = [];
  let time = 0;
  const stack = [];

  function dfs(u, parent) {
    time++;
    disc[u] = low[u] = time;
    let children = 0;

    for (const v of adj[u]) {
      if (!disc[v]) {
        children++;
        stack.push([u, v]);
        dfs(v, u);
        low[u] = Math.min(low[u], low[v]);

        if ((parent === null && children > 1) || (parent !== null && low[v] >= disc[u]))
          aps.add(u);

        if (low[v] >= disc[u]) {
          const comp = new Set();
          while (stack.length) {
            const [x, y] = stack.pop();
            comp.add(x);
            comp.add(y);
            if ((x === u && y === v) || (x === v && y === u)) break;
          }
          bccs.push([...comp]);
        }
      } else if (v !== parent && disc[v] < disc[u]) {
        low[u] = Math.min(low[u], disc[v]);
        stack.push([u, v]);
      }
    }
  }

  for (let i = 1; i <= n; i++) {
    if (!disc[i]) {
      dfs(i, null);
      if (stack.length) {
        const comp = new Set();
        while (stack.length) {
          const [x, y] = stack.pop();
          comp.add(x);
          comp.add(y);
        }
        bccs.push([...comp]);
      }
    }
  }

  return { aps: [...aps], bccs };
}

// UI
const edgelist = document.getElementById('edgelist');
const runBtn = document.getElementById('runBtn');
const demoBtn = document.getElementById('demoBtn');
const clearBtn = document.getElementById('clearBtn');
const apOut = document.getElementById('apOut');
const bccOut = document.getElementById('bccOut');

demoBtn.addEventListener('click', () => {
  edgelist.value = `7 8
1 2
1 3
2 3
2 4
4 5
5 6
6 4
6 7`;
});

clearBtn.addEventListener('click', () => {
  edgelist.value = '';
  apOut.textContent = '';
  bccOut.textContent = '';
});

runBtn.addEventListener('click', () => {
  const { n, adj } = parseEdges(edgelist.value);
  if (n === 0) {
    apOut.textContent = 'No graph data.';
    return;
  }
  const { aps, bccs } = findAPandBCC(adj);
  apOut.textContent = aps.length ? aps.join(', ') : 'None';
  bccOut.textContent = bccs.length
    ? bccs.map((c, i) => `BCC ${i + 1}: { ${c.join(', ')} }`).join('\n')
    : 'None';
});
