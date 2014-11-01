#!/usr/bin/env node

var cheerio = require('cheerio');
var req = require('request');
var open_ = require('open');

var query = process.argv[2];
var linkChoice = process.argv[3];

var errorEmoji = '❗';
if ( !query ) {
  console.log( errorEmoji + '  problem: you didn\'t search for anything.' );
  process.exit(1);
}

searchFor(query);

function searchFor(query) {

  req( 'https://google.com/search?q=' + query, function(err, response, data) {

    if ( err ) {
      console.log( errorEmoji + err );
    }

    if ( response.statusCode === 404 ) {
      console.log( errorEmoji + '  problem: incorrect query.' );
      process.exit(1);
    }

    if ( response.statusCode === 200 ) {

      $ = cheerio.load(data);

      if ( !linkChoice) {
        $('h3.r').each( function(i, elem) {
          process.stdout.write( '[' + i + '] ' );
          console.log( $(this).text() );
        });
      } else {
        var HRef = $('h3.r a')[ linkChoice ].attribs.href;
        open_( HRef.slice(
          HRef.indexOf('=') + 1,
          HRef.indexOf('&')
        ));
      }
    }

  });

}

