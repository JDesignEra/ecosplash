'use strict';
var doc = document;

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
var $animationEnd = (function(el) {
    var animations = {
        "animation": "animationend",
        "OAnimation": "oAnimationEnd",
        "MozAnimation": "mozAnimationEnd",
        "WebkitAnimation": "webkitAnimationEnd"
    };

    for(var t in animations) {
        if(el.style[t] !== undefined) {
            return animations[t];
        }
    }
})(document.createElement('e'));

/* nav link active state */
var activeURL = location.href.split('/'),
    activeURL = activeURL[activeURL.length - 2],
    focus = doc.querySelector('nav .navbar-nav');

switch (activeURL) {
    case 'localhost':
    case doc.querySelector('base').href.substr(1, doc.querySelector('base').href.length - 2):
        focus.querySelector('a.nav-link[href="./"]').parentElement.classList.add('active');
        break;
}

/* login state */
if (localStorage.getItem('accType') == 0 || sessionStorage.getItem('accType') == 0) {
    doc.querySelector('nav .m-nav-right').remove();

    httpGet('./assets/templates/nav_state/navUser.html', function(data) {
        doc.querySelector('nav .nav-right').innerHTML = data;
    });

    httpGet('./assets/templates/nav_state/navUser_mobile.html', function(data) {
        doc.querySelector('#fixed-action').innerHTML = data;
    });
}
else if (localStorage.getItem('accType') == 1 || sessionStorage.getItem('accType') == 1) {
    doc.querySelector('nav .m-nav-right').remove();

    httpGet('./assets/templates/nav_state/navOrganization.html', function(data) {
        doc.querySelector('nav .nav-right').innerHTML = data;
    });

    httpGet('./assets/templates/nav_state/navOrganization_mobile.html', function(data) {
        doc.querySelector('#fixed-action').innerHTML = data;
    });
}

$('#fixed-action').on('shown.bs.dropdown', '#mProfileDropdown', function() {
    doc.querySelector('#fixed-action #profileAction.btn .fa-user-circle').classList.add('d-none');
    doc.querySelector('#fixed-action #profileAction.btn .fa-times').classList.remove('d-none');
    $('#mProfileDropdown > button[tooltip-toggle=fab-tooltip]').tooltip('show');

    focus = doc.querySelectorAll('#mProfileDropdown .dropdown-menu .btn');
    focus.forEach(function(el) {
        el.classList.add('slideInUp', 'short');

        $(el).one($animationEnd, function() {
            $(el).tooltip('show');
            el.classList.remove('slideInUp', 'short');
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
    $.ajax({
        type: 'POST',
        url: 'assets/db/db.php',
        data: 'uid=' + (localStorage.getItem('uid') ? localStorage.getItem('uid') : sessionStorage.getItem('uid') ? sessionStorage.getItem('uid') : '') + '&action=getUser',
        dataType: 'json',
        success: function(data) {
            // console.log(data); // Debugging Purpose
            if (data.success) {
                setTimeout(function () {
                    doc.querySelector('nav .nav-right #name').innerHTML = data.name;
                    doc.querySelector('nav .nav-right #ecopoints').innerHTML = data.ecoPoints;
                    doc.querySelector('nav .nav-right .badge.count').innerHTML = data.newNotifications;

                    doc.querySelector('#fixed-action #mProfileDropdown .dropdown-menu .ecopoints').setAttribute('data-original-title', data.ecoPoints + ' EcoPoints');

                    doc.querySelector('#fixed-action #mProfileDropdown .dropdown-menu .notifications').setAttribute('data-original-title', 'Notifications (' + data.newNotifications + ')');
                }, 500);

                if (doc.querySelector('section#redeem h5#ecopoints') != null) {
                    doc.querySelector('section#redeem h5#ecopoints').innerHTML = data.ecoPoints;
                }
            }
        },
        complete: function() {
            setTimeout(function () {
                worker();
            }, 1800000);    // 30 Mins
        }
    });
})();

/* footer year */
doc.querySelector('footer .year').innerHTML = new Date().getFullYear();

/* enable or re-enable tooltips */
enableTooltip();
enableNavToolTip()
enableFabToolTip();

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

/* mobile form tooltip fix */
if (window.outerWidth < 767) {
    enableMobile_FormToolTip();
}
else {
    enableFormToolTip();
}

window.onresize = function() {
    if (window.outerWidth < 767) {
        enableMobile_FormToolTip();
    }
    else {
        enableFormToolTip();
    }
};

/* mobile lanscape / portrait fab tooltip fix */
if (window.outerHeight < 565) {
    fabTooltip_mobileLandscape();
}
else {
    fabTooltip_mobilePortrait();
}

window.onresize = function() {
    if (window.outerHeight < 565) {
        fabTooltip_mobileLandscape();
        $('[toggle-tooltip=fab-tooltip]').tooltip('hide');

        focus = doc.querySelector('#mProfileDropdown .dropdown-menu');
        if (focus != null && focus.classList.contains('show')) {
            $('#mProfileDropdown #profileAction').dropdown('toggle');
        }
    }
    else {
        fabTooltip_mobilePortrait();
        $('[toggle-tooltip=fab-tooltip]').tooltip('hide');

        var focus = doc.querySelector('#mProfileDropdown .dropdown-menu');
        if (focus != null && focus.classList.contains('show')) {
            $('#mProfileDropdown #profileAction').dropdown('toggle');
        }
    }
};

function enableTooltip() {
    $(function () {
        $('[tooltip-toggle="tooltip"]').tooltip({
            delay: {
                show: 150,
                hide: 50
            }
        });
    });
}

function enableNavToolTip() {
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
    $(function () {
        $('[tooltip-toggle="form-tooltip"]').tooltip('dispose');
        $('[tooltip-toggle="form-tooltip"]').tooltip({
            template: '<div class="tooltip form-tooltip" role="tooltip"><div class="arrow"></div><div class="tooltip-inner"></div></div>',
            offset: '0, 20'
        });
        console.clear();
    });
}

function enableMobile_FormToolTip() {
    $(function () {
        $('[tooltip-toggle="form-tooltip"]').tooltip('dispose');
        $('[tooltip-toggle="form-tooltip"]').tooltip({
            template: '<div class="tooltip form-tooltip" role="tooltip"><div class="arrow"></div><div class="tooltip-inner"></div></div>',
            offset: '0, 5',
            placement: 'bottom'
        });
        console.clear();
    });
}

function enableFabToolTip() {
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

/* javascript ajax get function */
function httpGet(url, callback) {
    var httpRequest = new XMLHttpRequest();

    httpRequest.open('GET', url, true);
    httpRequest.onreadystatechange = function() {
        if (httpRequest.readyState == 4 && httpRequest.status == 200) {
            var data = httpRequest.responseText;
            if (callback) {
                callback(data);
            }
        }
    };

    httpRequest.send(null);
}
