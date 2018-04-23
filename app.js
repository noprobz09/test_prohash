const express = require('express')
const app = express()
const prohashing = require("prohashing")
const connection = new prohashing({ 
    apiKey: "0a7a6fade943f7b6b9e96b4d1516bfcc733b5158af18d1b43aeec7e45a238c02", 
    debug: false ,
    subscribe : ['systemStatus', 'miners', 'profitability']
})

app.get('/profitability', (req, res) => {
	res.setHeader('Content-Type', 'application/json');
    //res.send('hello world');
    
    connection.on("profitability", (profitability) => {
	    //console.log("PROFITABLILITY UPDATE")
	    console.log(profitability)
        //console.log(JSON.stringify(profitability[0]))
        
        
		//res.json(profitability);
		//return callback(profitability);
		
    })
    

})

app.listen(8081, () => console.log('Example app listening on port 8081!'))

