'use strict';
const doc = document;

/* scrolling nav */
var offset_top = 50;
window.onscroll = function(e) {
    var focus = doc.querySelector('.navbar');
    if ($(focus).offset().top > offset_top) {
        focus.classList.remove('navbar-light', 'bg-light', 'py-3');
        focus.classList.add('navbar-dark', 'bg-gradient');
    }
    else {
        focus.classList.remove('navbar-dark', 'bg-gradient');
        focus.classList.add('navbar-light', 'bg-light', 'py-3');
    }
}

/* animation end fix */
var animationEnd = (function(el) {
    var animations = {
        'animation': 'animationend',
        'OAnimation': 'oAnimationEnd',
        'MozAnimation': 'mozAnimationEnd',
        'WebkitAnimation': 'webkitAnimationEnd'
    };

    for(var t in animations) {
        if(el.style[t] !== undefined) {
            return animations[t];
        }
    }
})(doc.createElement('el'));

/* nav link active state */
var activeURL = location.href.split('/'),
    activeURL = activeURL[activeURL.length - 2],
    focus = doc.querySelector('nav .navbar-nav');

switch (activeURL) {
    case window.location.hostname:
        focus.querySelector('a.nav-link[href="./"]').parentElement.classList.add('active');
        break;

    case 'quiz':
        focus.querySelector('a.nav-link[href="./quiz"]').parentElement.classList.add('active');
        break;

    case 'events':
        focus.querySelector('a.nav-link[href="./events"]').parentElement.classList.add('active');
        break;
}

/* login state nav */
if (localStorage.getItem('accType') == 0 || sessionStorage.getItem('accType') == 0) {
    doc.querySelector('nav .m-nav-right').remove();

    httpGetDoc('./assets/templates/nav_state/navUser.html', function(content) {
        var nodes = content.querySelectorAll('li'),
            focus = doc.querySelector('nav .nav-right');

        focus.innerHTML = ''

        nodes.forEach(function(el) {
            focus.appendChild(el);
        });
    });

    httpGetDoc('./assets/templates/nav_state/navUser_mobile.html', function(content) {
        var focus = doc.querySelector('#fixed-action');

        focus.innerHTML = '';
        focus.appendChild(content.querySelector('#mProfileDropdown'));
    });
}
else if (localStorage.getItem('accType') == 1 || sessionStorage.getItem('accType') == 1) {
    doc.querySelector('nav .m-nav-right').remove();

    httpGetDoc('./assets/templates/nav_state/navOrganization.html', function(content) {
        var nodes = content.querySelectorAll('li'),
            focus = doc.querySelector('nav .nav-right');

        focus.innerHTML = '';

        nodes.forEach(function(el) {
            focus.appendChild(el);
        });
    });

    httpGetDoc('./assets/templates/nav_state/navOrganization_mobile.html', function(content) {
        var focus = doc.querySelector('#fixed-action');

        focus.innerHTML = '';
        focus.appendChild(content.querySelector('#mProfileDropdown'));
    });
}

$('#fixed-action').on('shown.bs.dropdown', '#mProfileDropdown', function(e) {
    doc.querySelector('#fixed-action #profileAction.btn .fa-user-circle').classList.add('d-none');
    doc.querySelector('#fixed-action #profileAction.btn .fa-times').classList.remove('d-none');
    $('#mProfileDropdown > button[tooltip-toggle=fab-tooltip]').tooltip('show');

    focus = doc.querySelectorAll('#mProfileDropdown .dropdown-menu .btn');

    focus.forEach(function(el) {
        el.classList.add('slideInUp', 'short');

        el.addEventListener(animationEnd, function() {
            $(el).tooltip('show');
            el.classList.remove('slideInUp', 'short');
            el.removeEventListener(animationEnd, function() {});
        });
    });
});

$('#fixed-action').on('hide.bs.dropdown', '#mProfileDropdown', function(e) {
    doc.querySelector('#fixed-action #profileAction.btn .fa-user-circle').classList.remove('d-none');
    doc.querySelector('#fixed-action #profileAction.btn .fa-times').classList.add('d-none');
    $('#mProfileDropdown > button[tooltip-toggle=fab-tooltip]').tooltip('hide');

    focus = doc.querySelectorAll('#mProfileDropdown .dropdown-menu .btn');
    focus.forEach(function(el) {
        $(el).tooltip('hide');
    })
});

