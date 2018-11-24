var ps = require('python-shell')

data = [32,48,9,11,64,18,6,12]

/*ps.PythonShell.run('model.py', {
	mode: 'text',
	args: [JSON.stringify(data)]
}, (err, results)=>{
	if(err) throw err
	console.log(results)
})*/

var p = new Promise((res, rej)=>{
			ps.PythonShell.run('model.py', {
			mode: 'text',
			args: [JSON.stringify(data)]
		}, (err, results)=>{
			if(err){rej(err)}
			res(results)
		})
	})

p.then((result)=>{
	console.log(JSON.parse(result[0]))
}).catch((err)=>{"ERR: prediction"})