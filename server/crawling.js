var Crawler = require("simplecrawler");
const { URL } = require('url')
const axios = require('axios');
const cheerio = require('cheerio');

const db = require('./databasepg')

async function fetchData(url){
  console.log("Crawling data...")
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

const crawlAndUpsertPrograms = function (url, pgClient){  //url not working 
  //crawling done here
  // var crawler = new Crawler('​https://www.healthwellfoundation.org/disease-funds');
  
  // crawler.maxConcurrency = 3

  // crawler.on('fetchcomplete', function(queueItem, responseBuffer, response) {
  //   console.log("I just received %s (%d bytes)", queueItem.url, responseBuffer.length);
  //   console.log("It was a resource of type %s", response.headers['content-type']);
  // });

  // crawler.start()

  // let url2 = 'https://www.healthwellfoundation.org/disease-funds'  //blocked
  // let url2 = 'https://www.walla.co.il/' 
  let url2 = 'https://www.cancercare.org/co_payment_fundings/acute-lymphoblastic-leukemia'
  
  new URL(url2); //test if url ok

  var crawler = new Crawler(url2);  //works !!!
  crawler.maxDepth = 2;

  crawler.on("fetchcomplete", function(queueItem, responseBuffer, response) {
    const crawlingUrl = queueItem.url
    fetchData(crawlingUrl).then( (res) => {
      const html = res.data;
      

      if(html.includes('Status') || html.includes('status')){
        parseHtmlAndGetData(html, pgClient, crawlingUrl)
        return; //so the website wont block me
      }

      // const statsTable = $('.table.table-bordered.table-hover.downloads > tbody > tr');
      // statsTable.each(function() {
      //     let title = $(this).find('td').text();
      //     console.log(title);
      // });
  })
    // console.log("\n%s (%d bytes) | %s", queueItem.url, responseBuffer.length, response.headers['content-type']);
    // console.log("Completed: %d, Length: %d", crawler.queue.complete(), crawler.queue.length);
  });

  crawler.start()
}

exports.crawlAndUpsertPrograms = crawlAndUpsertPrograms


exports.getUrlsAndStartCrawling = function (pgClient) {
  db.getUrlsForCrawling(pgClient).then(urls => {
    urls.forEach(url => {
      setInterval(() => {
        crawlAndUpsertPrograms(url, pgClient);
      }, 5 * 1000);
    });
  });
}
