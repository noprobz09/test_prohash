const express = require('express')
const app = express();
const autobahnConnectionLib = require('./classes/ProhashConnectionLib');

const connection = new autobahnConnectionLib({ 
    apiKey: "a93f4d5311fed02a4e675d7995dbe6ba43bdc431926ce0e35553439f340aaef8", 
    subscribe : ['systemStatus', 'miners', 'profitability']
});


app.get('/profitability', (req, res) => {

    
    connection.profitability();
    //connection.close();
    // connection
    // .on("profitability", (profitability) => {
	//     //console.log("PROFITABLILITY UPDATE")
	//     //console.log(profitability)
    //     //console.log(JSON.stringify(profitability[0]))
        
	// 	res.send(JSON.stringify(profitability[0]));
	// 	//res.json(profitability);
    //     //return callback(profitability);		
    //     //connection.close();


    // });
    

});


app.get('/miners', (req, res) => {

    connection.miners();
    //connection.close();
    // const connection = new autobahnConnectionLib({ 
    //     apiKey: "a93f4d5311fed02a4e675d7995dbe6ba43bdc431926ce0e35553439f340aaef8", 
    //     subscribe : ['systemStatus', 'miners', 'profitability']
    // })

    // const profitability = connection.profitability();
    // console.log(profitability);
    // connection.close();

    


});




app.listen(8081, () => console.log('Example app listening on port 8081!'))

