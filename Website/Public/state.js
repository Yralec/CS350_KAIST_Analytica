
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

State.prototype.getHistogramPredictions = function(){
    var list = []
    for (var i = 0; i<this.getIntervalNumber();++i){
        list.push(Math.random());
    }
    return list
}
State.prototype.getIntervalNumber = function() {
    return 12
}
State.prototype.drawHistogram = function() {

    var predictions = this.getHistogramPredictions()
    var canvas = document.getElementById("myCanvas");
    //absolute size canvas
    canvas.width  = Math.floor(window.innerWidth*0.8);
    canvas.height = Math.floor(window.innerHeight*0.8);

    var ctx = canvas.getContext("2d");

    //clear previous histogram
    ctx.clearRect( 0, 0, ctx.canvas.width, ctx.canvas.height);
    
    //histogram window
    var startX = Math.floor(window.innerWidth*0.15)
    var startY = Math.floor(window.innerHeight*0.1)
    var lengthX = Math.floor(window.innerWidth*0.6)
    var lengthY = Math.floor(window.innerHeight*0.6)
    ctx.rect(startX, startY, lengthX, lengthY);
    //
    //title
    ctx.font="20px Georgia";
    ctx.fillText("Predicted probability that NLP wins over time in "+ this.name() + " from " + "to ",startX,startY-20);
    //x axis title
    ctx.font="20px Georgia";
    ctx.fillText("Time (from a to b in months) ",startX,startY+lengthY+60);
    //x axis numbers and boxes
    var intervals = predictions.length
    var maxIntervals = 12
    var boxWidth = Math.round(lengthX/(2*maxIntervals))
    for (var i = 1; i < intervals; i++) {
        //x axis number
        ctx.fillStyle = '#000000'
        ctx.fillText(String(4*i), startX + i*Math.round(lengthX/maxIntervals), startY + lengthY + 20);

        //color
        ctx.fillStyle = getColor(predictions[i-1])
        //boxes
        ctx.fillRect(
        startX + i*Math.round(lengthX/maxIntervals ) - Math.round(boxWidth/3),//x pos
        startY + Math.round((1-predictions[i-1])*lengthY ),//y pos
        boxWidth,//width
        predictions[i-1]*lengthY);//height
    }

    //y axis title
    ctx.font="20px Georgia";
    ctx.fillStyle = '#000000'
    ctx.fillText("Predicted",10,startY+Math.floor(lengthY/2)-2*22);
    ctx.fillText("probability",10,startY+Math.floor(lengthY/2)-1*22);
    ctx.fillText("that NLP",10,startY+Math.floor(lengthY/2)+0*22);
    ctx.fillText("wins (0-1)",10,startY+Math.floor(lengthY/2)+1*22);
    //y axis numbers
    var precision = 9
    ctx.fillText("1", startX - 40,startY);
    for (var i = 1; i < precision+1; i++) {
        ctx.fillText("0."+String(precision-i+1), startX - 40,startY+i*Math.round(lengthY/(precision+1)));
    }
    ctx.fillText("0", startX - 40,startY+lengthY);
    
    

    //draw color boxes


    //draw 0.5 probability threshold line
    ctx.fillStyle="#FF0000";
    ctx.fillRect(startX,startY+Math.floor(lengthY/2),lengthX,Math.floor(lengthY/100));
    




    ctx.stroke();//draw
}
function getColor(proba){
    return 'rgb(' + String(Math.round(255*proba))+', 0, '+ Math.round(String(255*(1-proba)))+')'
}