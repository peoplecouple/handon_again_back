const express = require('express');
const app = express();
const mysql = require('mysql')
const path = require('path');
const { dirname } = require('path');
const port = process.env.PORT || 7000;
const cors = require('cors')
const bodyParser = require("body-parser")

let corsOptions = {
  origin: "*",
  credential: true,
}


app.use(cors(corsOptions));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, '../build')))

const db = mysql.createPool({
  host: "us-cdbr-east-06.cleardb.net",
  user: "b4059dcc6b07b6",
  password: "f9dc58c9",
  database: "heroku_68c78cacbbb41ea",
})


// const sqlQuery = 'SELECT *FROM BOARD;';
// db.query(sqlQuery, (err, result) => {
//   console.log(result)
// })



app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '../build/index.html'))
});


app.get('/board', (req, res) => {
  const sqlQuery = 'SELECT *FROM BOARD;'
  db.query(sqlQuery, (err, result) => {
    if (err) {
      console.log(err)
      res.sendStatus(500)
      return
    }
    res.send(result);
  })
  
})

app.post('/board/detail/', (req, res) => {
  const id = req.body.match_id;
  const sqlQuery = 'SELECT *FROM BOARD WHERE BOARD_id = ?;';
  db.query(sqlQuery, [id], (err, result) => {
    res.send(result);
  })
})

app.post('/board/write', (req, res) => {
  var title = req.body.title
  var content = req.body.content
  var writer = req.body.writer
  const sqlQuery = "INSERT INTO BOARD(BOARD_TITLE, BOARD_CONTENT, BOARD_WRITER) VALUES(?,?,?);"
  db.query(sqlQuery, [title, content, writer,], (err, result) => {
    res.send(result)

  })
})

app.post('/board/modify', (req, res) => {
  var title = req.body.title
  var content = req.body.content
  var writer = req.body.writer
  var id = req.body.id

  const sqlQuery = "UPDATE BOARD SET BOARD_TITLE = ?, BOARD_CONTENT = ?, BOARD_WRITER = ? WHERE BOARD_id = ?; "
  db.query(sqlQuery, [title, content, writer, id], (err, result) => {
    res.send(result)
  })
})

app.post('/board/delete', (req, res) => {
  var id = req.body.match_id
  const sqlQuery = "DELETE FROM BOARD WHERE BOARD_id = ?"
  db.query(sqlQuery, [id], (err, result) => {
    res.send(result)
  })
})


app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, '../build/index.html'))
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('../build'))
}

app.listen(port, () => {
  console.log(`running on port ${port}`);
});