uid = 2;
movieDict = {}; 

movieDiv = new Div();
movieDiv.createDiv("movieDiv");
movieDiv.addToDocument();

movieLabel = new Label();
ratingLabel = new Label();
movieImage = new Image();
args = [movieLabel, ratingLabel, movieImage];

movieLabel.createLabel("", "movieLabel");
movieDiv.appendLabel(movieLabel);

movieImage.createImage("", "movieImage")
movieDiv.appendImage(movieImage);

ratingLabel.createLabel("", "ratingLabel");
movieDiv.appendLabel(ratingLabel);

getMovie(args); // get initial movie immediately

upDiv = new Div();
upDiv.createDiv("upDiv");
upDiv.addToDocument();

upVote = new Button();
upVote.createButton("UP", "upVote");
upVote.addClickEventHandler(sendVote, [args[0], args[1], args[2], 5]);
upDiv.appendButton(upVote);

downDiv = new Div();
downDiv.createDiv("downDiv");
downDiv.addToDocument();

downVote = new Button();
downVote.createButton("DOWN", "downVote");
downVote.addClickEventHandler(sendVote, [args[0], args[1], args[2], 1]);
downDiv.appendButton(downVote);

function getMovie(args) {
    var xhr4 = new XMLHttpRequest();
    xhr4.open("GET", "http://student04.cse.nd.edu:51029/recommendations/" + uid, true);
    xhr4.onload = function() {
        movieDict = JSON.parse(xhr4.responseText);
        changeText([args[0], args[1], args[2], movieDict["movie_id"]]);
    };
    xhr4.send();
}

function changeText(args) {
    var xhr1 = new XMLHttpRequest();    
    xhr1.open("GET", "http://student04.cse.nd.edu:51029/movies/" + args[3], true);
    xhr1.onload = function() {
        movDict = JSON.parse(xhr1.responseText);
        args[0].setText(movDict["title"]);
        args[2].setImage("http://student04.cse.nd.edu/skumar5/images/"+movDict["img"]);    
    };
    xhr1.send();

    var xhr2 = new XMLHttpRequest();
    xhr2.open("GET", "http://student04.cse.nd.edu:51029/ratings/" + args[3], true);
    xhr2.onload = function() {
        ratingDiv = JSON.parse(xhr2.responseText);
        args[1].setText(ratingDiv["rating"]);
    };
    xhr2.send();
}

function sendVote(voteArgs) {
    var xhr3 = new XMLHttpRequest();
    xhr3.open("PUT", "http://student04.cse.nd.edu:51029/recommendations/" + uid, true);
    xhr3.send(JSON.stringify({"movie_id": movieDict["movie_id"], "rating":voteArgs[3]}));
    xhr3.onload = function() {
        getMovie([voteArgs[0], voteArgs[1], voteArgs[2]]);
    };
}