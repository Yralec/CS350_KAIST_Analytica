

//number of intervals
var NUMBER_OF_INTERVALS = 12
/**
 * @param
 * @param {[type]}
 */
function State(info, prediction=null, histogram = [0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5], dates = [0,0,0,0,0,0,0,0,0,0,0,0]) {
    this.info = info
    this.histogram = histogram
    this.dates = dates
}


/**
 * @return {the color of the corresponding state}
 */
State.prototype.color = function() {
    if(!relative){
        if(this.prediction == 0){
            return 'blue'
        } else if (this.prediction == 1){
            return 'red'
        } else {
            return 'purple'
        }
    } else {
        if(this.prediction == null){
            return 'purple'
        } else {
            return getColor(this.prediction)
        }
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

State.prototype.predictionRequest = function(start,end) {

    var promise = new Promise((resolve, reject)=>{
        this.prediction = null  //reset result in case of consecutive requests
        var server = ""

        var state = this.id()//states[document.getElementById("stateSelection").value].id()

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

State.prototype.getHistogramDates = function(year){
    var start
    var end
    if(year.length == 4){
        dates.forEach((x)=>{
            if(x.state == this.id()){
                x.elections.forEach((e)=>{
                    if(e.year == year){
                        start = e.start
                        end = e.end
                    }
                })
            }
        })
    } else {//"now" case

        dates.forEach((x)=>{

            if(x.state == this.id()){
                start = x.elections[x.elections.length-1].end
                }
            }
        )
        end = year
    }

    return [start,end];
}

State.prototype.getHistogramPredictions = function(){
    this.histogram = [0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5]//reintialize dates incase of requesting several times the same country

    var list = []
    var year = document.getElementById("yearSelection")
    var startEnd = this.getHistogramDates(year.value)
    var start = getDateFromString(startEnd[0])
    var end =  getDateFromString(startEnd[1])
    var timeInterval = Math.round( (end - start)/NUMBER_OF_INTERVALS) //interval between dates
    var nextDate = start
    var startDate = getStringFromDate(start)

    for (let i = 0; i<NUMBER_OF_INTERVALS;++i){
        this.dates[i] = getStringFromDate(nextDate)

        nextDate.setTime(nextDate.getTime() + timeInterval)
        var promise = this.predictionRequest(startDate,getStringFromDate(nextDate)).then(res => {
            console.log(i + " index")
            console.log(res.prediction + " prediction")
            this.histogram[i] = res.prediction
            this.drawHistogram()


        })
        list.push(promise);

        //list.push(Promise.resolve(Math.random()));
    }
    return Promise.all(list)
}

State.prototype.drawHistogram = function() {

    var canvas = document.getElementById("myCanvas");
    //absolute size canvas
    canvas.width  = Math.floor(window.innerWidth);
    canvas.height = Math.floor(window.innerHeight);

    var ctx = canvas.getContext("2d");

    //clear previous histogram
    ctx.clearRect( 0, 0, ctx.canvas.width, ctx.canvas.height);

    //histogram window
    var startX = Math.floor(window.innerWidth*0.15)
    var startY = Math.floor(window.innerHeight*0.1)
    var lengthX = Math.floor(window.innerWidth*0.8)
    var lengthY = Math.floor(window.innerHeight*0.6)
    ctx.rect(startX, startY, lengthX, lengthY);
    //
    //title
    ctx.font="20px Georgia";
    ctx.fillText("Predicted probability that NLP wins over time in "+ this.name() + " from " + this.dates[0] + " to " + this.dates[this.dates.length-1],startX,startY-20);
    //x axis title
    ctx.font="20px Georgia";
    ctx.fillText("Time (from "+ this.dates[0] +" to "+ this.dates[this.dates.length-1] +")",startX,startY+lengthY+60);
    //x axis numbers and boxes

    var boxWidth = Math.round(lengthX/(2*NUMBER_OF_INTERVALS))
    for (var i = 0; i < NUMBER_OF_INTERVALS; i++) {
        //x axis number
        ctx.font="14px Georgia";
        ctx.fillStyle = '#000000'
        ctx.fillText(this.dates[i], startX + i*Math.round(lengthX/NUMBER_OF_INTERVALS), startY + lengthY + 20);

        //color
        ctx.fillStyle = getColor(this.histogram[i])
        //boxes
        var startBox = Math.min(startY + Math.round((1-this.histogram[i])*lengthY ), startY+Math.floor(lengthY/2))
        var endBox = Math.max(startY + Math.round((1-this.histogram[i])*lengthY ), startY+Math.floor(lengthY/2))
        var height = endBox - startBox
        //ctx.fillRect(
        //startX + i*Math.round(lengthX/NUMBER_OF_INTERVALS ) + Math.round(boxWidth/3),//x pos
        //startY + Math.round((1-this.histogram[i])*lengthY ),//y pos
        //boxWidth,//width
        //this.histogram[i]*lengthY);//height

        ctx.fillRect(
        startX + i*Math.round(lengthX/NUMBER_OF_INTERVALS ) + Math.round(boxWidth/3),//x pos
        startBox,//y pos
        boxWidth,//width
        height);//height

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