/* periodic worker every 30 mins */
(function worker() {
    var uid = (localStorage.getItem('uid') ? localStorage.getItem('uid') : sessionStorage.getItem('uid')),
    data = new FormData();

    data.append('uid', (uid ? uid : ''));
    data.append('action', 'getUser');

    httpPost('./assets/db/db.php', data, function(data) {
        // console.log(data);  // Debugging Purpose
        addWindowOnload(function() {
            if (uid) {
                // Desktop Navs
                if (doc.querySelector('nav .nav-right')) {
                    doc.querySelector('nav .nav-right #name').innerHTML = data.name;
                    doc.querySelector('nav .nav-right .badge.count').innerHTML = data.newNotifications;

                    if (doc.querySelector('nav .nav-right #ecopoints')) {
                        doc.querySelector('nav .nav-right #ecopoints').innerHTML = data.ecoPoints;
                    }
                }

                // Mobile navs
                if (doc.querySelector('#fixed-action #mProfileDropdown .dropdown-menu .ecopoints')) {
                    doc.querySelector('#fixed-action #mProfileDropdown .dropdown-menu .ecopoints').setAttribute('data-original-title', data.ecoPoints + ' EcoPoints');
                }

                doc.querySelector('#fixed-action #mProfileDropdown .dropdown-menu .notifications').setAttribute('data-original-title', 'Notifications (' + data.newNotifications + ')');
            }
        });

        if (doc.querySelector('section#redeem h5#ecopoints')) {
            doc.querySelector('section#redeem h5#ecopoints').innerHTML = data.ecoPoints;
        }

        setTimeout(function () {
            worker();
        }, 1800000);
    });
})();

/* footer year */
doc.querySelector('footer .year').innerHTML = new Date().getFullYear();

/* invoke tooltips */
addWindowOnload(function() {
    enableTooltip();
    enableDangerTooltip();
    enableSuccessToolTip();
    enableNavToolTip();
    enableFabToolTip();
    enableWideFormToolTip();
});

/* mobile form tooltip fix */
if (window.outerWidth < 767) {
    enableMobile_FormToolTip();
}
else {
    enableFormToolTip();
}

addWindowOnResize(function() {
    if (window.outerWidth < 767) {
        enableMobile_FormToolTip();
    }
    else {
        enableFormToolTip();
    }
});

/* mobile lanscape / portrait fab tooltip fix */
if (window.outerHeight < 565) {
    fabTooltip_mobileLandscape();
}
else {
    fabTooltip_mobilePortrait();
}

addWindowOnResize(function() {
    if (window.outerHeight < 565) {
        fabTooltip_mobileLandscape();
        $('[toggle-tooltip=fab-tooltip]').tooltip('hide');

        focus = doc.querySelector('#mProfileDropdown .dropdown-menu');
        if (focus && focus.classList.contains('show')) {
            $('#mProfileDropdown #profileAction').dropdown('toggle');
        }
    }
    else {
        fabTooltip_mobilePortrait();
        $('[toggle-tooltip=fab-tooltip]').tooltip('hide');

        var focus = doc.querySelector('#mProfileDropdown .dropdown-menu');
        if (focus && focus.classList.contains('show')) {
            $('#mProfileDropdown #profileAction').dropdown('toggle');
        }
    }
});

/* nav tooltips fix */
$(document).on('focus', 'nav [tooltip-toggle=tooltip]', function() {
    $(this).tooltip('hide');
});

/* mobile hamburger animation */
doc.querySelector('nav .navbar-toggler').onclick = function() {
    if (doc.querySelector('nav .navbar-toggler').classList.contains('collapsed')) {
        doc.querySelector('nav .navbar-toggler .fa-bars').classList.add('d-none');
        doc.querySelector('nav .navbar-toggler .fa-times').classList.remove('d-none');
    }
    else {
        doc.querySelector('nav .navbar-toggler .fa-bars').classList.remove('d-none');
        doc.querySelector('nav .navbar-toggler .fa-times').classList.add('d-none');
    }
};

