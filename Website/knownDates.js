const dataParser = require("./dataParser")
const dataRetriever = require("./dataRetriever")
const dataTypeEnum = require("./dataTypeEnum")
const fs = require('fs')

var dates =  [
	{state: "AU-NT",
	 elections: [
		{year: "2001",
		 start: "1999-09-01",
		 end: "2001-08-17",
		 result: 0},
		 {year: "2005",
		 start: "2003-09-01",
		 end: "2005-06-17",
		 result: 1},
		 {year: "2008",
		 start: "2006-07-01",
		 end: "2008-08-08",
		 result: 1},
		 {year: "2012",
		 start: "2009-09-01",
		 end: "2012-08-24",
		 result: 0},
		 {year: "2016",
		 start: "2013-09-01",
		 end: "2016-08-26",
		 result: 1}
		]},
	{state: "AU-WA",
	 elections: [
		{year: "2001",
		 start: "1998-04-01",
		 end: "2001-02-9",
		 result: 1},
		 {year: "2005",
		 start: "2002-04-01",
		 end: "2005-02-25",
		 result: 1},
		 {year: "2008",
		 start: "2006-04-01",
		 end: "2008-09-05",
		 result: 0},
		 {year: "2013",
		 start: "2009-04-01",
		 end: "2013-03-08",
		 result: 0},
		 {year: "2017",
		 start: "2014-04-01",
		 end: "2017-03-10",
		 result: 1}
		]},
	{state: "AU-ACT",
	 elections: [
		{year: "2001",
		 start: "1998-11-01",
		 end: "2001-10-19",
		 result: 1},
		 {year: "2004",
		 start: "2002-11-01",
		 end: "2004-10-15",
		 result: 1},
		 {year: "2008",
		 start: "2005-11-01",
		 end: "2008-10-17",
		 result: 1},
		 {year: "2012",
		 start: "2009-10-01",
		 end: "2012-10-19",
		 result: 1},
		 {year: "2016",
		 start: "2013-11-01",
		 end: "2016-10-14",
		 result: 1}
		]},
	{state: "AU-NSW",
	 elections: [
		{year: "2003",
		 start: "2000-04-01",
		 end: "2003-03-21",
		 result: 1},
		 {year: "2007",
		 start: "2004-04-01",
		 end: "2007-03-23",
		 result: 1},
		 {year: "2011",
		 start: "2008-04-01",
		 end: "2011-03-25",
		 result: 0},
		 {year: "2015",
		 start: "2012-04-01",
		 end: "2015-03-27",
		 result: 0}
		]},
	{state: "AU-SA",
	 elections:[
	 	{year: "2002",
		 start: "1999-03-01",
		 end: "2002-02-08",
		 result: 1},
		 {year: "2006",
		 start: "2003-03-01",
		 end: "2006-03-17",
		 result: 1},
		 {year: "2010",
		 start: "2007-04-01",
		 end: "2010-03-19",
		 result: 1},
		 {year: "2014",
		 start: "2011-04-01",
		 end: "2014-03-14",
		 result: 1},
		 {year: "2018",
		 start: "2015-04-01",
		 end: "2018-03-16",
		 result: 0}
		]},
	{state: "AU-VIC",
	 elections: [
		{year: "2002",
		 start: "1999-12-01",
		 end: "2002-11-29",
		 result: 1},
		 {year: "2006",
		 start: "2003-12-01",
		 end: "2006-11-24",
		 result: 1},
		 {year: "2010",
		 start: "2007-12-01",
		 end: "2010-11-26",
		 result: 1},
		 {year: "2014",
		 start: "2011-12-01",
		 end: "2014-11-28",
		 result: 1}
		]},
	{state: "AU-QLD",
		elections: [
		{year: "2001",
		 start: "1998-03-01",
		 end: "2001-02-16",
		 result: 1},
		 {year: "2004",
		 start: "2002-03-01",
		 end: "2004-02-06",
		 result: 1},
		 {year: "2006",
		 start: "2005-03-01",
		 end: "2006-09-08",
		 result: 1},
		 {year: "2009",
		 start: "2007-10-01",
		 end: "2009-03-20",
		 result: 1},
		 {year: "2012",
		 start: "2010-04-01",
		 end: "2012-03-23",
		 result: 0},
		 {year: "2015",
		 start: "2013-04-01",
		 end: "2015-01-30",
		 result: 1},
		 {year: "2017",
		 start: "2016-03-01",
		 end: "2017-11-24",
		 result: 1}
		]},
	{state: "AU-TAS",
		elections: [
		{year: "2002",
		 start: "1999-08-01",
		 end: "2002-07-19",
		 result: 1},
		 {year: "2006",
		 start: "2003-08-01",
		 end: "2006-11-24",
		 result: 1},
		 {year: "2010",
		 start: "2004-12-01",
		 end: "2010-03-19",
		 result: 1},
		 {year: "2014",
		 start: "2011-04-01",
		 end: "2014-03-14",
		 result: 0},
		 {year: "2018",
		 start: "2015-04-01",
		 end: "2018-03-02",
		 result: 0}
		 ]}
]


function loop(count, callback, done) {
    var counter = 0;
    var next = function () {
        setTimeout(iteration, 300);
    };
    var iteration = function () {
        if (counter < count) {
            callback(counter, next);
        } else {
            done && done();
        }
        counter++;
    }
    iteration();
}

var data = []
var promises = []
var lineIndex = 0;

var x = 0
loop(dates.length, (x, nextX)=>{
    loop(dates[x].elections.length, (i, nextI)=>{
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
			var stateIndex = x
			var electionIndex = i
			var index = lineIndex
			getGoogleTrendsData(attr, (parsedData)=>{
				data[index] = parsedData
				data[index].push(dates[stateIndex].elections[electionIndex].result)
				console.log(dates[stateIndex].state+ " election "+electionIndex+" : DONE")
				resolve(true)
			})
		}))
		++lineIndex
        nextI();
    }, nextX);
}, ()=>{setTimeout(combine, 10000)});

function combine(){
	//console.log()
	//console.log(promises)
	Promise.all(promises).then(()=>{
		console.log("All data fetched...")
		var lineData = []
		console.log(data)
		for(var i = 0; i < data.length; ++i){
			var line = data[i].join(",")
			lineData.push(line)
		}
		var stringData = lineData.join('\n')
		fs.writeFile("./data/trainingData.csv", stringData, (err) => {
			if (err) {
				console.error(err)
			} else {
				console.log("File saved")
			}
		})
	}).catch((err)=>{
		console.log(err)
	})
}

/*for(var x = 0; x < dates.length; ++x){
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
			var stateIndex = x
			var electionIndex = i
			var index = lineIndex
			getGoogleTrendsData(attr, (parsedData)=>{
				data[index] = parsedData
				data[index].push(dates[stateIndex].elections[electionIndex].result)
				console.log(dates[stateIndex].state+ " election "+electionIndex+" : DONE")
				resolve()
			})
		}))
		++lineIndex
		sleep(500)
	}
}*/

function getGoogleTrendsData(attr, callback){
	dataParser.parseData(attr, (data)=>{
		callback(data)
	})
}

function sleep(miliseconds) {
   var currentTime = new Date().getTime();

   while (currentTime + miliseconds >= new Date().getTime()) {
   }
}