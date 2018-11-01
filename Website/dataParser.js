var dataParser = {

	/**
	 * Fetches data
	 * @param  {property: value, ...} possible properties: keywords, startDate, endDate, dataRetriever, state
	 * @return object the parsed data
	 */
	parseData: function(attr, callback){
		if(attr.startDate > attr.endDate){
			return null
		}
		var data = []
		var promises = []
		var now = new Date(Date.now())
		for(var year = attr.startDate.getYear(); year <= attr.endDate.getYear(); ++year){
			for(var month = 0; month < 12; month+=4){
				var date1tmp = new Date(year, month, 1)
				var date1 = date1tmp < attr.startDate ? attr.startDate : date1tmp
				var date2tmp = new Date(year, month+3, 31)
				var date2 = date2tmp > now ? now : date2tmp
				var promise = attr.dataRetriever.retrieveByRegion({keywords: attr.keywords, startDate: date1, endDate: date2, state: attr.state})
				promise.then((partialData)=>{
						data.push(JSON.parse(partialData))
					}).catch((err) => {
						console.log(err)
						return null
					})
				promises.push(promise)
			}
		}
		Promise.all(promises).then(()=>{
			for(var j = 0; j < data.length; ++j){
				data[j] = data[j].default.timelineData
				for(var i = 0; i < data.length; ++i){
					data[i] = data[i].value
				}
			}
			console.log(data)
			callback(JSON.stringify(data))
		})
	}

}

module.exports = dataParser