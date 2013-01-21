/**
 * Image preview for Minimalist
 *
 * © 2013 Ansel Santosa
 * Licensed under GNU GPL v3
 **/

/* Initialize */
(imagePreview)();

function imagePreview() {
    var xOffset = 0,
        yOffset = 32;
    $('#page-options')
        .on('mouseout', 'label[screen]', function() {
            $('#hoverPreview').remove();
        })
        .on('mouseover', 'label[screen]', function() {
            var xPos = $(this).offset().left,
                yPos = $(this).offset().top;
            $(document.body).append('<div id="hoverPreview"><img src="' + $(this).attr('screen') + '" /></div>');
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

                // Preview collides with right side
                if ($('#hoverPreview').width() > (window.innerWidth - xPos - 60)) {
                    if ($('#hoverPreview').width() > (window.innerWidth - 60)) {
                        // preview is wider than window
                        $('#hoverPreview')
                            .css('left', '15px')
                            .children()
                                .css('width', (window.innerWidth - 60) + 'px')
                        ;
                    } else {
                        // preview will fit if left side is used
                        $('#hoverPreview').css('left', (window.innerWidth - $('#hoverPreview').width() - 60) + 'px');
                    }
                }

                // Preview collides with bottom
                if ($('#hoverPreview').height() > (window.innerHeight - yPos - 75)) {
                    if (yPos < (window.innerHeight / 2)) {
                        // preview is in top half of screen
                        $('#hoverPreview img').css('height', (window.innerHeight - yPos - yOffset - 45) + 'px');
                    } else {
                        // preview is in bottom half of screen
                        if ($('#hoverPreview').height() > (yPos - 60)) {
                            // preview is too tall for window
                            $('#hoverPreview')
                                .css('top', '15px')
                                .children()
                                    .css('height', (yPos - yOffset + 16 - 45) + 'px')
                            ;
                        } else {
                            // preview will fit in window if top is used
                            $('#hoverPreview').css('top', (yPos - $('#hoverPreview').height() - yOffset) + 'px');
                        }
                    }
                }
                $('#hoverPreview').fadeIn(150);
            });
        })
    ;
}