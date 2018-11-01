
/**
 * @param
 * @param {[type]}
 */
function State(info, prediction=null) {
    this.info = info
}


/**
 * @return {the color of the corresponding state}
 */
State.prototype.color = function() {
	if(this.prediction == 0){
    	return 'blue'
	} else if (this.prediction == 1){
		return 'red'
    } else {
    	return 'purple'
    }

}

State.prototype.drawState = function(){
    for(var i = 0; i < states.length; i++){
        this.node().setAttribute('fill', this.color())
    }
}

/**
 * @param  {[type]}
 * @return {[type]}
 */
State.prototype.id = function() {return this.info.data('id')}
State.prototype.name = function() {return this.info.attr('title')}
State.prototype.node = function() {return this.info.node}

State.prototype.predictionRequest = function() {

    var promise = new Promise((resolve, reject)=>{
        this.prediction = null  //reset result in case of consecutive requests
        var server = ""
        var xhr = new XMLHttpRequest();
        xhr.responseType = "json";
        xhr.open('GET', server+'/prediction/'+this.id())
        xhr.onload = ()=>{
            if(xhr.status == 200){
                resolve(xhr.response)
            } else{
                reject(xhr.response.status)
            }
        }
        xhr.send()
    })

    return promise
}