/* carousel */
$('.carousel').carousel({
    interval: 3500
});

/* tooltips function */
function enableTooltip() {
    $('[tooltip-toggle="tooltip"]').tooltip('dispose');
    $(function () {
        $('[tooltip-toggle="tooltip"]').tooltip({
            delay: {
                show: 150,
                hide: 50
            }
        });
    });
}

function enableDangerTooltip() {
    $('[tooltip-toggle="danger-tooltip"]').tooltip('dispose');
    $(function () {
        $('[tooltip-toggle="danger-tooltip"]').tooltip({
            template: '<div class="tooltip danger-tooltip" role="tooltip"><div class="arrow"></div><div class="tooltip-inner"></div></div>',
            delay: {
                show: 150,
                hide: 50
            }
        });
    });
}

function enableSuccessToolTip() {
    $('[tooltip-toggle="success-tooltip"]').tooltip('dispose');
    $(function () {
        $('[tooltip-toggle="success-tooltip"]').tooltip({
            template: '<div class="tooltip success-tooltip" role="tooltip"><div class="arrow"></div><div class="tooltip-inner"></div></div>',
            delay: {
                show: 150,
                hide: 50
            }
        });
    });
}

function enableNavToolTip() {
    $('[tooltip-toggle="nav-tooltip"]').tooltip('dispose');
    $(function () {
        $('[tooltip-toggle="nav-tooltip"]').tooltip({
            delay: {
                show: 150,
                hide: 50
            },
            placement: 'left',
            trigger: 'hover'
        });
    });
}

function enableFormToolTip() {
    $('[tooltip-toggle="form-tooltip"]').tooltip('dispose');
    $(function () {
        $('[tooltip-toggle="form-tooltip"]').tooltip({
            template: '<div class="tooltip form-tooltip" role="tooltip"><div class="arrow"></div><div class="tooltip-inner"></div></div>',
            offset: '0, 20'
        });
        // console.clear();
    });
}

function enableWideFormToolTip() {
    $('[tooltip-toggle="form-wide-tooltip"]').tooltip('dispose');
    $(function () {
        $('[tooltip-toggle="form-wide-tooltip"]').tooltip({
            template: '<div class="tooltip form-tooltip" role="tooltip"><div class="arrow"></div><div class="tooltip-inner"></div></div>',
            offset: '0, 5',
            placement: 'bottom'
        });
    });
}

function enableMobile_FormToolTip() {
    $('[tooltip-toggle="form-tooltip"]').tooltip('dispose');
    $(function () {
        $('[tooltip-toggle="form-tooltip"]').tooltip({
            template: '<div class="tooltip form-tooltip" role="tooltip"><div class="arrow"></div><div class="tooltip-inner"></div></div>',
            offset: '0, 5',
            placement: 'bottom'
        });
        // console.clear();
    });
}

function enableFabToolTip() {
    $('[tooltip-toggle="fab-tooltip"]').tooltip('dispose');

    $(function () {
        $('[tooltip-toggle="fab-tooltip"]').tooltip({
            template: '<div class="tooltip d-block d-md-none d-lg-none d-xl-none" role="tooltip"><div class="arrow"></div><div class="tooltip-inner"></div></div>',
            offset: '0, 5',
            trigger: 'manual'
        });
    });
}

function fabTooltip_mobileLandscape() {
    setTimeout(function () {
        var $fabs = $('#fixed-action').find('#mProfileDropdown .dropdown-menu [tooltip-toggle=fab-tooltip]');
        $($fabs).each(function() {
            $(this).tooltip('dispose');

            if ($(this).hasClass('ecopoints')) {

                $(this).tooltip({
                    template: '<div class="tooltip d-block d-md-none d-lg-none d-xl-none" role="tooltip"><div class="arrow"></div><div class="tooltip-inner"></div></div>',
                    offset: '0, 5',
                    trigger: 'manual',
                    placement: 'top'
                });
            }
            else if ($(this).hasClass('notifications')) {
                $(this).tooltip({
                    template: '<div class="tooltip d-block d-md-none d-lg-none d-xl-none" role="tooltip"><div class="arrow"></div><div class="tooltip-inner"></div></div>',
                    offset: '0, 5',
                    trigger: 'manual',
                    placement: 'top'
                });
            }
            else {
                $(this).tooltip('disable');
            }
        });
    }, 500);
}

