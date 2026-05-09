const fetch = require('node-fetch');

async function test() {
  const res = await fetch('http://localhost:3000/api/lecture?id=lecture-02');
  const json = await res.json();
  console.log(JSON.stringify(json, null, 2));
}

test();
