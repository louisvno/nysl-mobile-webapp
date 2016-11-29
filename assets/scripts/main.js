 //+++++++++++++++++++++++++++++++++++++++++\\
//++ functions that respond to user action ++\\

//when user clicks on the search icon
$('#filter-button').on("click", openFilterMenu);

function openFilterMenu() {
    $('#filter-menu').show();
    showReturnButton("#filter-menu");
}

//When user clicks on a filter in the schedulefilter menu
function setFilterMenuEvents () { 
    $('#filter-menu').find("a").on("click", function(event) {
        var teamName = $(this).attr("href");
        
        //prevent default link behaviour
        event.preventDefault();
        
        //instead, do the following things
        closeFilterMenu();
        showFilterButton();
        doPushState(teamName);
        renderSchedule(teamName);
        renderGameDetailsEmpty();
    });
}

//close filter menu when user has clicked a filter
function closeFilterMenu() {
    $('#filter-menu').hide();
}

//When user uses back or forward button in browser ("pop state")

$(window).on('popstate', function (event) {
//    var parsedUrl = getUrl().split("/").pop().replace("%20"," ");
    var state = event.originalEvent.state;
    if (state && state.selectedTeam && state.selectedMatch){
        renderGameDetails(state.selectedMatch);
    } else if (state && state.selectedTeam) {
        renderSchedule( state.selectedTeam );
        renderGameDetailsEmpty();
    } else if (state && state.selectedMatch){
        renderGameDetails(state.selectedMatch);
    } else {
        renderSchedule();
        renderGameDetailsEmpty();
    }
});

//When user clicks on a match in the schedule (gamecard), loaded after schedule is rendered
function setGameCardEvents () { 
    $('.game-card').find('a').on("click", function (event) {
         event.preventDefault();
         
         var matchId = $(this).attr("href");
         
           if (history.state && history.state.selectedTeam){ 
             doPushState(history.state.selectedTeam, matchId);
           } else {
             doPushState(null,matchId);
           }
         renderGameDetails (matchId); //async
    });
};

//when user changes orientation of the device
(function (){ 
    var orientation = window.matchMedia('(orientation: portrait)');
    orientation.addListener(function (){ 
        if (isLandscapeMode()) { 
            showFilterButton();
            $('#right-panel').show();
        } else if (isPortraitMode() && gameDetails()){
            showReturnButton('#right-panel');
        } else if (isPortraitMode() && !(gameDetails())){
            $('#right-panel').hide();
        }
    })
})();

 //++++  Page Render functions  ++++\\
//+++++++++++++++++++++++++++++++++++\\

function renderSchedule (teamname) { 
    var template = "/assets/templates/schedule_card_template.html";
    var content;
    
    if (teamname) { 
        content = filterByTeam(teamname);
    } else { 
        content = getUpcomingMatches();
    }
    
    $.get(template, function (template) {
        renderTemplate(template, content, "#left-panel" );
        setGameCardEvents();
    });
}

function renderGameDetails (matchId) {
   var content = getMatchData(matchId);
   var template = "/assets/templates/gamedetail_card_template.html";
   
   $.get(template, function (template) {
      renderTemplate(template, content, "#right-panel" );
       if (isPortraitMode()) {
           $('#right-panel').show();
           showReturnButton('#right-panel');
       } else {
            $('#right-panel').show();
       }
       initSendMessage();
       getPosts();
   });
};

function renderGameDetailsEmpty () {
   var content = "";
   var template = "/assets/templates/game_detail_empty.html";
   $("#right-panel").load(template);
   
   //TODO remove matchID from Url and update (replace?) state
}

//+++++++Button functions+++++++++++++++++\\
//++++++++++++++++++++++++++++++++++++++++\\

function showFilterButton (){
    $("#return-button").fadeOut(200, function(){
        $("#filter-button").show();
    });
    
}

function showReturnButton (target) {
    
    var $returnButton = $("#return-button");
    $returnButton.off(); 
    $("#filter-button").hide();
    $returnButton.fadeIn(200);
    
    $returnButton.on("click", function (){
        $(target).hide();
        if (target === "#right-panel" && isPortraitMode()){
            renderGameDetailsEmpty();
        }
        showFilterButton();
    })
}



//+++++ Manipulating the browser history ++++ \\
//+++++++++++++++++++++++++++++++++++++++++++++\\

//getURL console.log(location.pathname)
function getUrl () {
    return location.pathname;
}

//Change the browser history state
function doPushState (teamName, matchId) {
    var url;
    if (teamName && matchId) {
      url = "/" + teamName + "/" + matchId;
    } else {
      url = "/" + (teamName || matchId);
    }
    var state = {
      selectedTeam : teamName || "",
      selectedMatch : matchId || "",
    };
    
    history.pushState(state, null,url);
}

//++++++++++++++ Data filtering functions ++++++++++++++++\\
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++\\

//Get the matches of the selected team from the leagueData object 
function filterByTeam (name) {
    var filteredData = leagueData.matches.filter( function (match) {
        return match.hometeam === name || match.awayteam === name;
    });
    return filteredData;
}

//Get data object of one match by its match id
function getMatchData(matchId) {
    var matchData = leagueData.matches.filter (function (match){
        return match.matchId === matchId;
    })
    return matchData.pop();
}


//get todays date, check for every game in the database if is today or in the future, return only these
function getUpcomingMatches () {
    var today = new Date.today().clearTime();
    var filteredData = leagueData.matches.filter (function (match){
        //get matchdate and convert date string into Date object
        var date = new Date.parseExact(match.date, "d-M-yyyy");
        //Check if date is today or in future
        return date.equals(today) || date.isAfter(today);
    });
    return filteredData;
}

//check device orientation
function isPortraitMode (){ 
    return window.matchMedia("(orientation: portrait)").matches;
}

function isLandscapeMode (){ 
    return window.matchMedia("(orientation: landscape)").matches;
}

function gameDetails () {
    var check = document.getElementsByClassName("game-details");
    if (check.length > 0) {
        return true;
    } else {
    return false;
    }
}

function initSendMessage() { 
    var form = document.getElementById("submit-message");
    var messageBody = document.getElementById("message-body");
    var author = document.getElementById("author-name");
    form.addEventListener("submit", function(e) {
        e.preventDefault();
        writeNewPost(messageBody.value,author.value,Date())
    })
}

function writeNewPost(content,author,date) {
    
    var newPost = {
        "author" : author,
        "content" :content,
        "timeStamp" : date
    };
    
    var matchId = history.state.selectedMatch;
    var postKey= firebase.database().ref().child("match-posts/matchId").push().key;
    var update ={};
    update[postKey] = newPost;
    firebase.database().ref("match-posts/" + matchId).update(update);
}

function getPosts () {
    var matchId = history.state.selectedMatch;
    firebase.database().ref("match-posts/" + matchId).on("child_added",function (data){
      var posts = data.val();
      var template = "/assets/templates/message_board_template.html";
   
     $.get(template, function (template) {
        appendTemplate(template,posts, "#messages-container" );
     });
   })
}
