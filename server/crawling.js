var Crawler = require("simplecrawler");

exports.crawlAndUpsertPrograms = function (url, pgClient){
  //crawling done here
  var crawler = new Crawler(url).on("fetchcomplete", function(queueItem, responseBuffer, response) {
    console.log("I just received %s (%d bytes)", queueItem.url, responseBuffer.length);
    console.log("It was a resource of type %s", response.headers['content-type']);
  });
}

