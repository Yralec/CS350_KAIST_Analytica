const googleTrends = require('google-trends-api')

var dataRetriever = {

	retrieveByRegion: function(attr, callback){
		return googleTrends.interestOverTime({
			keyword: attr.keywords,
			startTime: attr.startDate,
			endTime: attr.endDate,
			geo: attr.state,
		})
	}
}

module.exports = dataRetriever