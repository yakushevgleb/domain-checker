const express = require('express');
const app = express();
const request = require('request-promise');

app.get('/', function (req, res) {
  res.send("Hello! Go to /domains and pass query string name to check domain availability");
});

app.get('/domains', function (req, res) {


  let checkSuggested = request({
    url: `https://api.ote-godaddy.com/v1/domains/suggest?query=${req.query.name}`,
    headers: {
      "Accept": "application/json",
      "Authorization": "sso-key UzQxLikm_46KxDFnbjN7cQjmw6wocia:46L26ydpkwMaKZV6uVdDWe"
    }
  }).then(body => {
    return JSON.parse(body);
  });

  request({
    url: `https://api.ote-godaddy.com/v1/domains/available?domain=${req.query.name}`,
    headers: {
      "Accept": "application/json",
      "Authorization": "sso-key UzQxLikm_46KxDFnbjN7cQjmw6wocia:46L26ydpkwMaKZV6uVdDWe"
    }
  }).then(async body => {
    let result = {
      result: JSON.parse(body)
    };
    let suggested = await checkSuggested;
    result["suggested"] = suggested ? suggested : {};
    res.send(JSON.stringify(result));
  }).catch(async err => {
    let result = {
      result: err
    };
    let suggested = await checkSuggested;
    result["suggested"] = suggested ? suggested : {};
    res.send(JSON.stringify(result));
  });
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
