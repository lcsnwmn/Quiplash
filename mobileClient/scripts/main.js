var server_url = "http://student01.cse.nd.edu:9898";
var max_players = 4;
var player_name = "NONE";
var player_num = 0;
var player_qid = [-1, -1];
var q1_submit = false;
var q2_submit = false;

var buttonsEnabled = true;

var intervalID = setInterval(checkQuestionAnswers, 1000);

//THE WAY ITS SET UP A USER SHOULD NOT REFRESH PAGE OR ELSE ALL VARIABLES ARE RESET

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


