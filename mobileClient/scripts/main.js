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
		//getAnswers();
	}
	else if (currentState == "tally"){
		//tallyScore();
	}else{
		//console.log("Error with current state: current state is " + currentState)
	}
}

function getPrompts(){
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
	var qid1 = String((Int(uid) % 4)+1)
	xhr.open("GET", server_url + "/questions/" + qid1 + "/answers/" + uid, true);
	xhr.send();
	var question = document.getElementById("que1")
}

/*
//SUBMIT PLAYER NAME
function submitName() {
	
	//HOLDER VALUES TO BE APPLIED TO USER
	var extention = 0;
	var temp_qid = [];
	
	//CHECK IF PLAYER VARIABLES ARE ALL READY SET IN INSTANCE
	if (player_name == "NONE" && player_num == 0) {
		
		//GET PLAYER INFO FROM SERVER
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function() {
			if (xhr.status == 200){
				
				//GO THROUGH EACH USER NAME AND FIND ONE NOT SET ie 'NONE'
				//ASSIGN 'extension' PLAYER INDEX IF NAME IS 'NONE'
				var playerOb = JSON.parse(xhr.responseText)['message'];
				for (var increment = 1; increment <= max_players; increment++) {
					var uname = playerOb[increment.toString()]['name'];
					if (uname == 'NONE') {
						extention = increment;
						temp_qid = playerOb['qid'];
						break;
					}
				}
			} else {
				console.error("fail1");
			}
		}
		xhr.open("GET",  server_url+"/players", true);
		xhr.send();
		
		//GET NEW NAME 'pname' FROM HTML FORM AND PUT TO SERVER
		var xhr = new XMLHttpRequest();
		xhr.open("PUT",  server_url+"/players/"+extention.toString()+"/name", true);
		var pname = document.getElementById('pname').value;
		xhr.onreadystatechange = function(){
			if (xhr.status == 200){
				console.log("success put");
				player_name = pname;
				player_num = extention;
				player_qid = temp_qid;
				//SET QUESTIONS GETS CALLED HERE
				setQuestions(1);
				setQuestions(2);
			} else {
				console.error("fail2");
			}
		}
		xhr.send();
		
	}

}

//SUBMIT ANSWERS USING 'ans_type' AS REFERENCE TO ANSWER FIELD
function submitAnswer(ans_type) {
	
	//CHECK IF PLAYER VARIABLES ARE SET
	if (player_name != "NONE" && player_num != 0) {
		
			//DEPENDING ON 'ans_type' SET SERVER ADDRESS VARIABLES WITH 'player_qid' ARRAY
			var uid = "NONE";
			var q1_num = 0;
			if (ans_type == 1 && q1_submit == false) {
				uid = "uid";
				q1_num = player_qid[0];
				q1_submit = true;
			}
			if (ans_type == 2 && q2_submit == false) {
				uid = "uid2";
				q1_num = player_qid[1];
				q2_submit = true;
			}
			
			//IF ANSWERS NOT ALREADY SUBMITTED SUBMIT ANSWERS
			if (uid != "NONE" && q1_num != 0) {
				var xhr = new XMLHttpRequest();
				xhr.open("PUT",  server_url+"/questions/"+q1_num.toString()+"/answers/"+uid, true);
				var pname = document.getElementById('pname').value;
				xhr.onreadystatechange = function(){
					if (xhr.status == 200){
						console.log("success put");
					} else {
						console.error("fail3");
					}
				}
				xhr.send();
			}
	}
}

//RETRIEVE QUESTION FROM SERVER
//USE 'q1_num' TO DESIGNATE PLAYER QID INDEX
function setQuestions(q1_num) {
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if (xhr.status == 200){
			var question = JSON.parse(xhr.responseText)['message'][player_qid[q1_num-1].toString()]['prompt'];
			//SET TO HTML
			document.getElementById('que'+q1_num.toString()).innerHTML = question;
		} else {
			console.error("fail4");
		}
	}
	xhr.open("GET",  server_url+"/questions", true);
	xhr.send();
}


//GET QUESTIONS AND ANSWERS WHEN AVAILABLE
//VARIABLE 'q2_num' SPECFICIES WHICH QUESTION FROM SERVER INDEX
function checkQuestionAnswers(q2_num) {
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if (xhr.status == 200){
			var questionObj = JSON.parse(xhr.responseText)['message'][q2_num.toString()];
			var question = questionObj['prompt'];
			var answer = questionObj['answer'];
			var answer2 = questionObj['answer2'];
			//SET TO HTML
			document.getElementById('que3').innerHTML = question;
			document.getElementById('ans1').innerHTML = answer;
			document.getElementById('ans1').innerHTML = answer2;
		} else {
			console.error("fail4");
		}
	}
	xhr.open("GET",  server_url+"/questions", true);
	xhr.send();
}

*/
