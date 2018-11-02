var express = require('express')
var app = express()
var http = require('http').Server(app)
var port = (process.env.PORT || 3000)
var bodyParser = require('body-parser');

var dataParser = require("./dataParser")
var dataRetriever = require("./dataRetriever")
var dataTypeEnum = require("./dataTypeEnum")
var states = require("./stateNames")

app.use(bodyParser.json())
app.use(express.static('Public'))

//attributes
var hypothesis = null
var cachedDataPath = "/data"
var predictions = {
	lastUpdate: "",
	states: []
}
//data cached checker
function checkCacheValidity(){

}

//update cache
function updateCache(updatedData){

}
//


//methods
function getGoogleTrendsData(attr, callback){
	var parsedData = dataParser.parseData(attr, (data)=>{
		callback(data)
	})
	return parsedData
}

function statePrediction(obj, res){
	var attr = {
		state: obj.state,
		country: "AU",
		mode: dataTypeEnum.TIME,
		dataRetriever: dataRetriever,
		keywords: ["Liberal", "Labor", "Labour", "ALP", "LNP"],
		startDate: new Date(obj.startDateText),	//new Date(2013, 0, 1),
		endDate: new Date(obj.endDateText)	//2014, 0, 1)
	}

	getGoogleTrendsData(attr, (data)=>{

		var prediction = 1	//hypothesis.predict(parsedData)

		if(prediction == null){
			res.status(404).send()
		} else{//TODO: replace with actual prediction function
			var x = Math.round(Math.random())
			res.status(200).send({prediction: x, parsedData: data})
		}
	})
}


//REST API
app.get("/prediction/:stateId", (req, res) =>{
	var state = req.params.stateId
	if(states.indexOf(state) == -1){
		return null
	}
	console.log(req.body)
	obj = {
		state: state,
		startDateText: req.query.start,
		endDateText: req.query.end
	}

	statePrediction(obj, res)
});

app.listen(port);