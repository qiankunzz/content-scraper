var fs = require("fs");

// Creating a folder

console.log("Going to create directory /data");

fs.mkdir('data',function(err){
  if (err) {
    console.log("...");
    return console.error("Didn't make a new folder becuase the data folder exists!");
  }
    console.log("Directory created successfully!");
});

// Page Scraper
  // Import the Page Scraper module.
var PageScraper = require('page-scraper');
var csv = require("fast-csv");

function scrape() {
  // Create an instance of Page Scraper.
  var pageScraper = new PageScraper({
      baseUrl: 'http://www.shirts4mike.com'
  });

  // Scrape the page http://example.com/foo
  var scrapeData = [["title", "price", "imageURL", "pageURL", "scrapeTime"]];
  for (let i = 101; i < 109 ; i++) {
    var scrapeAttr = '/shirt.php?id=' + i;
    pageScraper.scrape(scrapeAttr, function(error, $) {
      if (error) {
        return console.error("Page is not responding!")
      }
        var price = $('.price').text();
        var title = $('.shirt-picture span img').attr('alt');
        var imageURL = 'http://www.shirts4mike.com/' + $('.shirt-picture span img').attr('src');
        var pageURL = 'http://www.shirts4mike.com'+ '/shirt.php?id=' + i;
        var scrapeTime = Date();
        var addedData = [title,price,imageURL,pageURL,scrapeTime];
        scrapeData.push(addedData);
    });
  }
  // setTimeout to so that the csv will not be written until we get full response
  setTimeout(function(){
    var fileName = Date() + ".csv";
    var ws = fs.createWriteStream("data/" + fileName);
    csv
       .write(scrapeData, {headers: true})
       .pipe(ws);
    console.log(scrapeData);
  },3000);

}

setInterval(function() {
  scrape();
},4000)
