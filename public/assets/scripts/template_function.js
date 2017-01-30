function renderTemplate (template, data, destination){
          var filledTemplate = Mustache.render(template, data);
          $(destination).html(filledTemplate);
          $(destination).show();
        }
        
function appendTemplate (template, data, destination){
  var filledTemplate = Mustache.render(template, data);
  $(destination).prepend(filledTemplate);
}
        

