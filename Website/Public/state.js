
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
        var year = document.getElementById("yearSelection").value
        var state = states[document.getElementById("stateSelection").value].id()
        var start
        var end
        dates.forEach((x)=>{
            if(x.state == state){
                x.elections.forEach((e)=>{
                    if(e.year == year){
                        start = e.start
                        end = e.end
                    }
                })
            }
        })
        var xhr = new XMLHttpRequest();
        xhr._state = this
        xhr.responseType = "json";
        xhr.open('GET', server+'/prediction/'+this.id()+'?start='+start+'&end='+end)
        xhr.onload = ()=>{
            if(xhr.status == 200){
                this.prediction = Math.round(xhr.response.prediction)
                this.predictionValue = xhr.response.prediction
                resolve(xhr.response)
            } else{
                reject(xhr.status)
            }
        }
        xhr.send()
    })

    return promise
}

State.prototype.getWinnerText = function() {
    if(this.prediction == null){
        return "The prediction result is unavailable"
    } else if(this.prediction == 1){
        return "The Australian Labour Party will win the " + this.name()+ " state elections"
    } else {
         return "The National Liberal Party will win the " + this.name()+ " state elections"
    }

}

State.prototype.drawHistogram = function() {

    var canvas = document.getElementById("myCanvas");
    //absolute size canvas
    canvas.width  = Math.floor(window.innerWidth*0.8);
    canvas.height = Math.floor(window.innerHeight*0.8);

    var ctx = canvas.getContext("2d");

    //clear previous histogram
    ctx.clearRect( 0, 0, ctx.canvas.width, ctx.canvas.height);
    
    //histogram window
    var startX = Math.floor(window.innerWidth*0.1)
    var startY = Math.floor(window.innerHeight*0.1)
    var lengthX = Math.floor(window.innerWidth*0.6)
    var lengthY = Math.floor(window.innerHeight*0.6)
    ctx.rect(startX, startY, lengthX, lengthY);
    //

    //draw color boxes

    
    //draw 0.5 probability threshold line
    ctx.fillStyle="#FF0000";
    ctx.fillRect(startX,startY+Math.floor(lengthY/2),lengthX,Math.floor(lengthY/100));
    




    ctx.stroke();//draw
}