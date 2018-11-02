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
		var data = [0,1]
		var promises = []
		var now = new Date(Date.now())
		var date1 = now < attr.startDate ? now : attr.startDate
		var date2 = attr.endDate > now ? now : attr.endDate

		var promise1 = attr.dataRetriever.retrieveByRegion({keywords: attr.keywords, startDate: date1, endDate: date2, state: attr.state, category: 0})
		promise1.then((partialData)=>{
				data[0] = JSON.parse(partialData)
			}).catch((err) => {
				console.log(err)
				return null
			})
		promises.push(promise1)

		var promise2 = attr.dataRetriever.retrieveByRegion({keywords: attr.keywords, startDate: date1, endDate: date2, state: attr.state, category: 396})
		promise2.then((partialData)=>{
				data[1] = JSON.parse(partialData)
			}).catch((err) => {
				console.log(err)
				return null
			})
		promises.push(promise2)

		Promise.all(promises).then(()=>{
			var parsedData = []
			for(var j = 0; j < 2; ++j){
				var values = new Array(attr.keywords.length).fill(0)
				var length = data[j].default.geoMapData.length
				for(var i = 0; i < length; ++i){
					if(data[j].default.geoMapData[i].hasData.indexOf(false) == -1){
						values = values.map((val,index) => {
							var y = data[j].default.geoMapData[i].value[index]
							return val + y
						})
					}
				}
				values = values.map((x) => {return x/length})
				Array.prototype.push.apply(parsedData, values)
			}
			callback(parsedData)
		})
	}

}

module.exports = dataParser