function fabTooltip_mobilePortrait() {
    setTimeout(function () {
        var $fabs = $('#fixed-action').find('#mProfileDropdown .dropdown-menu [tooltip-toggle=fab-tooltip]');
        $($fabs).each(function() {
            $(this).tooltip('dispose');

            if ($(this).hasClass('ecopoints')) {

                $(this).tooltip({
                    template: '<div class="tooltip d-block d-md-none d-lg-none d-xl-none" role="tooltip"><div class="arrow"></div><div class="tooltip-inner"></div></div>',
                    offset: '0, 5',
                    trigger: 'manual',
                    placement: 'right'
                });
            }
            else if ($(this).hasClass('notifications')) {
                $(this).tooltip({
                    template: '<div class="tooltip d-block d-md-none d-lg-none d-xl-none" role="tooltip"><div class="arrow"></div><div class="tooltip-inner"></div></div>',
                    offset: '0, 5',
                    trigger: 'manual',
                    placement: 'right'
                });
            }
            else {
                $(this).tooltip('enable');
            }
        });
    }, 500);
}

/* secure pages */
function securePage(...accTypes) {
    var accType = (localStorage.getItem('accType') ? localStorage.getItem('accType') : sessionStorage.getItem('accType'));

    if (accTypes.indexOf(parseInt(accType)) == -1) {
        location.href = './';
    }

    var uid = (localStorage.getItem('uid') ? localStorage.getItem('uid') : sessionStorage.getItem('uid')),
        pass = (localStorage.getItem('pass') ? localStorage.getItem('pass') : sessionStorage.getItem('pass')),
        data = new FormData();

    data.append('uid', uid);
    data.append('pass', pass);
    data.append('action', 'checkUser');

    httpPost('./assets/db/db.php', data, function(data) {
        // console.log(data);  // Debugging Purpose
        if (data.errors) {
            location.href = './';
        }
    });
}

/* javascript ajax get document */
function httpGetDoc(url, callback) {
    var httpRequest = new XMLHttpRequest();

    httpRequest.open('GET', url, true);
    httpRequest.responseType = 'document';

    httpRequest.onload = function(e) {
        var data = e.target.response;

        if (callback) {
            callback(data);
        }
    };
    httpRequest.send(null);
}

/* javascript ajax get image */
function httpGetImage(url, callback) {
    var httpRequest = new XMLHttpRequest();

    httpRequest.open('GET', url, true);
    httpRequest.responseType = 'blob';

    httpRequest.onload = function(e) {
        var data = e.target.response;

        if (callback && (data.type == 'image/png' || data.type == 'image/jpg' || data.type == 'image/jpeg')) {
            data = (window.URL || window.webkitURL).createObjectURL(data);
            callback(data);
        }
    };
    httpRequest.send(null);
}

/* javascript ajax post function */
function httpPost(url, params, callback) {
    var httpRequest = new XMLHttpRequest();

    httpRequest.open('POST', url, true);
    httpRequest.onreadystatechange = function() {
        if (httpRequest.readyState == 4 && httpRequest.status == 200) {
            var data = JSON.parse(httpRequest.responseText);

            if (callback) {
                callback(data);
            }
        }
    };
    httpRequest.send(params);
}

/* multiple window.onload function (invoke function after everything is loaded) */
function addWindowOnload(func) {
    var oldOnload = window.onload;

    if (typeof window.onload != 'function') {
        window.onload = func;
    }
    else {
        window.onload = function() {
            if (oldOnload) {
                oldOnload();
            }

            func();
        }
    }
}

/* multiple window.onresize function (invoke function on window resize) */
function addWindowOnResize(func) {
    var oldOnResize = window.onresize;

    if (typeof window.onresize != 'function') {
        window.onresize = func;
    }
    else {
        window.onresize = function() {
            if (oldOnResize) {
                oldOnResize();
            }

            func();
        }
    }
}
