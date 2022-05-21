const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 5000;

const {Client} = require('pg')
const { database } = require('pg/lib/defaults')

const pgClient = new Client({
  host: 'tyke.db.elephantsql.com',
  port: 5432,
  user: 'yxsaypni',
  password: 'T9TeN271tvUiCmBCDC1bRKi40Yf70j6y',
  database: 'yxsaypni',
})

pgClient.connect()

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const {crawlAndUpsertPrograms} = require('./crawling')

const {addRoutes} = require('./routes')

addRoutes(app, pgClient)

setInterval(() => {
  crawlAndUpsertPrograms('​https://www.healthwellfoundation.org/disease-funds', pgClient)
}, 60 * 1000);

app.listen(port, () => console.log(`Listening on port ${port}`));