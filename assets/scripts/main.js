$('#select-by-team').change(function () {
  this.form.submit();
});

$('#select-by-date').change(function () {
  this.form.submit();
});

$('#filter-button').on("click",filterMenuToggle);

function filterMenuToggle() {
    $('#filter-menu').toggle();
}

