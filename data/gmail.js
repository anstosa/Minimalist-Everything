/* ### Google Bar - Hide Google Bar ### */

_min.gbar = {
    originalElement: null,
    toggleElement: undefined,
    toggle: function() {
        if (_min.gbar.toggleElement.nextSibling.getAttribute('min-gbar') === 'hidden' || event.keyCode === 47) {
            _min.gbar.toggleElement.nextSibling.removeAttribute('min-gbar');
        } else {
            _min.gbar.toggleElement.nextSibling.setAttribute('min-gbar','hidden');
        }
    },
    bootstrap: function() {
        _min.gbar.originalElement = document.getElementById('gb');
        if (_min.gbar.originalElement === null) {
            setTimeout(_min.gbar.bootstrap, 500);
        } else {
            _min.gbar.originalElement.setAttribute('min-gbar','hidden');
            // don't create toggle if it exists
            if (document.getElementById('gbarToggle') === null) {
                _min.gbar.toggleElement = document.createElement('div');
                _min.gbar.toggleElement.setAttribute('id', 'gbarToggle');
                _min.gbar.originalElement.parentNode.insertBefore(
                    _min.gbar.toggleElement,
                    _min.gbar.originalElement
                );
            }
            _min.gbar.toggleElement = document.getElementById('gbarToggle');
            _min.gbar.toggleElement.addEventListener('click', _min.gbar.toggle);
            window.addEventListener('keypress', function() {
                // make sure user is not typing
                if (
                    event.target.nodeName.toLowerCase() !== 'input' &&
                    event.target.nodeName.toLowerCase() !== 'textarea' &&
                    event.target.getAttribute('contenteditable') === null &&
                    (event.keyCode === 92 || event.keyCode === 47)
                ) {
                    _min.gbar.toggle();
                }
            });
        }
    }
};
_min.gbar.bootstrap();


/* ### Header - Hide Header ### */

_min.header = {
    originalElement: null,
    toggleElement: undefined,
    toggle: function() {
        if (_min.header.toggleElement.nextSibling.getAttribute('min-header') === 'hidden' || event.keyCode === 47) {
            _min.header.toggleElement.nextSibling.removeAttribute('min-header');
            // force 'comfortable' to recalculate positions
            var forceResize = document.createEvent('HTMLEvents');
                forceResize.initEvent('resize', true, true);
            document.body.dispatchEvent(forceResize);
        } else {
            _min.header.toggleElement.nextSibling.setAttribute('min-header','hidden');
        }
    },
    bootstrap: function() {
        _min.header.originalElement = document.getElementById('gb');
        if (_min.header.originalElement === null) {
            setTimeout(_min.header.bootstrap, 500);
        } else {
            _min.header.originalElement.setAttribute('min-header','hidden');
            // don't create toggle if it exists
            if (document.getElementById('gbarToggle') === null) {
                _min.header.toggleElement = document.createElement('div');
                _min.header.toggleElement.setAttribute('id', 'gbarToggle');
                _min.header.originalElement.parentNode.insertBefore(
                    _min.header.toggleElement,
                    _min.header.originalElement
                );
            }
            _min.header.toggleElement = document.getElementById('gbarToggle');
            _min.header.toggleElement.addEventListener('click', _min.header.toggle);
            window.addEventListener('keypress', function() {
                // make sure user is not typing
                if (
                    event.target.nodeName.toLowerCase() != 'input' &&
                    event.target.nodeName.toLowerCase() != 'textarea' &&
                    event.target.getAttribute('contenteditable') === null &&
                    (event.keyCode === 92 || event.keyCode === 47)
                ) {
                    _min.header.toggle();
                }
            });
        }
    }
};
_min.header.bootstrap();


/* ### Main - Highlight starred rows ### */

