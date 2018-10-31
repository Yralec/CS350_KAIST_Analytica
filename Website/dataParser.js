var dataParser = {

	/**
	 * Fetches data
	 * @param  {property: value, ...} possible properties: keywords, startDate, endDate, dataRetriever, location
	 * @return object the parsed data
	 */
	parseData: function(attr){
		if(startDate > endDate){
			return null
		}
		var data = []
		var now = Date.now()
		if(now < attr.endDate)
		var endDate = now
		for(var year = attr.startDate.year; year <= endDate.year; ++year){
			for(var month = attr.startDate.month; month < endDate.month; ++month){
				var date1 = new Date(year, month)
				var date2 = new Date(year, month)
				var tmp = attr.dataRetriever.retrieveByRegion({keywords: attr.keywords, startDate: date1, endDate: date2, location: attr.location})
				data.push(tmp)
			}
		}

		return data;
	}

}

exports.module = dataParser