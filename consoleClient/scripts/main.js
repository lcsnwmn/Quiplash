

var states = ["lobby", "prompt", "answers", "tally"];
var currentState = states[0];

var server_url = "http://student04.cse.nd.edu:9898";
var max_players = 4;

function testFunction() {
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if (xhr.status == 200) {
			document.getElementById("test").innerHTML = xhr.responseText;
		}
		else{
			document.getElementById("test").innerHTML = xhr.status;
		}
	}
	xhr.open("GET",  server_url+"/players/", true);
	xhr.send();
}



function getPlayerName() {

	document.getElementById("test").innerHTML = "Worked";
	var xhr = new XMLHttpRequest();
    	xhr.open("GET",  server_url+"/players/", true);
	xhr.onload = function() {
		if (xhr.status == 500) {
			document.getElementById("test").innerHTML = "Failed";
		}
		else {
			player_stats = JSON.parse(xhr.responseText);
		}
		if (xhr.readyState == 4 && xhr.status == 200) {
			document.getElementById("title").innerHTML =
			xhr.responseText;
		}
		
	}
}

function checkStateChange(){

	var statesLength = states.length;
	for (var index = statesLength-1; index >= 0; index--) {
		state = states[index];
		if (currentState == state) {
			var newIndex = (index + 1) % statesLength;
			var newState = states[newIndex];
			document.getElementById(state).className = "inactive";
			document.getElementById(newState).className = "active";
			currentState = newState;
			break;
		}
	}
/*	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {

		
	}
	xhr.open("GET",  server_url+"/gamestate/", true);
	xhr.send();
*/
}


var intervalID = setInterval(checkStateChange, 3000);





