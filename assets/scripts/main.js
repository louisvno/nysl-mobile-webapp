//$('#select-by-team').change(function () {
//  this.form.submit();
//});
//
//$('#select-by-date').change(function () {
//  this.form.submit();
//});

$('#filter-button').on("click",toggleFilterMenu);

function toggleFilterMenu() {
    $('#filter-menu').toggle();
}

function closeFilterMenu() {
    $('#filter-menu').hide();
}

function setFilterMenuEvents () { 

    $('#filter-menu').find("a").on("click", function(event) {
        
        var href = $(this).attr("href");
        //prevent default link behaviour
        event.preventDefault();
        setUrl (href);
        closeFilterMenu();
        //TODO [x] sort and filter data
        var filteredData = filterByTeam(href);
        //TODO get template (maybe can load all at once)
        $.get("/assets/templates/schedule_card_template.html", function (template) {
            //render filter menu content
            renderTemplate(template, filteredData, "#left-panel" );
        });
        //TODO render template
    });
}

//getURL 


//function to change the url
function setUrl (href) {
    var url =  href; //  /schedule/ +
    history.pushState(null,null, url)
}

//Function to get the matches of the selected team from the leagueData object 
function filterByTeam (value) {
    
    var filteredData;
    filteredData = leagueData.matches.filter( function (i) {
    
        return i.hometeam === value || i.awayteam === value;
        
    });
    return filteredData;
}

