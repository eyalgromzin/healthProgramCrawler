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

const db = require('./databasepg')

const crawler = require('./crawling')

addRoutes(app, pgClient)


//jsut update the db for urls for new urls
crawler.getUrlsAndStartCrawling(pgClient);

app.listen(port, () => console.log(`Listening on port ${port}`));


