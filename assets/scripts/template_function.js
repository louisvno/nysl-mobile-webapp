function renderTemplate (template, data, destination){
          var filledTemplate = Mustache.render(template, data);
          $(destination).html(filledTemplate);
        }
        
function appendTemplate (template, data, destination){
  var filledTemplate = Mustache.render(template, data);
  $(destination).prepend(filledTemplate);
}
        

