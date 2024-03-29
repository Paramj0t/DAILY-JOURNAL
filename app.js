const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true});

const articleSchema = {
    title: String,
    content: String
}

const Article = mongoose.model("Article", articleSchema);


//////////////////////////////////////////////Request Targetting All Articles//////////////////////////////////////////////

app.route("/articles")
    .get(function(req, res) {
            Article.find(function(err, foundArticles) {
                if(!err) res.send(foundArticles);
                else res.send(err);
            });
    })
    .post(function(req, res) {
                const newArticle = new Article({
                    title: req.body.title ,
                    content: req.body.content
                });
            
                newArticle.save(function(err) {
                    if(err) res.send(err);
                    else res.send("suc");
                });
    })
    .delete(function(req, res) {
                Article.deleteMany(function(err) {
                    if(err) res.send(err);
                    else res.send("suc");
                });
});

//////////////////////////////////////////////Request Targetting A Specific Articles//////////////////////////////////////////////


app.route("/articles/:articleTitle")

    .get(function(req, res) {

            Article.findOne({title: req.params.articleTitle}, function(err, foundArticle) {
                if(!err) res.send(foundArticle);
                else res.send(err);
            });
    })
    .put(function(req, res) {
        Article.update(
            {title: req.params.articleTitle}, // kispeh perform krna hai
            {title: req.body.title, content: req.body.content},
            {overwrite: true},  
            function(err) {
                if(err) res.send(err);
                else res.send("suc");
            }
        );
    })
    .patch(function(req, res) {
        Article.update(
            {title: req.params.articleTitle}, // kispeh perform krna hai
            {$set: req.body},
            function(err) {
                if(err) res.send(err);
                else res.send("suc");
            }
        );
    })
    .delete(function(req, res) {
        Article.deleteOne(
            {title: req.params.articleTitle}, // kispeh perform krna hai
            function(err) {
                if(err) res.send(err);
                else res.send("suc");
            }
        );
});





// app.get("/articles", function(req, res) {
//     Article.find(function(err, foundArticles) {
//         if(!err) res.send(foundArticles);
//         else res.send(err);
//     });
// });

// app.post("/articles", function(req, res) {
     
//     const newArticle = new Article({
//         title: req.body.title ,
//         content: req.body.content
//     });

//     newArticle.save(function(err) {
//         if(err) res.send(err);
//         else res.send("suc");
//     });
// });

// app.delete("/articles", function(req, res) {
//     Article.deleteMany(function(err) {
//         if(err) res.send(err);
//         else res.send("suc");
//     });
// });

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
