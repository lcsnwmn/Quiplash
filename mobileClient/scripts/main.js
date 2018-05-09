var server_url = "http://student01.cse.nd.edu:9898";
var max_players = 4;
var player_name = "NONE";
var player_num = 0;
var player_qid = [-1, -1];
var q1_submit = false;
var q2_submit = false;


var currentState = "none";
var uid = "0";
var name = "undefined"

var buttonsEnabled = true;

var intervalID = setInterval(getState, 1000);

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
					stateFunctions();
				}
			}
			// else {
			// 	//IF STATE NOT CHANGED DO ACTIVITY OF STATE
			// 	stateFunctions();
			// }
		}
		else if (xhr.status != 0){
			console.log("Gamestate Error:" + xhr.status);
		}
	}
	xhr.open("GET",  server_url+"/gamestate", false);
	xhr.send();
}

function submitName(){


	var xhr = new XMLHttpRequest();
	xhr.onload = function(){
		if((xhr.status == "200")&&(uid=="0")){

			console.log(JSON.parse(xhr.responseText));
			var result = JSON.parse(xhr.responseText);
			uid = String(Object.keys(result).length);
			if(Object.keys(result).length < 5){
				var myForm = document.getElementById("myForm");
				console.log("FORM:" + myForm);
				name = myForm.elements[0].value;
				submitToServer(uid, name);
			}


		}
	}
	xhr.open("GET", server_url + "/players", true);
	xhr.send();
	
}

function submitToServer(user, name){
	var xhr = new XMLHttpRequest();
	xhr.onload = function () {
		if (xhr.status == "200") {
			console.log("Name submitted:" + name);
		} else {
			console.error("Name Error (" + name + "): " + xhr.status);
		}
	}
	xhr.open("PUT",  server_url+"/players/" + user, true);
	var request = '"' + name + '"';
	//console.log(request)
	xhr.send(request);
}

function stateFunctions() {
	//GET 'currentState' AND DO ACTION DEPENDING ON THAT
	if (currentState == "lobby") {
		//lobbyWait();
	}
	else if (currentState == "prompts") {
		getPrompts();
	}
	else if (currentState == "answers") {
		getAnswers();
	}
	else if (currentState == "tally"){
		//tallyScore();
	}else{
		//console.log("Error with current state: current state is " + currentState)
	}
}

function getPrompts(){
	if (uid != "0"){
		var xhr = new XMLHttpRequest();
		xhr.onload = function (){
			if(xhr.status == "200"){
				// Display Question
				var question = JSON.parse(xhr.responseText)["question"];
				console.log(question);
				var resp = document.getElementById("que1");
				resp.innerHTML = question;

				var xhr2 = new XMLHttpRequest();
				xhr2.onload = function (){
					if(xhr2.status == "200"){
						// Display Question
						var question = JSON.parse(xhr2.responseText)["question"];
						console.log(question);
						var resp = document.getElementById("que2");
						resp.innerHTML = question;
					}else{
						console.log("Question display error: " + xhr2.status);
					}
				}
				if (uid != "1"){
					var qid2 = String(parseInt(uid) - 1);
				}else{
					var qid2 = "4";
				}
				
				xhr2.open("GET", server_url + "/questions/" + qid2, true);
				xhr2.send();

			}else{
				console.log("Question display error: " + xhr.status);
			}
		}
		var qid1 = uid;
		xhr.open("GET", server_url + "/questions/" + qid1, true);
		xhr.send();


	}
}

function submitAnswer(qid){
	var newForm = document.getElementById("A1");
	if (qid == 1){
		qid = uid
		document.getElementById("first").className = "inactive";
		document.getElementById("second").className = "active";
	}else{
		if (uid != "1"){
			var qid2 = String(parseInt(uid) - 1);
		}else{
			var qid2 = "4";
		}
		newForm = document.getElementById("A2");
		document.getElementById("second").className = "inactive";
	}
	console.log(newForm);
	var answer = newForm.elements[0].value;

	var xhr = new XMLHttpRequest();
	xhr.onload = function () {
		if (xhr.status == "200") {
			console.log("Answer submitted:" + answer);
		} else {
			console.error("Answer Error (" + answer + "): " + xhr.status);
		}
	}
	xhr.open("PUT",  server_url+"/questions/" + qid + "/prompt/" + uid, true);
	var request = '"' + answer + '"';
	//console.log(request)
	xhr.send(request);
}

function getAnswers(){
	var xhr = new XMLHttpRequest();
	xhr.onload = function (){
		if(xhr.status == "200"){
			// Display Question
			var question = JSON.parse(xhr.responseText)["result"];
			if(question == "1"){
				var user = "4";
			}else{
				var user = String(parseInt(question) - 1);
			}
			//console.log("DQ: " + qid + " " + user);
			displayAnswers(question, question);
			displayAnswers(question, user);
			
		}else{
			console.log("Question display error: " + xhr.status);
		}
	}
	xhr.open("GET", server_url + "/question", true);
	xhr.send();
}

function displayAnswers(qid, user){
	var xhr = new XMLHttpRequest();
	xhr.open("GET", server_url + "/questions/" + user + "/prompt/" + qid, true);
	xhr.onload = function (){
		if(xhr.status == "200"){
			// Display Question
			console.log(xhr.responseText);
			console.log(user + " " + qid);
			var answer = JSON.parse(xhr.responseText)["result"]
			if(qid == user){
				var display = document.getElementById("a1");
				var i = 1;
			}else{
				var display = document.getElementById("a2");
				var i = 2;
			}

			if (answer.length < 1){
				answer = "No Answer :("
			}
			display.innerHTML = '<button type="button" onclick="choose(' + i + ')">' + answer + '</button>';

		}else{
			console.log("Question display error: " + xhr.status);
		}
	}
	xhr.send();
}

function choose(qid){
	console.log("Made it.");
}