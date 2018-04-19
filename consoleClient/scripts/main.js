/*
var para = document.createElement("p");
var node = document.createTextNode("This is new.");
para.appendChild(node);
var element = document.getElementById("div1");
element.appendChild(para);
*/

var server_url = "http://127.0.0.1:8080";
var max_players = 4;


function getPlayer(args) {
	var xhr = new XMLHttpRequest();
    xhr4.open("GET",  server_url+"/players/"+args[1], true);
	xhr4.onload = function() {
		if (xhr.status == 500) {
			return 1;
		}
		else {
			player_stats = JSON.parse(xhr.responseText);
		}
		
	}
}

function getAllPlayers(args) {
	var players = {};
	for (index = 0; index < max_players; index++) {
		var str_index
		var result = getPlayer(index);
	}
}