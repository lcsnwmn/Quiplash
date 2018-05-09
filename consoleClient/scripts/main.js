

var states = ["lobby", "prompts", "answers", "tally"];
var currentState = "none";
var timer = 60;
var goal = 60;


var round = 1;

var max_players = 4;

var server_url = "http://student01.cse.nd.edu:9898";


var intervalID = setInterval(getState, 500);

//GET GAME STATE FROM SERVER AND CHANGE MAIN PAGE TO STATE
function getState(){
	
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if ((xhr.status == 200)&&(xhr.responseText != null)) {
			//console.log(xhr.responseText)
			
			//GET GAMESTATE
			var gamestate = JSON.parse(xhr.responseText)["result"]
			//CHECK IF STATE CHANGED
			if (currentState != gamestate) {
				if (gamestate != "error"){
					//IF STATE CHANGED MAKE VISIBLE
					if (currentState != "none"){
						document.getElementById(currentState).className = "inactive";
					}
					document.getElementById(gamestate).className = "active";
					currentState = gamestate;
				}
			}
			else {
				//IF STATE NOT CHANGED DO ACTIVITY OF STATE
				stateFunctions();
			}
		}
		else if (xhr.status != 0){
			console.log("Gamestate Error:" + xhr.status);
		}
	}
	xhr.open("GET",  server_url+"/gamestate", false);
	xhr.send();
}

//DEPENDING ON STATE PERFORM FUNCTION FOR STATE
function stateFunctions() {
	//GET 'currentState' AND DO ACTION DEPENDING ON THAT
	if (currentState == "lobby") {
		lobbyWait();
	}
	else if (currentState == "prompts") {
		getPrompt();
	}
	else if (currentState == "answers") {
		//getAnswers();
	}
	else if (currentState == "tally"){
		//tallyScore();
	}else{
		//console.log("Error with current state: current state is " + currentState)
	}
}

//CHECK FOR AND GET PLAYERS
function getPlayers() {
	var xhr = new XMLHttpRequest();
	xhr.onload = function() {
		if (xhr.status == 200) {
			//console.log(xhr.responseText)
			//LOOP THROUGH PLAYER INDEXES AND GET PLAYER NAME AND SCORE
			var players = JSON.parse(xhr.responseText);
			console.log(players)
			if (players["result"] == "success"){
				// Add players to table
				for (var index = 0; index < max_players; index++) {
					var pnum = index.toString();
					if (players[pnum] != undefined){
						
						console.log(pnum + " " + players[pnum])

						var $table=document.getElementById('player_table');
						if ($table.rows.length < index + 2){
							var row=$table.insertRow(-1);
							var cell1=row.insertCell(0);
							var cell2=row.insertCell(1);
							var cell3=row.insertCell(2);
							cell1.innerHTML=players[pnum]
							cell2.innerHTML=0
							if (pnum == "0"){
								cell3.innerHTML = '<img id="avatar" src="images/cube_boy_large.gif" alt="Cube Boy">'
							}else if (pnum == "1"){
								cell3.innerHTML = '<img id="avatar" src="images/sphere_kid_large.gif" alt="Sphere Kid">'
							}else if (pnum == "2"){
								cell3.innerHTML = '<img id="avatar" src="images/green_thing_large.gif" alt="Green Thing">'
							}else if (pnum == "3"){
								cell3.innerHTML = '<img id="avatar" src="images/the_cone_large.gif" alt="The Cone">'
							}
						}
					}
				}

				// Check if game is full
				if ($table.rows.length > max_players){
					change_state("prompts")
				}
			}
		}
		else{
			console.log("Player Error:" + xhr.status);
		}
		
	}
	xhr.open("GET",  server_url+"/players", true);
	xhr.send();

}

//WIATING WIDGET (NOT IMPORTANT)
function lobbyWait() {
		var currentText = "Waiting for Players...";
		/*
		for (var increment = 0; increment < (timer_count%max_players); increment++) {
			currentText = currentText + '.';
		}
		document.getElementById("lobby_timer_text").innerHTML = currentText;
		timer_count = timer_count + 1; 
		*/
		getPlayers();
}

// Change the gamestate
function change_state(state){
	var xhr = new XMLHttpRequest();
	xhr.onload = function () {
		if (xhr.status == "200") {
			console.log("State Changed to " + state);
		} else {
			console.error("State Change Error (" + state + "): " + xhr.status);
		}
	}
	xhr.open("PUT",  server_url+"/gamestate", true);
	var request = '"' + state + '"';
	//console.log(request)
	xhr.send(request);
}

//RETRIEVE QUESTION PROMPT FROM SERVER
function getPrompt() {

	// Allow 60 seconds for users to submit their answers
	if (timer == 60){
		var now = new Date().getTime();
		goal = now + 60000;
		timer = 59;
	}
	else if (timer > 0){
		var curr = new Date().getTime();
		//console.log("G: " + goal + ", C: " + curr)
		var distance = goal - curr;
		var seconds = Math.floor((distance % (1000 * 60)) / 1000);
		console.log(seconds)
		timer = seconds - 1;
		//console.log(timer);
		document.getElementById("prompt_counter_num").innerHTML = seconds;
	}

	// For each question, display answers for 15 seconds [...UNTESTED...]
	for (var i = 1; i <= max_players; i++){
		var xhr = new XMLHttpRequest();
		xhr.onload = function (){
			if(xhr.status == "200"){
				// Display Question
				var question = JSON.parse(xhr.responseText)
				console.log(question)

				var prompt = question["prompt"];
				console.log(prompt)

				for (var uid in prompt){
					if (prompt.hasOwnProperty(uid)){
						var answer = prompt[uid];
					}
				}
				
			}else{
				console.log("Question display error: " + xhr.status);
			}
		}
		xhr.open("GET", server_url + "/questions/" + i + "/prompt", true);
		xhr.send();
	}
	/*
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
	*/
}

/*
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

*/