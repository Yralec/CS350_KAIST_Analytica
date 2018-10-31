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

	var parsedData = dataParser.parseData({	retriever: dataRetriever,
							mode: dataTypeEnum.TIME
							country: "AU",
							state: state})
}

function statePrediction(state){
	var parsedData = getGoogleTrendsData(state)
	var prediction = hypothesis.predict(parsedData)
	return prediction
}


//REST API
app.get('/prediction/:stateId', (req, res){

});

app.listen(port);