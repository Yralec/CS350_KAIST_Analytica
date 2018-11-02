const googleTrends = require('google-trends-api')

var dataRetriever = {

	retrieveByRegion: function(attr, callback){
		return googleTrends.interestByRegion({
			keyword: attr.keywords,
			startTime: attr.startDate,
			endTime: attr.endDate,
			geo: attr.state,
			category: attr.category,//leave the , alone
		})
	}
}

module.exports = dataRetriever