var express = require('express')
var app = express()
var http = require('http').Server(app)
var port = (process.env.PORT || 3000)

var dataParser = require("./dataParser")
var dataRetriever = require("./dataRetriever")
var dataTypeEnum = require("./dataTypeEnum")
var states = require("./stateNames")


app.use(express.static('Public'));

//attributes
var hypothesis = null
var cachedDataPath = "/data"
var predictions = {
	lastUpdate: "",
	states: []
}

//methods
function getGoogleTrendsData(state){
	if(states.indexOf(state) == -1){
		return null
	}
	var parsedData = dataParser.parseData({	retriever: dataRetriever,
							mode: dataTypeEnum.TIME,
							country: "AU",
							state: state})
}

function statePrediction(state){
	var attr = {
		location: "AU-VIC",
		keywords: ["Liberal", "Labor", "Labour", "ALP", "LNP", "CLP"],
		startDate: new Date("2015-01-01"),
		endDate: new Date("2018-01-01")
	}
	var parsedData = getGoogleTrendsData(state, )
	if(parsedData == null){
		return null
	}
	var prediction = hypothesis.predict(parsedData)
	return prediction
}


//REST API
app.get("/prediction/:stateId", (req, res) =>{
	//var state = req.session.stateId
	//var prediction = statePrediction(state)
	var prediction = 4
	if(prediction == null){
		res.status(404).send()
	}
	res.status(200).send(Math.round(Math.random()))
});

app.listen(port);