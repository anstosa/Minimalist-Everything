// ==UserScript==
// @name           GReader Favicon Alerts
// @description    Alerts you to the number of unread items in Google Reader.
// @version        1.1
// @date           2010-06-12
// @author         Peter Wooley
// @namespace      http://peterwooley.com
// @include        https://*.google.com/reader/view/*
// @include        http://*.google.com/reader/view/*
// @include        htt*://*.google.*/reader/view*
// ==/UserScript==

new GReaderFaviconAlerts;

function GReaderFaviconAlerts() {
    var self = this;

    this.construct = function() {
        this.head = document.getElementsByTagName("head")[0];
        this.pixelMaps = {
            icons: {
                'unread':
                    [
                        ['','','','','#f4896a','#f4896a','#ee775a','#eb6c52','#eb6c52','#e45941','#d83a2b','#d83a2b','#d83a2b','#f6d6d4','',''],
                        ['','','','#f4896a','#f4896a','#e99883','#f4896a','#ee775a','#eb6c52','#e45941','#de4733','#d83a2b','#d32e21','#ca1e18','',''],
                        ['','','','#f4896a','#fcfbf4','#f8f6ee','#f8f6ee','#f2c2b0','#ee775a','#e45941','#de4733','#d83a2b','#d32e21','#ce251b','',''],
                        ['','','','#f4896a','#f8f6ee','#f8f6ee','#f5f3ea','#f2f1e6','#f0e6da','#e5816e','#de4733','#d83a2b','#ce251b','#ca1e18','#e0ddce',''],
                        ['','','','#f4896a','#e6d1c5','#e6d1c5','#e6d1c5','#f2f1e6','#f0eee2','#edeade','#df7263','#d32e21','#ce251b','#c61a16','#e3e0d0','#e0ddce'],
                        ['','#0786fb','#0786fb','#0786fb','#0786fb','#0578e4','#0578e4','#0578e4','#0578e4','#3582cb','#dbd4cd','#cf4037','#ca1e18','#c61a16','#e3e0d0','#e0ddce'],
                        ['#0787fd','#0786fb','#0786fb','#0786fb','#0578e4','#0578e4','#0578e4','#0471da','#036bce','#0366c7','#3582cb','#e99883','#c61a16','#c61a16','#e3e0d0','#e0ddce'],
                        ['#0786fb','#fcfbf4','#dbe9f0','#9cc9ee','#238beb','#0578e4','#0578e4','#0471da','#036bce','#0366c7','#0366c7','#e7e4d4','#c61a16','#c61a16','#e0ddce','#dcdacb'],
                        ['#0786fb','#f8f6ee','#f8f6ee','#f5f3ea','#f2f1e6','#8abbe3','#0471da','#0471da','#036bce','#0366c7','#0366c7','#e4e1d2','#cf4037','#c61a16','#e0ddce','#dcdacb'],
                        ['#0786fb','#c1d0d5','#d7e0dd','#f5f3ea','#f2f1e6','#f0eee2','#c1d0d5','#1274d2','#0366c7','#0366c7','#0366c7','#d28677','#d05246','#c61a16','#e0ddce','#d7d6c8'],
                        ['#0786fb','#f5f3ea','#f2f1e6','#c1d0d5','#e3e5de','#f0eee2','#edeade','#9bb9ce','#0366c7','#025fbc','#0366c7','#bf3634','#bf3634','#d2b9b4','#edeade','#d3d2c5'],
                        ['#0786fb','#f2f1e6','#f0eee2','#f0eee2','#d1d9d5','#d1d9d5','#eae8da','#eae8da','#3582cb','#025fbc','#015ab3','#e9e8e2','#e3e5de','#fcfbf4','#f5f3ea','#d2cfc2'],
                        ['#0471da','#c1d0d5','#c1d0d5','#edeade','#edeade','#cbd5d5','#eae8da','#e7e4d4','#9bb9ce','#015ab3','#015ab3','#fcfbf4','#f2f1e6','fcfbf4#','#fcfbf4','#d7d6c8'],
                        ['#036bce','#edeade','#edeade','#c1d0d5','#eae8da','#eae8da','#aec2ca','#e7e4d4','#e4e1d2','#015ab3','#015ab3','#d3d2c5','#d3d2c5','#cdccc0','#cdccc0',''],
                        ['#036bce','#d7e0dd','#d7e0dd','#cbd5d5','#ccd8d7','#d7e0dd','#9bb9ce','#d1d9d5','#d1d9d5','#015ab3','#015ab3','','','','',''],
                        ['','#015ab3','#015ab3','#015ab3','#015ab3','#015ab3','#015ab3','#015ab3','#015ab3','#015ab3','','','','','','']
                    ]
                },
            numbers: {
                0: [
                    [1,1,1],
                    [1,0,1],
                    [1,0,1],
                    [1,0,1],
                    [1,1,1]
                ],
                1: [
                    [0,1,0],
                    [1,1,0],
                    [0,1,0],
                    [0,1,0],
                    [1,1,1]
                ],
                2: [
                    [1,1,1],
                    [0,0,1],
                    [1,1,1],
                    [1,0,0],
                    [1,1,1]
                ],
                3: [
                    [1,1,1],
                    [0,0,1],
                    [0,1,1],
                    [0,0,1],
                    [1,1,1]
                ],
                4: [
                    [0,0,1],
                    [0,1,1],
                    [1,0,1],
                    [1,1,1],
                    [0,0,1]
                ],
                5: [
                    [1,1,1],
                    [1,0,0],
                    [1,1,1],
                    [0,0,1],
                    [1,1,1]
                ],
                6: [
                    [0,1,1],
                    [1,0,0],
                    [1,1,1],
                    [1,0,1],
                    [1,1,1]
                ],
                7: [
                    [1,1,1],
                    [0,0,1],
                    [0,0,1],
                    [0,1,0],
                    [0,1,0]
                ],
                8: [
                    [1,1,1],
                    [1,0,1],
                    [1,1,1],
                    [1,0,1],
                    [1,1,1]
                ],
                9: [
                    [1,1,1],
                    [1,0,1],
                    [1,1,1],
                    [0,0,1],
                    [1,1,0]
                ],
                '+': [
                    [0,0,0],
                    [0,1,0],
                    [1,1,1],
                    [0,1,0],
                    [0,0,0]
                ],
                'k': [
                    [1,0,1],
                    [1,1,0],
                    [1,1,0],
                    [1,0,1],
                    [1,0,1]
                ]
            }
        };

        this.timer = setInterval(this.poll, 500);
        this.poll();

        return true;
    }

    this.drawUnreadCount = function(unread) {
        if(!self.textedCanvas) {
            self.textedCanvas = [];
        }

        if(!self.textedCanvas[unread]) {
            var iconCanvas = self.getUnreadCanvas();
            var textedCanvas = document.createElement('canvas');
            textedCanvas.height = textedCanvas.width = iconCanvas.width;
            var ctx = textedCanvas.getContext('2d');
            ctx.drawImage(iconCanvas, 0, 0);

            ctx.fillStyle = "#eeeeee";
            ctx.strokeStyle = "#888888";
            ctx.strokeWidth = 1;

            var count = unread.length;

            if(count > 4) {
                unread = "1k+";
                count = unread.length;
            }

            var bgHeight = self.pixelMaps.numbers[0].length;
            var bgWidth = 0;
            var padding = count < 4 ? 1 : 0;
            var topMargin = 2;

            for(var index = 0; index < count; index++) {
                bgWidth += self.pixelMaps.numbers[unread[index]][0].length;
                if(index < count-1) {
                    bgWidth += padding;
                }
            }
            bgWidth = bgWidth > textedCanvas.width-4 ? textedCanvas.width-4 : bgWidth;

            ctx.fillRect(textedCanvas.width-bgWidth-4,topMargin,bgWidth+4,bgHeight+4);

            var digit;
            var digitsWidth = bgWidth;
            for(var index = 0; index < count; index++) {
                digit = unread[index];

                if (self.pixelMaps.numbers[digit]) {
                    var map = self.pixelMaps.numbers[digit];
                    var height = map.length;
                    var width = map[0].length;

                    ctx.fillStyle = "#000000";

                    for (var y = 0; y < height; y++) {
                        for (var x = 0; x < width; x++) {
                            if(map[y][x]) {
                                ctx.fillRect(14- digitsWidth + x, y+topMargin+2, 1, 1);
                            }
                        }
                    }

                    digitsWidth -= width + padding;
                }
            }

            ctx.strokeRect(textedCanvas.width-bgWidth-3.5,topMargin+.5,bgWidth+3,bgHeight+3);

            self.textedCanvas[unread] = textedCanvas;
        }

        return self.textedCanvas[unread];
    };
    this.getIcon = function() {
        return self.getUnreadCanvas().toDataURL('image/png');
    };
    this.getUnreadCanvas = function() {
        if(!self.unreadCanvas) {
            self.unreadCanvas = document.createElement('canvas');
            self.unreadCanvas.height = self.unreadCanvas.width = 16;

            var ctx = self.unreadCanvas.getContext('2d');

            for (var y = 0; y < self.unreadCanvas.width; y++) {
                for (var x = 0; x < self.unreadCanvas.height; x++) {
                    if (self.pixelMaps.icons.unread[y][x]) {
                        ctx.fillStyle = self.pixelMaps.icons.unread[y][x];
                        ctx.fillRect(x, y, 1, 1);
                    }
                }
            }
        }

        return self.unreadCanvas;
    };
    this.getUnreadCount = function() {
        matches = self.getSearchText().match(/\((.*)\)/);
        return matches ? matches[1] : false;
    };
    this.getUnreadCountIcon = function() {
        var unread = self.getUnreadCount();
        return self.drawUnreadCount(unread).toDataURL('image/png');
    };
    this.getSearchText = function() {
        return document.title;
    };
    this.poll = function() {
        if(self.getUnreadCount()) {
            self.setIcon(self.getUnreadCountIcon());
        } else {
            self.setIcon(self.getIcon());
        }
    };

    this.setIcon = function(icon) {
        var links = self.head.getElementsByTagName("link");
        for (var i = 0; i < links.length; i++)
            if ((links[i].rel == "shortcut icon" || links[i].rel=="icon") &&
               links[i].href != icon) {
                self.head.removeChild(links[i]);
            } else if(links[i].href == icon) {
                return;
            }

        var newIcon = document.createElement("link");
        newIcon.type = "image/png";
        newIcon.rel = "shortcut icon";
        newIcon.href = icon;
        self.head.appendChild(newIcon);

        // Chrome hack for updating the favicon
        var shim = document.createElement('iframe');
        shim.width = shim.height = 0;
        document.body.appendChild(shim);
        shim.src = "icon";
        document.body.removeChild(shim);
    };

    this.toString = function() { return '[object GReaderFaviconAlerts]'; };

    return this.construct();
}


/* ### General - Open items in background ### */

_min.open = {
    check: function() {
        var key = String.fromCharCode(event.which);
        if (event.target.nodeName.toLowerCase() != 'input' &&
            event.target.nodeName.toLowerCase() != 'textarea' &&
            event.target.getAttribute('contenteditable') === null &&
            (key === 'v' || key === 'V')
        ) {
            event.stopPropagation();
            event.preventDefault();
            var current = document.getElementById('current-entry');
            if (current === null) { return; }
                current = current.querySelectorAll('.entry-title-link')[0].getAttribute('href');
            _min.open.open(current, key === 'V');
        }
    },
    open: function(url, isSelected) {
        document.dispatchEvent(new CustomEvent('openTab', {
            detail: {
                'url': url,
                'isSelected': isSelected
            },
            bubbles: true,
            cancelable: true
        }));
    }
};
document.addEventListener('keypress', _min.open.check, true);


/* ### General - Hide gbar ### */

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