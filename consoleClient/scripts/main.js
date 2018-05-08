

var states = ["lobby", "prompt", "answers", "tally"];
var currentState = "lobby";
var timer_count = 0;

var round = 1;

var max_players = 4;

var server_url = "http://student01.cse.nd.edu:9898";


var intervalID = setInterval(checkStateChange, 1000);


//GET GAME STATE FROM SERVER AND CHANGE MAIN PAGE TO STATE
function checkStateChange(){
	
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if (xhr.status == 200) {
			
			//GET GAMESTATE
			var gamestate = 'prompt';//JSON.parse(xhr.responseText)['message']['gamestate'];
			//CHECK IF STATE CHANGED
			if (currentState != gamestate) {
				
				//IF STATE CHANGED ASSIGN NEW STATE
				//RESET TIMER AND SWITCH ACTIVE OF STATES TO MAKE APPEAR AND DISAPEAR
				timer_count = 0;
				document.getElementById(currentState).className = "inactive";
				currentState = gamestate;
				document.getElementById(currentState).className = "active";
			}
			else {
				//IF STATE NOT CHANGED DO ACTIVITY OF STATE
				stateFunctions();
			}
		}
		else{
			console.log("fail1");
		}
	}
	xhr.open("GET",  server_url+"/gamestate", true);
	xhr.send();
}

//DEPENDING ON STATE PERFORM FUNCTION FOR STATE
function stateFunctions() {
	//GET 'currentState' AND DO ACTION DEPENDING ON THAT
	if (currentState == "lobby") {
		lobbyWait();
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
	var xhr = new XMLHttpRequest();
	xhr.onload = function() {
		if (xhr.status == 200) {
			
			//LOOP THROUGH PLAYER INDEXES AND GET PLAYER NAME AND SCORE
			var players = JSON.parse(xhr.responseText)['message'];
			for (var index = 1; index <= max_players; index++) {
				var pnum = index.toString();
				document.getElementById("p"+pnum).innerHTML = players[pnum]["name"];
				document.getElementById("s"+pnum).innerHTML = players[pnum]["score"];
			}
		}
		else{
			console.log("fail2");
		}
		
	}
	xhr.open("GET",  server_url+"/players", true);
	xhr.send();

}

//WIATING WIDGET (NOT IMPORTANT)
function lobbyWait() {
		var currentText = "Waiting for Players.";
		for (var increment = 0; increment < (timer_count%max_players); increment++) {
			currentText = currentText + '.';
		}
		document.getElementById("lobby_timer_text").innerHTML = currentText;
		timer_count = timer_count + 1;
		getPlayers();
}

//RETRIEVE QUESTION PROMPT FROM SERVER
function getPrompt() {
	
	//COUNT DOWN FOR QUESTION (PROBABLY NOT NEEDED)
	var timer_num = 0;
	if (timer_count < 60) {
		timer_num = 60 - timer_count;
	}
	document.getElementById("prompt_counter_num").innerHTML = timer_num.toString();
	timer_count = timer_count + 1;

	//IF COUNT DOWN HITS ZERO GO TO ANSWERS AFTER PROMPT
	//BY SENDING 'anwsers' TO GAME STATE TO THEN BE RESEEN BY main.js
	if (timer_num <= 0) {
		var xhr = new XMLHttpRequest();
		xhr.onload = function () {
			if (xhr.status == "200") {
				console.log("success put");
			} else {
				console.error("fail");
			}
		}
		xhr.open("PUT",  server_url+"/gamestate", true);
		xhr.send('answers');
		console.log('answers')
	}
	//DEFAULT STATE, GET QUESTION FROM SERVER TO DISPLAY
	//USE 'round' TO DETERMINE WHAT QUESTION TO GET
	else {
		var xhr = new XMLHttpRequest();
		xhr.onload = function() {
			if (xhr.status == 200) {
				var prompt = JSON.parse(xhr.responseText)['message'];
				var qnum = round.toString();
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
	//LIKE PROMPT COUNT DOWN
	var timer_num = 0;
	if (timer_count < 60) {
		timer_num = 60 - timer_count;
	}
	document.getElementById("answers_counter_num").innerHTML = timer_num.toString();
	timer_count = timer_count + 1;


	//IF TIMER IS DOWN SWITCH STATES, BUT ALSO CHECK AND CHANGE 'round'
	//IF 'round' REACHES 4 THEN MOVE TO TALLY STATE
	if (timer_num <= 0) {
		round = round + 1;
		console.log(round)
		//IF ROUND IS GREAT THEN MAX OF 4 CHANGE STATE TO TALLY AND RESET 'round'
		if (round > max_players) {
			round = 1;
			var xhr = new XMLHttpRequest();
			xhr.onload = function () {
				if (xhr.status == "200") {
					console.log("success put");
				} else {
					console.error("fail");
				}
			}
			xhr.open("PUT",  server_url+"/gamestate", true);
			xhr.send('tally');
		}
		//ELSE CHANGE STATE BACK TO PROMPT WITH NEW INCREMENTED 'round'
		else {
			var xhr = new XMLHttpRequest();
			xhr.onload = function () {
				if (xhr.status == "200") {
					console.log("success put");
				} else {
					console.error("fail");
				}
			}
			xhr.open("PUT",  server_url+"/gamestate", true);
			xhr.send('prompt');
		}
	}
	//ELSE IF TIMER IS NOT 0 THEN JUST GET QUESTIONS AND ANSWERS
	else {
		var xhr = new XMLHttpRequest();
		xhr.onload = function() {
		if (xhr.status == 200) {
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

}

function tallyScore() {
	//JUST UPDATE PLAYERS AND SCORES FOR NOW...
	getPlayers();
}

