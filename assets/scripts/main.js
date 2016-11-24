console.log("current state =" + history.state);

$('#filter-button').on("click",toggleFilterMenu);

function toggleFilterMenu() {
    $('#filter-menu').toggle();
}

function closeFilterMenu() {
    $('#filter-menu').hide();
}
 //+++++++++++++++++++++++++++++++++++++++++\\
//++ functions that respond to user action ++\\

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
    console.log("current state =" + history.state);
//    var parsedUrl = getUrl().split("/").pop().replace("%20"," ");
    var state = event.originalEvent.state;
    if (state) {
        updatePageContent( state.selectedTeam );
    } else {updatePageContent ()}
    console.log("current state =" + history.state);
});

//When user clicks on a match in the schedule (gamecard)
function setGameCardEvents () { 
    console.log("events added")
    $('.game-card').find('a').on("click", function (event) {
         var href = $(this).attr("href");
         event.preventDefault();
         console.log("click");
         renderGameDetails (href);
    });
};

//upon page load (optional as in principal users start on first page)

//update pagecontent according to state
function updatePageContent (state) { 
    renderSchedule(state);
}

//render schedule filtered by team
function renderSchedule (teamname) { 
    if (teamname) { 
        var content = filterByTeam(teamname);
        var template = "/assets/templates/schedule_card_template.html";

        $.get(template, function (template) {
            renderTemplate(template, content, "#left-panel" );
            setGameCardEvents();
        });
    } else { 
        //TODO show all matches  or upcoming match whatever
    };
}
      
function renderGameDetails (matchId) {
   var content = getMatchData(matchId);
   var template = "/assets/templates/gamedetail_card_template.html";
   
   $.get(template, function (template) {
      renderTemplate(template, content, "#right-panel" );
   });
};
      
//getURL console.log(location.pathname)
function getUrl () {
    return location.pathname;
}

//function to change the history state
function doPushState (href) {
    var url = href; //  /schedule/ +
    var state = {selectedTeam : href};
    history.pushState(state, null,url);
}

//Function to get the matches of the selected team from the leagueData object 
function filterByTeam (value) {
    var filteredData = leagueData.matches.filter( function (i) {
        return i.hometeam === value || i.awayteam === value;
    });
    return filteredData;
}

//TODO [x] get data of a match by match id
function getMatchData(matchId) {
    var matchData = leagueData.matches.filter (function (i){
        return i.matchId === matchId;
    })
    return matchData;
}
