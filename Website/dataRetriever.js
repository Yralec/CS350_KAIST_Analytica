const googleTrends = require('google-trends-api')

var dataRetriever = {

	retrieveByRegion: function(attr){
		googleTrends.interestByRegion({
			keyword: attr.keywords,
			startTime: attr.startDate,
			endTime: attr.endDate,
			geo: attr.location,
		}).then((data) => {
			return data
		}).catch((err) => {
			return null
		})
	}
}

exports.module = dataRetriever