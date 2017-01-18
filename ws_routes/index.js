const url = require('url');
const WebSocketServer = require('ws').Server;
var express = require('express');
var router = express.Router();
connections = []; 


function SetUpWsServer(app, server) {
	const wss = new WebSocketServer({
		server
	});

	wss.on('connection', function connection(ws) {
		  var location = url.parse(ws.upgradeReq.url, true);
		  // you might use location.query.access_token to authenticate or share sessions 
		  // or ws.upgradeReq.headers.cookie (see http://stackoverflow.com/a/16395220/151312) 
		  var username = location.query.username;

		  if(!username) {
		  	return;
		  }

		  connections.push({ws,username});
		  	ws.on('close', function(){
		  		connections = connections.filter(function(c) {
		  			console.log('C:', c.username);
		  			console.log('Username:', username);
		  			console.log('Compare:', c.username !== username);
		  			return c.username !== username;
		  		})
		  		console.log('connections:', connections);
				console.log('Connection closed');
			});
		  ws.on('message', function incoming(data) {
		  	console.log('DATA:', data);
		  	console.log('TYPE:', typeof data);
		    try{
		    	var input = JSON.parse(data);
		    	connections.forEach(function(client) {
		    		console.log('WS:', client.ws.readyState);
		    		if(client.ws.readyState == 1){
		    			client.ws.send(JSON.stringify({
				    			message :  input.message,
				    			from : username
			    			})
		    			);		
		    		}
    					

		    
		    	});
		    }catch(e){
		    	console.log('Error:',e)	
		    }
		  });
	})
}


router.get('/', function(req, res, next) {
	var users = connections.map((obj) => {
		return {username:obj.username};
	});

	return res.json(users);
})

module.exports = {
	SetUpWsServer,
	connections,
	router
};
