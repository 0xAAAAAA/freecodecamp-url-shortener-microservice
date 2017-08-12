var express = require("express");
var app = express();
var port = process.env.PORT || 3000;
var path = require("path");
var mongo = require("mongodb").MongoClient;
var number = 1;
var assert = require("assert");
app.use(express.static(path.join(__dirname, "views")));

app.get("/", function(req, res) {
  
});


function verifyHTTP(url) {
  var result = /[a-z](.)[a-z](.)[a-z]/i.test(url);
  if(result) {
    return true
  } else {
    return false
  }
}

function verifyHTTPS(url) {
  var result = /[a-z](.)[a-z](.)[a-z]/i.test(url);
  if(result) {
    return true
  } else {
    return false
  }
}

app.get("/new/:something", function(req, res) {
  res.json({
    error: "This URL is not valid. Please enter a valid URL."
  });
})

app.get("/new/http://:link", function(req, res) {
  if(verifyHTTP(req.params.link)) {
    mongo.connect(process.env.MONGOURI, function(err, db) {
      assert.equal(null, err);
      db.collection("url").insert({
        url: "http://"+req.params.link,
        number: number
      }, function(err, result) {
        assert.equal(null, err);
        res.json({
          original_url: "http://"+req.params.link,
          short_url: "https://agate-heart.glitch.me/"+number
        });
        number++;
      })
    })
  } else {
    res.json({
      error: "URL is not in a valid format. Please try again with a valid URL"
    })
  }
});

app.get("/new/https://:link", function(req, res) {
  if(verifyHTTPS(req.params.link)) {
    mongo.connect(process.env.MONGOURI, function(err, db) {
      assert.equal(null, err);
      db.collection("url").insert({
        url: "https://"+req.params.link,
        number: number
      }, function(err, result) {
        assert.equal(null, err);
        res.json({
          original_url: "https://"+req.params.link,
          short_url: "https://agate-heart.glitch.me/"+number
        });
        number++;
      })
    })
  } else {
    res.json({
      error: "URL is not in a valid format. Please try again with a valid URL"
    })
  }
});


app.get("/:id", function(req, res) {
  if((Number.isInteger(Number(req.params.id)))&&(req.params.id<=number)) {
    mongo.connect(process.env.MONGOURI, function(err, db) {
    assert.equal(null, err);
    db.collection("url").find({
      number: Number(req.params.id)
    }).toArray(function(err, docs) {
      assert.equal(null, err);
      if(docs) {
        res.redirect(docs[0].url);
      } else {
        res.json({
          error: "This URL is not available on the Database"
        })
      }
    })
  })   
  } else {
     res.json({
       error: "Please enter a valid number"
     });
  }
});




app.listen(port, function() {
  console.log("[SERVER] Server running at port " + 3000);
});