_min.starred = {
    stars: undefined,
    inboxes: undefined,
    starsInit: function() {
        if (document.querySelectorAll('.T-KT').length > 0) {
            window.removeEventListener('DOMSubtreeModified', _min.starred.starsInit);
            window.addEventListener('click', _min.starred.checkStars);
            window.addEventListener('keypress', _min.starred.checkStars);
        }
    },
    checkStars: function() {
        /* Find stars and inboxes */
        _min.starred.stars = document.querySelectorAll('.T-KT');
        _min.starred.inboxes = document.querySelectorAll('.ae4');
        /* ignore star modifications */
        for (var i = 0, l = _min.starred.inboxes.length; i < l; i++) {
            window.removeEventListener('click', _min.starred.checkStars);
            window.removeEventListener('keypress', _min.starred.checkStars);
        }
        /* loop through stars */
        for (var i = 0, l = _min.starred.stars.length; i < l; i++) {
            /* check if starred, mark row */
            if (
                _min.starred.stars[i].getAttribute('class').indexOf('T-KT-Jp') > -1 ||
                _min.starred.stars[i].getAttribute('title').indexOf('Starred') > -1
            ) {
                _min.starred.stars[i].parentNode.parentNode.setAttribute('starred', 'true');
            } else {
                _min.starred.stars[i].parentNode.parentNode.setAttribute('starred', 'false');
            }
        }
        /* listen for star modifications */
        for (var i = 0, l = _min.starred.inboxes.length; i < l; i++) {
            window.addEventListener('click', _min.starred.checkStars);
            window.addEventListener('keypress', _min.starred.checkStars);
        }
    }
};

/* Listen for DOM modifications */
window.addEventListener('DOMSubtreeModified', _min.starred.starsInit);


/* ### Main - Highlight starred rows ### */

/* check for stars */
document.addEventListener('keypress', function(event) {
    var target = event.target.nodeName.toLowerCase(),
        key = String.fromCharCode(event.which);
    /* return if typing */
    if (target === 'input' || target === 'textarea' ||
        event.target.getAttribute('contenteditable') !== null
    ) { return; }

    /* check if navigation */
    if (
        (key === 'j' || key === 'k') &&
        !event.ctrlKey && !event.metaKey
    ) {
        setTimeout(function() {
            var pointers = document.querySelectorAll('.PF');
            for (var i = 0, l = pointers.length; i < l; i++) {
                pointers[i].parentNode.setAttribute('selected', 'false');
                if (pointers[i].getAttribute('class').indexOf('PE') > -1) {
                    var row = pointers[i].parentNode,
                        wrap = pointers[i].parentNode.parentNode.parentNode.parentNode.parentNode,
                        section = pointers[i].parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
                    if (key === 'j') {
                        if (row !== null) {
                            // There is a next line
                            row.setAttribute('selected','true');
                        } else if (
                            wrap.previousSibling !== null &&        // is section
                            section.nextSibling !== null &&         // has next section
                            section.nextSibling.firstChild !== null // next section is not empty
                        ) {
                            // There is a next section
                            while (section.nextSibling.childNodes[1].firstChild === null) {
                                section = section.nextSibling;
                            }
                            if (section.nextSibling.firstChild !== null &&
                                section.nextSibling.childNodes[1].firstChild !== null
                            ) {
                                section.nextSibling.childNodes[1].firstChild.firstChild.childNodes[1].firstChild.setAttribute('selected', 'true');
                            } else {
                                row.setAttribute('selected', 'true');
                            }
                        } else {
                            // End of list
                            row.setAttribute('selected', 'true');
                        }
                    } else {
                        if (row !== null) {
                            // There is a next line
                            row.setAttribute('selected', 'true');
                        } else if (
                            wrap.previousSibling !== null &&            // is section
                            section.previousSibling !== null &&         // has next section
                            section.previousSibling.firstChild !== null // next section is not empty
                        ) {
                            // There is a next section
                            while (section.previousSibling.childNodes[1].firstChild === null) {
                                section = section.nextSibling;
                            }
                            if (section.previousSibling.firstChild !== null &&
                                section.previousSibling.childNodes[1].firstChild !== null
                            ) {
                                section.previousSibling.childNodes[1].firstChild.firstChild.childNodes[1].firstChild.setAttribute('selected', 'true');
                            } else {
                                row.setAttribute('selected', 'true');
                            }
                        } else {
                            // End of list
                            row.setAttribute('selected', 'true');
                        }
                    }
                }
            }
        }, 1);
    }
});