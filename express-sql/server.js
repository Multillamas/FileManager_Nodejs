'use strict'

// **********************
// Configurtation Serveur
// **********************

const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()
const multer = require('multer')
const path = require('path')
const fse = require('fs-extra')
const HTTP_OK = 200
const CONTENT_TYPE_JSON = 'application/json'
const CONTENT_TYPE_HTML = 'text/html'

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors())

let URL = []

// **************************
// DOCUMENTS-IMAGES SERVER
// **************************

// RESPONSE

app.get('/', function (request, response) {
  response.writeHead(HTTP_OK, { 'Content-Type': CONTENT_TYPE_HTML })
  response.end('<h1>Serveur Express SQL : Projet Node js</h1>')
})

// because this program was connected to a bigger structure, here we recover the fileownerid from another component
app.post('/addurl', function (req, res) {
  const url = req.body.url
  const fileownerid = req.body.fileownerid
  const name = req.body.name
  insertUrl(url, fileownerid, name)
})

app.post('/geturlbyid', function (req, res) {
  const fileownerid = req.body.fileownerid
  getUrlById(fileownerid, req, res, writeJSONResponse)
})

/* Verification of port service */

https.createServer(httpsOptions, app).listen(PORT, function () {
  console.log('Server listening on: https://localhost:%s', PORT)
})

function writeJSONResponse (request, response, result) {
  response.writeHead(HTTP_OK, { 'Content-Type': CONTENT_TYPE_JSON })
  response.end(JSON.stringify(result, null, 2))
}

//* *********************
//  MULTER CONFIGURATION
//* *********************

// configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads')
  },
  filename: (req, file, cb) => {
    const newFilename = file.originalname
    cb(null, newFilename)
  }
})

// instanciate multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5242880
  }
}).any()

// to upload files
app.post('/', function (req, res) {
  upload(req, res, function (err) {
    if (err) {
      console.log(err)
      return res.end('Error uploading file.')
    } else {
      res.end('File has been uploaded')
      req.files.forEach(file => {
        let scholar = req.body.selectedOption

        let extensionfile = path.basename(file.mimetype)

        if (
          extensionfile ==
          'vnd.openxmlformats-officedocument.wordprocessingml.document'
        ) {
          extensionfile = 'docx'
        }
        if (extensionfile == 'plain') {
          extensionfile = 'txt'
        }
        let fileownerid = req.body.fileownerid

        insertFiles(
          file.filename,
          file.path,
          fileownerid,
          scholar,
          extensionfile
        )
      })
    }
    console.log(req.body)
  })
})

// to get a list of files of one kind
app.get('/academicfiles', function (request, response) {
  const fileownerid = request.query.fileownerid
  const sql = `SELECT * FROM file WHERE fileownerid= ${fileownerid} AND istypeoffile = 1`
  con.query(sql, fileownerid, function (err, result) {
    if (err) throw err
    response.send(result)
  })
})

// to get a list of files of one kind
app.get('/identityfiles', function (request, response) {
  const fileownerid = request.query.fileownerid
  const sql = `SELECT * FROM file WHERE fileownerid= ${fileownerid} AND istypeoffile = 0`
  con.query(sql, fileownerid, function (err, result) {
    if (err) throw err
    response.send(result)
  })
})

// to download a file
app.get('/downloads', (req, resp) => {
  let file
  let filename = req.query.test
  file = __dirname + `/uploads/${filename}`

  resp.download(file, filename)
})

// to delete a file
app.post('/deletes', (req, resp) => {
  const filename = req.body.fileURL
  const path = __dirname + `/uploads/${filename}`
  const sql = 'delete from file where filename=?'

  fse
    .remove(path)
    .then(() => {
      console.log('success!')
      con.query(sql, filename, function (err, result) {
        if (err) throw err
        console.log('1 record deleted')
      })
    })
    .catch(err => {
      console.error(err)
    })
  writeJSONResponse(req, resp, 'File Deleted')
})

// **********
//  FUNCTIONS
// **********

// F to insert the file information into DB
function insertUrl (url, fileownerid, name) {
  const sql = 'INSERT INTO  (url, fileownerid,name) VALUES ?'
  const values = [[url, fileownerid, name]]
  con.query(sql, [values], function (err, result) {
    if (err) throw err
    console.log('1 record inserted')
  })
}

// F to get url by id
function getUrlById (fileownerid, req, res, writeJSONResponse) {
  con.query(
    "SELECT* FROM file WHERE fileownerid='" + fileownerid + "' ",
    function (err, result, fields) {
      if (err) throw err
      URL = result
      writeJSONResponse(req, res, URL)
    }
  )
}

// F insert files to the DB
function insertFiles (filename, path, fileownerid, istypeoffile) {
  const sql =
    'INSERT INTO `file` (`filename`, `path`, `fileownerid`, `istypeoffile`) VALUES ?'
  const values = [[filename, path, fileownerid, istypeoffile]]
  con.query(sql, [values], function (err, result) {
    if (err) throw err

    console.log('1 record inserted')
  })
}
