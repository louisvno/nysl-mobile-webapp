 //+++++++++++++++++++++++++++++++++++++++++\\
//++ functions that respond to user action ++\\

$('#filter-button').on("click",toggleFilterMenu);

function toggleFilterMenu() {
    $('#filter-menu').toggle();
}

function closeFilterMenu() {
    $('#filter-menu').hide();
}
 
//When user clicks on a filter in the schedulefilter menu
function setFilterMenuEvents () { 
    $('#filter-menu').find("a").on("click", function(event) {
        var teamName = $(this).attr("href");
        //prevent default link behaviour
        event.preventDefault();
        //instead, do the following things
        closeFilterMenu();
        doPushState(teamName);
        renderSchedule(teamName);
    });
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

 //++++  Page Render functions  ++++\\
//+++++++++++++++++++++++++++++++++++\\

//render schedule filtered by team takes an array of matches
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

//Render game details page
function renderGameDetails (matchId) {
   var content = getMatchData(matchId);
   var template = "/assets/templates/gamedetail_card_template.html";
   
   $.get(template, function (template) {
      renderTemplate(template, content, "#right-panel" );
       if (isPortraitMode) {
           $('#right-panel').show();
           $('#filter-button').on("click",function (){
              $('#right-panel').hide();
           });
           //TODO change toggle filter event
       }
   });
};

function renderGameDetailsEmpty () {
   var content = "";
   var template = "/assets/templates/game_detail_empty.html";
   $("#right-panel").load(template);
}


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
    return window.matchMedia("(orientation: portrait)").matches
}

function isLandscapeMode (){ 
    return window.matchMedia("(orientation: landscape)").matches;
}