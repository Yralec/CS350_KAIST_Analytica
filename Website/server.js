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
var hypothesis_coefs = [-0.01838134, 0.02340413, -0.00656183, 0.00671311, -0.11187702, 0.10490222
, -0.0068639,  0.00717435]
var hypothesis_intercept = -6.66435586e-05
function hypothesis(features) {
	var thetaX = hypothesis_intercept
	for(var i = 0; i < hypothesis_coefs.length; ++i){
		thetaX += hypothesis_coefs[i]*features[i]
	}
	var prediction = 1/(1 + Math.exp(-thetaX))
	return prediction
}
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
	dataParser.parseData(attr, (data)=>{
		callback(data)
	})
}

function statePrediction(obj, res){
	var attr = {
		state: obj.state,
		country: "AU",
		mode: dataTypeEnum.TIME,
		dataRetriever: dataRetriever,
		keywords: ["Liberal", "Labor", "ALP", "LNP"],
		startDate: new Date(obj.startDateText),	//new Date(2013, 0, 1),
		endDate: new Date(obj.endDateText)	//2014, 0, 1)
	}
	getGoogleTrendsData(attr, (data)=>{
		if(data.indexOf(null) != -1 || data.filter((x)=>{return !isFinite(x)}).length > 0){
			res.status(404).send()
		} else{
			var prediction = Math.round(hypothesis(data))
			res.status(200).send({prediction: prediction, parsedData: JSON.stringify(data)})
		}
	})
}


//REST API
app.get("/prediction/:stateId", (req, res) =>{
	var state = req.params.stateId
	if(states.indexOf(state) == -1){
		return null
	}
	obj = {
		state: state,
		startDateText: req.query.start,
		endDateText: req.query.end
	}

	statePrediction(obj, res)
});

app.listen(port);