var express = require('express')
var app = express()
var http = require('http').Server(app)
var port = (process.env.PORT || 3000)
var bodyParser = require('body-parser')
var csvdb = require('csv-database')
var ps = require('python-shell')

var dataParser = require("./dataParser")
var dataRetriever = require("./dataRetriever")
var dataTypeEnum = require("./dataTypeEnum")
var states = require("./stateNames")

var db

app.use(bodyParser.json())
app.use(express.static(__dirname+'/Public'));


//attributes
const hypothesis_coefs = [-0.28558575, -0.03708615, 0.46132637, -0.07423499, 0.12833407, -0.01007019, -0.0240681, -0.02977629]
const hypothesis_intercept = 0.00064419

function hypothesis(features) {
	var p = new Promise((res, rej)=>{
			ps.PythonShell.run('model.py', {
			mode: 'text',
			args: [JSON.stringify(features)]
		}, (err, results)=>{
			if(err){rej(err)}
			res(results)
		})
	})

	/*var p = new Promise((res, rej)=>{
		var thetaX = hypothesis_intercept
	for(var i = 0; i < hypothesis_coefs.length; ++i){
		thetaX += hypothesis_coefs[i]*features[i]
	}
	var prediction = 1/(1 + Math.exp(-thetaX))
	res(JSON.stringify(prediction))
	})*/

	return p
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
		hypothesis(get[0].features.split(",").map(x=>{return parseInt(x)})).then((result)=>{res.status(200).send({prediction: JSON.parse(result[0])})
		}).catch((err)=>{"ERR: prediction"})
		console.log("cache used")
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
				hypothesis(data).then((result)=>{res.status(200).send({prediction: JSON.parse(result[0])})
				}).catch((err)=>{"ERR: prediction"})
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
	db = await csvdb(__dirname+"/data/cache.csv", ["country", "state", "startDate", "endDate", "features"], ",");
	console.log("setup complete")
}
setup()

app.listen(port, ()=>{
	console.log("Server online on port "+port)
});