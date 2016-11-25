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
        var href = $(this).attr("href");
        //prevent default link behaviour
        event.preventDefault();
        //instead, do the following things
        closeFilterMenu();
        doPushState(href);
        updatePageContent(href);
    });
}

//When user uses back or forward button in browser ("pop state")
$(window).on('popstate', function (event) {
//    var parsedUrl = getUrl().split("/").pop().replace("%20"," ");
    var state = event.originalEvent.state;
    if (state) {
        updatePageContent( state.selectedTeam );
    } else {updatePageContent ()}
});

//When user clicks on a match in the schedule (gamecard), loaded after schedule is rendered
function setGameCardEvents () { 
    $('.game-card').find('a').on("click", function (event) {
         var href = $(this).attr("href");
         event.preventDefault();
         renderGameDetails (href);
    });
};

 //++++  Page Render functions  ++++\\
//+++++++++++++++++++++++++++++++++++\\

//update pagecontent according to state
function updatePageContent (state) { 
    renderSchedule(state);
}

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
   console.log(content);
   var template = "/assets/templates/gamedetail_card_template.html";
   
   $.get(template, function (template) {
      renderTemplate(template, content, "#right-panel" );
   });
};

//+++++++++++++++


//getURL console.log(location.pathname)
function getUrl () {
    return location.pathname;
}

//Change the browser history state
function doPushState (href) {
    var url = href; //  /schedule/ +
    var state = {selectedTeam : href};
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

var d = Date.parseExact("20-11-2016","d-M-yyyy");
var d2 = Date.today().clearTime();
console.log(d);
console.log(d2);
console.log(d.isBefore(d2));


//TODO check which date is today, check what is the first upcoming match date, get those match iDs
function getUpcomingMatches () {
    var today = new Date.today().clearTime();
    var filteredData = leagueData.matches.filter (function (match){
        //get matchdate and convert date string into Date object
        var date = new Date.parseExact(match.date, "d-M-yyyy");
        console.log(date);
        //Check if date is today or in future
        return date.equals(today) || date.isAfter(today);
    });
    
    return filteredData;
}