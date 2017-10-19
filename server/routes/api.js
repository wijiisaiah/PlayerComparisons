const express = require('express');
const router = express.Router();
const http = require('http');

const riotKey = '?api_key=RGAPI-aaa3bcc7-f297-497e-a5be-afc721a2e56f';
const baseReq = 'https://na1.api.riotgames.com/lol/';
const summonerReq = 'summoner/v3/summoners/by-name/';
const matchByIdReq = '/lol/match/v3/matchlists/by-account/';
const proStatsReq = 'http://api.lolesports.com/api/v2/tournamentPlayerStats?groupName=play_in_groups&tournamentId=a246d0f8-2b5c-4431-af4c-b872c8dee023';

/* GET api listing. */
router.get('/', function (req, res) {
  var accountId = '';
  var summonerRequestURL = getSummonerRequest("wijiisaiah");
  
  // getRequest(summonerRequestURL, function(status, result) {
  //   console.log("onResult: (" + status + ")" + JSON.stringify(result));
  //   accountId = result.accountId;
  // });
  //
  // var matchListRequest = getMatchList(accountId);
  getRequest(proStatsReq, function(status, result) {
    console.log("onResult: (" + status + ")" + JSON.stringify(result));
    res.send(result);
  })
  
});

var getRequest = function (request, onResult) {
  var req = http.get(request, function (res) {
    console.log('STATUS: ' + res.statusCode);
    console.log('HEADERS: ' + JSON.stringify(res.headers));
    var bodyChunks = [];

    // Buffer the body entirely for processing as a whole.
    res.on('data', function (chunk) {
      // You can process streamed parts here...
      bodyChunks.push(chunk);
    });

    res.on('end', function () {
      var body = Buffer.concat(bodyChunks);
      console.log('BODY: ' + body);
      var json = JSON.parse(body);
      // ...and/or process the entire body here.
      onResult(res.statusCode, json)
    });
  });

  req.on('error', function(err) {
    //res.send('error: ' + err.message);
  });

  req.end();
};

var getSummonerRequest = function (summonerName) {
  return baseReq + summonerReq + summonerName + riotKey;
};

var getMatchList = function (summonerId) {
  return baseReq + matchByIdReq + summonerId + riotKey;
};


module.exports = router;
