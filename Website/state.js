

function State(name, result=null) {
    this.name = name
    this.result = result
}
State.prototype.color = function() {
	if(this.result == 0){
    	return 'blue'
	} else if (this.result == 1){
		return 'red'
    } else {
    	return 'purple'
    }

}

State.prototype.predictionRequest = function() {}

