var Crawler = require("simplecrawler");
const { URL } = require('url')
const axios = require('axios');
const cheerio = require('cheerio');

const db = require('./databasepg')

async function fetchData(url){
  console.log("FETCHING WEBSITE HTML...")
  // make http call to url
  let response = await axios(url).catch((err) => console.log(err));

  if(response && response.status && response.status !== 200){
      console.log("Error occurred while fetching data");
      return;
  }
  return response;
}

const parseHtmlAndGetData = (html, pgClient, crawlingUrl) => {
  const $ = cheerio.load(html)

  let h2Elements = $('h2')
  
  let statusElements = []
  Object.keys(h2Elements).forEach(keyI => {
    let elementI = h2Elements[keyI]

    let text = elementI.children && 
      elementI.children[0] && 
      elementI.children[0].children && 
      elementI.children[0].children[0] &&
      elementI.children[0].children[0].data
    
    let text2 = elementI.children && 
      elementI.children[0] && 
      elementI.children[0].data       

    if(text){
      if(text && text.toLowerCase().includes('status')){
        statusElements.push(elementI.children[0].children[0]) 
      }
    }

    if(text2){
      if(text2 && text2.toLowerCase().includes('status')){
        statusElements.push(elementI.children[0]) 
      }
    }
  })

  let programStatus = ''
  statusElements.forEach(elementI => {
    let statusText = elementI.parent.parent.children[1].children[0].data
    if(statusText.toLowerCase() == 'open' || statusText.toLowerCase() == 'closed'){
      //found open / close 
      programStatus = statusText
    }
  })

  if(programStatus){
    // dont have anough timr , so adding just 
    const programToAdd = {
      foundationName: 'foundationName',
      programName: 'programName',
      eligibleTreatments: ['1'],
      isOpenStatus: programStatus.toLowerCase() == 'open',
      grantAmount: 0,
      url: crawlingUrl
    } 

    db.addProgram(pgClient, programToAdd)
  }

}

const crawlAndUpsertPrograms = function (url, pgClient, urlsWithIsToWatch){  //url not working 
  var crawler = new Crawler(url);  //works !!!
  crawler.maxDepth = 2;

  crawler.on("fetchcomplete", function(queueItem, responseBuffer, response) {
    const crawlingUrl = queueItem.url
    
    let urlWithIsToWatch = urlsWithIsToWatch.find(urlWithIsToWatch => urlWithIsToWatch.programurl == crawlingUrl)
    if(!urlWithIsToWatch || urlWithIsToWatch.istowatch){
      fetchData(crawlingUrl).then( (res) => {
        const html = res.data;
  
        if(html.includes('Status') || html.includes('status')){
          parseHtmlAndGetData(html, pgClient, crawlingUrl)
          return; //so the website wont block me
        }
      })
    }
  });

  crawler.start()
}

exports.crawlAndUpsertPrograms = crawlAndUpsertPrograms

exports.getUrlsAndStartCrawling = async function (pgClient) {
  let urlsForCrawling  = await db.getUrlsForCrawling(pgClient)
  let urlsWithIsToWatch = await db.getIsToWatchUrls(pgClient)

  urlsForCrawling.forEach(url => {
    crawlAndUpsertPrograms(url.url, pgClient, urlsWithIsToWatch);
  });

  setInterval(async () => {
    let urlsForCrawling2  = await db.getUrlsForCrawling(pgClient)
    let urlsWithIsToWatch2 = await db.getIsToWatchUrls(pgClient)

    urlsForCrawling2.forEach(url => {
      crawlAndUpsertPrograms(url.url, pgClient, urlsWithIsToWatch2);
    })
  }, 60 * 60 * 1000);   //EVERY 1 HOUR

}
