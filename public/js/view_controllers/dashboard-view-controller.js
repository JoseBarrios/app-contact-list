

// switchery stuff
	var elem = document.querySelector('.js-switch');
	var init = new Switchery(elem, {size: 'small'});


// toggle the published / draft
$(function(){
	$('div.e-toggle').click(function() {
		if ($('.js-switch').is(':checked')) {
			$('.draft-cards').hide();
			$('.published-cards').fadeIn();
			$('span.published').css('font-weight','bold');
			$('span.draft').css('font-weight','300');
		} else{
			$('.published-cards').hide();
			$('.draft-cards').fadeIn();
			$('span.draft').css('font-weight','bold');
			$('span.published').css('font-weight','300');
		}
	});

});



// customize modal
$('.add-ecard').click(function() {
    $('.modal')
        .prop('class', 'modal fade') // revert to default
        .addClass( $(this).data('direction') );
    $('.modal').modal('show');
});


//sortable
$(function() {
    $( ".sortable" ).sortable({
      placeholder: "ui-state-highlight",
      items: ".ecard"
    });
    $( ".sortable" ).disableSelection();
  });
