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
            _min.gbar.originalElement.gbar.setAttribute('min-gbar','hidden');
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
    bootstrap: function() {
        if (document.querySelectorAll('.T-KT').length > 0) {
            window.removeEventListener('DOMSubtreeModified', _min.starred.bootstrap);
            window.addEventListener('click', _min.starred.update);
            window.addEventListener('keypress', _min.starred.update);
        }
    },
    update: function() {
        /* skip unrelated keystrokes */
        if (event.type === 'keypress' &&
            String.fromCharCode(event.which) !== 's'
        ) { return; }
        /* Find stars and inboxes */
        _min.starred.stars = document.querySelectorAll('.T-KT');
        _min.starred.inboxes = document.querySelectorAll('.ae4');
        /* ignore star modifications */
        for (var i = 0, l = _min.starred.inboxes.length; i < l; i++) {
            window.removeEventListener('click', _min.starred.update);
            window.removeEventListener('keypress', _min.starred.update);
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
            window.addEventListener('click', _min.starred.update);
            window.addEventListener('keypress', _min.starred.update);
        }
    }
};
/* Listen for DOM modifications */
window.addEventListener('DOMSubtreeModified', _min.starred.bootstrap);


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


/* ### Sidebar - Hide offline ### */

_min.offline = {
    chatList: undefined,
    icons: undefined,
    bootstrap: (function() {
        console.log(document.body.getAttribute('class'));
        _min.offline.icons = document.querySelectorAll('.vt');
        if (_min.offline.icons.length > 0) {
            _min.offline.chatList = _min.offlineicons[0].parentNode.parentNode.parentNode.parentNode;
            _min.offline.chatList.addEventListener('DOMSubtreeModified', _min.offline.update);
            _min.offline.update();
        } else {
            window.setTimeout(_min.offline.bootstrap, 1000);
        }
    })(),
    update: function() {
        _min.offline.chatList.removeEventListener('DOMSubtreeModified', _min.offline.update);
        _min.offline.icons = document.querySelectorAll('.vt');
        for (var i = 0, l = _min.offline.icons.length; i < l; i++) {
            if (_min.offline.icons[i].getAttribute('class').indexOf('df') > 0) {
                _min.offline.icons[i].parentNode.parentNode.parentNode.setAttribute('offline','true');
            } else {
                _min.offline.icons[i].parentNode.parentNode.parentNode.setAttribute('offline','');
            }
        }
        _min.offline.chatList.addEventListener('DOMSubtreeModified', _min.offline.update);
    }
};


/* ### Sidebar - Hide away ### */

_min.away = {
    chatList: undefined,
    icons: undefined,
    bootstrap: (function() {
        console.log(document.body.getAttribute('class'));
        _min.away.icons = document.querySelectorAll('.vt');
        if (_min.away.icons.length > 0) {
            _min.away.chatList = _min.awayicons[0].parentNode.parentNode.parentNode.parentNode;
            _min.away.chatList.addEventListener('DOMSubtreeModified', _min.away.update);
            _min.away.update();
        } else {
            window.setTimeout(_min.away.bootstrap, 1000);
        }
    })(),
    update: function() {
        _min.away.chatList.removeEventListener('DOMSubtreeModified', _min.away.update);
        _min.away.icons = document.querySelectorAll('.vt');
        for (var i = 0, l = _min.away.icons.length; i < l; i++) {
            if (_min.away.icons[i].getAttribute('class').match(/\b(dc|da|dk)\b/) > 0) {
                _min.away.icons[i].parentNode.parentNode.parentNode.setAttribute('away','true');
            } else {
                _min.away.icons[i].parentNode.parentNode.parentNode.setAttribute('away','');
            }
        }
        _min.away.chatList.addEventListener('DOMSubtreeModified', _min.away.update);
    }
};
