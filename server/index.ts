import * as express from 'express';
import { MongoClient } from 'mongodb';
import * as assert from 'assert';

const url = 'mongodb://moisture_db:27017';
const dbName = 'moisture';
const client = new MongoClient(url);

client.connect(err => {
  assert.strictEqual(null, err);

  const db = client.db(dbName);
  const collection = db.collection('measurements');

  client.close();
});

const app = express();
const port = 3000;

interface Data {
  moisture?: string;
};

interface Database {
  [id: number]: [{ data: Data, timestamp: number }];
};

let db: Database = {};

function addData(id: string, data: Data) {
  if (!Object.keys(db).includes(id)) {
    db[id] = [{ data, timestamp: Date.now() }];
  } else {
    db[id].append({ data, timestamp: Date.now() });
  }
}

app.get('/', (req, res) => {
  let html = '<html><head><title>Moisture Server!</title></head><body><h1>Moisture Server!</h1>';
  for (let id in db) {
    html += `<div><h2>${id}</h2><table><tr><th>Timestamp</th><th>Moisture</th></tr>`;
    for (let value of db[id]) {
      html += `<tr><td>${new Date(value.timestamp)}</td><td>${value.data.moisture}</td></tr>`;
    }
    html += '</table></div>';
  }
  html += '</body></html>';
  res.send(html);
});

app.post('/', express.urlencoded({ extended: false }));
app.post('/', (req, res) => {
  if (req.body) {
    if (req.body.id) {
      const id = req.body.id;
      let data = {};
      for (let key in req.body) {
        if (key !== 'id') {
          data[key] = req.body[key];
        }
      }
      addData(id, data);
    }
  }
  res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`Moisture Server listening at http://localhost:${port}`)
});
