const express = require('express');
const router = express.Router();
const https = require('https');
const http = require('http');

const riotKey = '?api_key=RGAPI-d72a13cb-3fb3-4109-9ec9-c36fb628fef8';
const baseReq = 'https://na1.api.riotgames.com/lol/';
const summonerReq = 'summoner/v3/summoners/by-name/';
const matchByIdReq = 'match/v3/matchlists/by-account/';
const match = 'match/v3/matches/';
const proStatsReq = 'http://api.lolesports.com/api/v2/tournamentPlayerStats?groupName=play_in_groups&tournamentId=a246d0f8-2b5c-4431-af4c-b872c8dee023';

/* GET api listing. */
router.get('/proStats', function (req, res) {
  getRequest(proStatsReq, http, function (status, result) {
    // console.log("onResult: (" + status + ")" + JSON.stringify(result));
    res.send(result)
  });
});

router.get('/recentMatches/:gameIds', function (req, res) {
  var gameIds = req.params['gameIds'].split(',');
  console.log(gameIds);
  var requestPromises = [];
  gameIds.forEach(function (id) {
    var promise = new Promise(function(resolve, reject) {
      getRequest(getMatch(id), https, function (status, result) {
        // console.log(result)
        resolve(result);
      });
    });
    requestPromises.push(promise);
  }); 
  Promise.all(requestPromises).then(function(matches) {
    res.send(matches);
  })
});

router.get('/recentMatchIds/:name', function (req, res) {
  var accountId = '';
  var summonerName = req.params['name'];
  var summonerRequestURL = getSummonerRequest(summonerName);
  console.log("Summoner: " + summonerRequestURL);

  getRequest(summonerRequestURL, https, function (status, result) {
    console.log("onSummonerResult: (" + status + ")");
    accountId = result['accountId'];
    getRequest(getMatchList(accountId, true), https, function (status, result) {
      console.log("onMatchListResult: (" + status + ")");
      result.accountId = accountId;
      res.send(result);
    })
  });
});

var getRequest = function (request, port, onResult) {
  
  var req = port.get(request, function (res) {
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
      // console.log('BODY: ' + body);
      var json = JSON.parse(body.toString());
      // ...and/or process the entire body here.
      onResult(res.statusCode, json)
    });
  });

  req.on('error', function (err) {
    //res.send('error: ' + err.message);
  });

  req.end();
};

var getSummonerRequest = function (summonerName) {
  return baseReq + summonerReq + summonerName + riotKey;
};

var getMatchList = function (summonerId, recent) {
  var recentTag = recent ? '/recent' : '';
  return baseReq + matchByIdReq + summonerId + recentTag + riotKey;
};

var getMatch = function (matchId) {
  return baseReq + match + matchId + riotKey;
};

module.exports = router;
