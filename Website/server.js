var express = require('express')
var app = express()
var http = require('http').Server(app)
var port = (process.env.PORT || 3000)

var dataParser = require("./dataParser")
var dataRetriever = require("./dataRetriever")
var dataTypeEnum = require("./dataTypeEnum")

app.use(express.static('Public'));

//attributes
var hypothesis = null
var cachedDataPath = "/data"
var predictions = []

//methods
function getGoogleTrendsData(state){

	dataParser.parseData({	retriever: dataRetriever,
							mode: dataTypeEnum.TIME
							country: "AU",
							state: state})

}

function statePrediction(state)




app.listen(port);