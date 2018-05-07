

var states = ["lobby", "prompt", "answers", "tally"];
var timer_count = 0;
var currentState = states[1];
var stateIndex = 0;

var promptRound = 1;

var server_url = "http://student01.cse.nd.edu:9898";
var max_players = 4;


var intervalID = setInterval(checkStateChange, 1000);



//GET GAME STATE FROM SERVER AND CHANGE MAIN PAGE TO STATE
function checkStateChange(){
//	stateFunctions();//remove
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4 && xhr.status == 200 || true) {
			var gamestate = JSON.parse(xhr.responseText)['message']['gamestate'];
			if (currentState != gamestate) {
				timer_count = 0;
				document.getElementById(currentState).className = "inactive";
				currentState = gamestate;
				document.getElementById(currentState).className = "active";
			}
			else {
				stateFunctions();
			}
		}
		else{
			stateFunctions();
		}
	}
	xhr.open("GET",  server_url+"/gamestate", true);
	xhr.send();
}

//DEPENDING ON STATE PERFORM FUNCTION FOR STATE
function stateFunctions() {
	if (currentState == "lobby") {
		getPlayers();
		var currentText = "Waiting for Players.";
		for (var increment = 0; increment < (timer_count%3); increment++) {
			currentText = currentText + '.';
		}
		document.getElementById("lobby_timer_text").innerHTML = currentText;
		timer_count = timer_count + 1;
		getPlayers();
	}
	else if (currentState == "prompt") {
		getPrompt();
	}
	else if (currentState == "answers") {
		getAnswers();
	}
	else {
		tallyScore();
	}
}

//CHECK FOR AND GET PLAYERS
function getPlayers() {
/*
	for (var index = 1; index <= max_players; index++) {
		var pnum = index.toString();
		document.getElementById("p"+pnum).innerHTML = "pbui";
	}
*/
	//currently only get result text
	var xhr = new XMLHttpRequest();
	xhr.onload = function() {
		if (xhr.readyState == 4 && xhr.status == 200) {
			var players = JSON.parse(xhr.responseText)['message'];
			for (var index = 1; index <= 4; index++) {
				var pnum = index.toString();
				document.getElementById("p"+pnum).innerHTML = players[pnum]["name"];
				document.getElementById("s"+pnum).innerHTML = players[pnum]["score"];
			}
		}
		else{
			
		}
		
	}
	xhr.open("GET",  server_url+"/players", true);
	xhr.send();

}

//RETRIEVE QUESTION PROMPT FROM SERVER
function getPrompt() {
	
	//temp code
	/*
	document.getElementById("question_desc").innerHTML = "Why did the chicken cross the road?";
	var timer_num = 0;
	if (timer_count < 60) {
		timer_num = 60 - timer_count;
	}
	document.getElementById("prompt_counter_num").innerHTML = timer_num.toString();
	timer_count = timer_count + 1;
	*/
	var timer_num = 0;
	if (timer_count < 60) {
		timer_num = 60 - timer_count;
	}
	document.getElementById("prompt_counter_num").innerHTML = timer_num.toString();
	timer_count = timer_count + 1;

	if (timer_num <= 0) {
		var xhr = new XMLHttpRequest();
		xhr.onload = function () {
			if (xhr.readyState == 4 && xhr.status == "200") {
				console.log("success put");
			} else {
				console.error("fail");
			}
		}
		xhr.open("PUT",  server_url+"/gamestate", true);
		xhr.send('{"gamestate": "answers"}');
	}
	else {
		var xhr = new XMLHttpRequest();
		xhr.onload = function() {
			if (xhr.readyState == 4 && xhr.status == 200) {
				var prompt = JSON.parse(xhr.responseText)['message'];
				var qnum = promptRound.toString();
				document.getElementById("question1_desc").innerHTML = jsonObj['message'][qnum]["prompt"];
			}
			else {
				document.getElementById("question1_desc").innerHTML = "Huston we have a problem...";
			}
		
		}
		xhr.open("GET",  server_url+"/questions", true);
		xhr.send();
	}
}


function getAnswers() {
	var timer_num = 0;
	if (timer_count < 60) {
		timer_num = 60 - timer_count;
	}
	document.getElementById("answers_counter_num").innerHTML = timer_num.toString();
	timer_count = timer_count + 1;


	if (timer_num <= 0) {
		promptRound = promptRound + 1;
		if (promptRound > 4) {
			promptRound = 0;
			var xhr = new XMLHttpRequest();
			xhr.onload = function () {
				if (xhr.readyState == 4 && xhr.status == "200") {
					console.log("success put");
				} else {
					console.error("fail");
				}
			}
			xhr.open("PUT",  server_url+"/gamestate", true);
			xhr.send('{"gamestate": "tally"}');
		}
		else {
			var xhr = new XMLHttpRequest();
			xhr.onload = function () {
				if (xhr.readyState == 4 && xhr.status == "200") {
					console.log("success put");
				} else {
					console.error("fail");
				}
			}
			xhr.open("PUT",  server_url+"/gamestate", true);
			xhr.send('{"gamestate": "prompt"}');
		}
	}
	else {
		var xhr = new XMLHttpRequest();
		xhr.onload = function() {
		if (xhr.readyState == 4 && xhr.status == 200) {
			var prompt = JSON.parse(xhr.responseText);
			document.getElementById("question2_desc").innerHTML = jsonObj['message'][qnum]["prompt"];
			document.getElementById("answer1_desc").innerHTML = jsonObj['message'][qnum]["answer"];
			document.getElementById("answer2_desc").innerHTML = jsonObj['message'][qnum]["answer2"];

		}
		else {
			document.getElementById("question2_desc").innerHTML = "Huston we have a problem...";
			document.getElementById("answer1_desc").innerHTML = "Huston we have a problem...";
			document.getElementById("answer2_desc").innerHTML = "Huston we have a problem...";
		}
		
	}
	xhr.open("GET",  server_url+"/questions", true);
	xhr.send();
	}
	else {
	}
}

function tallyScore() {
	getPlayers();
}


//STATE TOGGLE, ONLY FOR TESTING
function toggleStates() {
	document.getElementById(currentState).className = "inactive";
	stateIndex = (stateIndex + 1)%4;
	currentState = states[stateIndex];
	document.getElementById(currentState).className = "active";
}


//PUT AND GET, ONLY FOR TESTING
function putTest() {
	/*var xhr = new XMLHttpRequest();
	xhr.open("PUT",  server_url+"/gamestate", true);
	xhr.onload = function () {
		if (xhr.readyState == 4 && xhr.status == "200") {
			console.log("success put");
		} else {
			console.error("fail");
		}
	}
	xhr.send('{"gamestate": "lobby"}');
	console.log("sent");*/

	var xhr = new XMLHttpRequest();
	xhr.open("GET",  server_url+"/gamestate", true);
	xhr.onload = function () {var users = JSON.parse(xhr.responseText);
		if (xhr.readyState == 4 && xhr.status == "200") {
			console.log("success get");
			console.log(xhr.responseText);
		} else {
			console.error("fail");
		}
	}
	xhr.send();
	console.log("sent");
}





