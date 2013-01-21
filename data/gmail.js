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