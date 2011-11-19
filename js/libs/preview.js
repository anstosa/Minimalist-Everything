/**
 * Image preview for Minimalist
 * 
 * © 2011 Ansel Santosa
 * Licensed under GNU GPL v3
 **/

function imagePreview() {
	var xOffset = 0,
		yOffset = 32;
	$('#p_opt label[screen]').live('mouseover', function(e) {
		var xPos = $(this).offset().left,
			yPos = $(this).offset().top;
		$('body').append('<div id="hoverPreview"><img src="' + $(this).attr('screen') + '" /></div>');
		$('#hoverPreview img').load(function() {
			$('#hoverPreview img')
				.css({
					'max-width': window.innerWidth - 50,
					'max-height': window.innerHeight - 50
				})
				.parent()
					.css({
						'top': (yPos + yOffset) + 'px',
						'left': (xPos + xOffset) + 'px'
					})
			;
			if ($('#hoverPreview').width() > (window.innerWidth - xPos - 60)) {
				if ($('#hoverPreview').width() > (window.innerWidth - 60)) {
					$('#hoverPreview')
						.css('left', '15px')
						.children()
							.css('width', (window.innerWidth - 60) + 'px')
					;
				} else {
					$('#hoverPreview').css('left', (window.innerWidth - $('#hoverPreview').width() - 60) + 'px');
				}
			}
			if ($('#hoverPreview').height() > (window.innerHeight - yPos - 75)) {
				if (yPos < (window.innerHeight / 2)) {
					$('#hoverPreview img').css('height', (window.innerHeight - yPos - yOffset - 45) + 'px');
				} else {
					if ($('#hoverPreview').height() > (yPos - 60)) {
						$('#hoverPreview')
							.css('top', '15px')
							.children()
								.css('height', (yPos - yOffset + 16 - 45) + 'px')	
						;
					} else {
						$('#hoverPreview').css('top', (yPos - $('#hoverPreview').height() - yOffset) + 'px');
					}	
				}
			}
			$('#hoverPreview').fadeIn(150);		
		});				
	});
	$('#p_opt label[screen]').live('mouseout', function() {
		$('#hoverPreview').remove();
	});
};
$(document).ready(function() {
	imagePreview();
});