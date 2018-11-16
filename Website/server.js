var express = require('express')
var app = express()
var http = require('http').Server(app)
var port = (process.env.PORT || 3000)
var bodyParser = require('body-parser')
var csvdb = require('csv-database')

var dataParser = require("./dataParser")
var dataRetriever = require("./dataRetriever")
var dataTypeEnum = require("./dataTypeEnum")
var states = require("./stateNames")

var db

app.use(bodyParser.json())
app.use(express.static('Public'));
app.get('/', function(req, res){
    res.sendfile('./Website/Public/index.html');
});

//attributes
const hypothesis_coefs = [-0.01838134, 0.02340413, -0.00656183, 0.00671311, -0.11187702, 0.10490222
, -0.0068639,  0.00717435]
const hypothesis_intercept = -6.66435586e-05

function hypothesis(features) {
	var thetaX = hypothesis_intercept
	for(var i = 0; i < hypothesis_coefs.length; ++i){
		thetaX += hypothesis_coefs[i]*features[i]
	}
	var prediction = 1/(1 + Math.exp(-thetaX))
	return prediction
}

//data cached checker
async function checkCacheValidity(state, startDate, endDate){
	var items = await db.get({state: state, startDate: startDate, endDate: endDate})
	if(items.length == 1){
		return true
	} else if(items.length > 1){
		console.log("ERR: csvdb, state " +state+ " , multiple copies found")
		return false
	} else{
		return false
	}
}

//update cache
async function updateCache(state, startDate, endDate, updatedData){
	var added = await db.add({country: 'AU', state: state, startDate: startDate, endDate: endDate, features: updatedData})
	return added.length == 1
}
//


//methods
function getGoogleTrendsData(attr, callback){
	dataParser.parseData(attr, (data)=>{
		callback(data)
	})
}

async function statePrediction(obj, res){
	var attr = {
		state: obj.state,
		country: "AU",
		mode: dataTypeEnum.TIME,
		dataRetriever: dataRetriever,
		keywords: ["Liberal", "Labor", "ALP", "LNP"],
		startDate: new Date(obj.startDateText),
		endDate: new Date(obj.endDateText)
	}

	if(await checkCacheValidity(attr.state, obj.startDateText, obj.endDateText) == true){
		var get = await db.get({state: attr.state, startDate: obj.startDateText, endDate: obj.endDateText})
		var prediction = hypothesis(get[0].features.split(",").map(x=>{parseInt(x)}))
		res.status(200).send({prediction: prediction})
	} else{
		getGoogleTrendsData(attr, (data)=>{
			if(data.indexOf(null) != -1 || data.filter((x)=>{return !isFinite(x)}).length > 0){
				res.status(404).send()
			} else{
				if(updateCache(attr.state, obj.startDateText, obj.endDateText, data)){
					console.log("cache updated")
				} else{
					console.log("ERR: cache update")
				}
				var prediction = hypothesis(data)
				res.status(200).send({prediction: prediction})
			}
		})
	}
	return
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

async function setup(){
	db = await csvdb("./data/cache.csv", ["country", "state", "startDate", "endDate", "features"], ",");
	console.log("setup complete")
}
setup()

app.listen(port);