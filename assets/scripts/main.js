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
        var filteredData = getFilteredData(href);
        //TODO get template (maybe can load all at once)
        $.get("assets/templates/schedule_card_template", function (template) {
            //render filter menu content
            renderTemplate(template, filteredData, "#left-panel" );
        });
        //TODO render template
    });
}

//function to change the url
function setUrl (parameter) {
    var url = "?team=" + parameter;
    history.pushState(null,null, url)
}

//Function to get the matches of the selected team from the leagueData object 
function getFilteredData (value) {
    
    var filteredData;
    filteredData = leagueData.matches.filter( function (i) {
    
        return i.hometeam === value || i.awayteam === value;
        
    });
    return filteredData;
}

