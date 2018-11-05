const dataParser = require("./dataParser")
const dataRetriever = require("./dataRetriever")
const dataTypeEnum = require("./dataTypeEnum")
const fs = require('fs')

var dates =  [
	{state: "AU-NT",
	 elections: [
		{year: "2001",
		 start: "yyyy-mm-dd",
		 end: "yyyy-mm-dd"}
		]

	},

	{state: "AU-WA"},
	{state: "AU-ACT"},
	{state: "AU-NSW",
	 elections: [
		{year: "2003",
		 start: "2000-04-01",
		 end: "2003-03-21"},
		 {year: "2007",
		 start: "2004-04-01",
		 end: "2007-03-23"},
		 {year: "2011",
		 start: "2008-04-01",
		 end: "2011-03-25"},
		 {year: "2015",
		 start: "2012-04-01",
		 end: "2015-03-27"}
		]
	},
	{state: "AU-SA"},
	{state: "AU-VIC"},
	{state: "AU-QLD"},
	{state: "AU-TAS"}
]

var data = []
var promises = []
var x = 3
for(var i = 0; i < dates[x].elections.length; ++i){
	var attr = {
		state: dates[x].state,
		country: "AU",
		mode: dataTypeEnum.REGION,
		dataRetriever: dataRetriever,
		keywords: ["Liberal", "Labor", "ALP", "LNP"],
		startDate: new Date(dates[x].elections[i].start),
		endDate: new Date(dates[x].elections[i].end)
	}
	promises.push(new Promise((resolve, reject) => {
		var index = i
		getGoogleTrendsData(attr, (parsedData)=>{
			data[index] = parsedData
			resolve()
		})
	}))
}

Promise.all(promises).then(()=>{
	var lineData = []
	console.log(data)
	for(var i = 0; i < data.length; ++i){
		var line = data[i].join(",")
		lineData.push(line)
	}
	var stringData = lineData.join('\n')
	fs.writeFile("./data/"+dates[x].state+".csv", stringData, (err) => {
		if (err) {
			console.error(err)
		} else {
			console.log("File saved")
		}
	})
})

function getGoogleTrendsData(attr, callback){
	dataParser.parseData(attr, (data)=>{
		callback(data)
	})
}