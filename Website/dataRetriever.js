const googleTrends = require('google-trends-api')

var dataRetriever = {

	retrieveByRegion: function(attr, callback){
		return googleTrends.interestByRegion({
			keyword: attr.keywords,
			startTime: attr.startDate,
			endTime: attr.endDate,
			geo: 'AU',//attr.state,
			category: attr.category
		})
	}
}

module.exports = dataRetriever