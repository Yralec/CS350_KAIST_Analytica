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
		var date1 = now < attr.startDate ? now : attr.startDate
		var date2 = attr.endDate > now ? now : attr.endDate

		var promise1 = attr.dataRetriever.retrieveByRegion({keywords: attr.keywords, startDate: date1, endDate: date2, state: attr.state})
		promise1.then((partialData)=>{
				data.push(JSON.parse(partialData))
			}).catch((err) => {
				console.log(err)
				return null
			})
		promises.push(promise1)

		var promise2 = attr.dataRetriever.retrieveByRegion({keywords: attr.keywords, startDate: date1, endDate: date2, state: attr.state})
		promise2.then((partialData)=>{
				data.push(JSON.parse(partialData))
			}).catch((err) => {
				console.log(err)
				return null
			})
		promises.push(promise2)

		Promise.all(promises).then(()=>{
			console.log(data)
			callback(JSON.stringify(data))
		})
	}

}

module.exports = dataParser