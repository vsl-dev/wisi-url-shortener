const express = require('express')
const bodyparser = require("body-parser");
const session = require("express-session");
const path = require("path");
const ejs = require("ejs");
const url = require("url");
const app = express()
const port = 8080
// const Database = require("lundb");
// const db = new Database()
const {
    JsonDatabase
} = require("wio.db");
const db = new JsonDatabase({
  databasePath:"./db/database.json"
});
const password = require('secure-random-password');

//function 

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
   }
   return result;
}

// view engine 

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.engine("html", ejs.renderFile);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname, "/public")));

// pages 

app.get("/", (req, res) => {
	res.render("index", {
		user: req.user
	});
});

app.get("/p/custom", (req, res) => {
	res.render("custom", {
		user: req.user
	});
});

// shortener

app.get('/create/custom', (req, res) => {
  const a = req.query.link
  const q = req.query.url
  if (
        db
          .has(req.query.url)
      )
        return res.send("This link is already in the system!");
  db.set(q, a)
//   res.json({"url": "https://url.vslpro.repl.co/" + q})
  res.render("success", {
	  url: q
  })
})

app.get('/create/random', (req, res) => {
 const a = req.query.link
 const q = makeid(5)

 if(db.has(q)) {
	const r = makeid(9)
	db.set(r, a)
	res.render("success", {
	  url: r
  })
   } else {
 db.set(q, a)
 res.render("success", {
	  url: q
  })}
//password.randomPassword({ lenght: 4, characters: [password.lower, password.upper, password.digits]}) | res.json({"url": "https://url.vslpro.repl.co/" + q})
})

app.get('/:code', (req, res) => {
	if(db.has(req.params.code) == true) {
  res.redirect(db.get(req.params.code))
	} else {
		res.status(404).send('<center><h1>404</h1></center>')
}});

app.listen(port, () => {
  console.log(`Proje ${port} üzerinden başlatıldı.`)
})
