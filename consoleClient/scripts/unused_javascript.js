
//STATE TOGGLE, ONLY FOR TESTING
function toggleStates() {
	document.getElementById(currentState).className = "inactive";
	stateIndex = (stateIndex + 1)%4;
	currentState = states[stateIndex];
	document.getElementById(currentState).className = "active";
}


//PUT AND GET, ONLY FOR TESTING
function putTest() {
	var xhr = new XMLHttpRequest();
	xhr.open("PUT",  server_url+"/gamestate", true);
	xhr.onload = function () {
		if (xhr.status == "200") {
			console.log("success put");
		} else {
			console.error("fail");
		}
	}
	xhr.send('lobby');
	console.log("sent");

	var xhr = new XMLHttpRequest();
	xhr.open("GET",  server_url+"/gamestate", true);
	xhr.onload = function () {var users = JSON.parse(xhr.responseText);
		if (xhr.status == "200") {
			console.log("success get");
			console.log(xhr.responseText);
		} else {
			console.error("fail");
		}
	}
	xhr.send();
	console.log("sent");
}







function getPlayerName() {

	document.getElementById("test").innerHTML = "Worked";
	var xhr = new XMLHttpRequest();
	xhr.onload = function() {
		if (xhr.readyState == 4 && xhr.status == 200) {
			var jsonObj = JSON.parse(xhr.responseText);
			document.getElementById("test").innerHTML = jsonObj['result'];
			for (var index = 1; index <= 4; index++) {
				var pnum = index.toString();
				document.getElementById("p"+pnum).innerHTML = jsonObj['result'];
				console.log(jsonObj["p"+pnum]);
			}
		}
		else{
			document.getElementById("test").innerHTML = xhr.status;
		}
		
	}
	xhr.open("GET",  server_url+"/players", true);
	return xhr.send();
}

	/*
	xhr.open("GET",  server_url+"/gamestate", true);
	xhr.send();
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
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {

		
	}
	xhr.open("GET",  server_url+"/gamestate/", true);
	xhr.send();
*/
