'use strict';

/* scrolling nav */
var $OFFSET_TOP = 50;
$(window).scroll(function () {
    if ($('.navbar').offset().top > $OFFSET_TOP) {
        $('.navbar').removeClass("navbar-light bg-light py-3");
        $('.navbar').addClass("navbar-dark bg-gradient");
    }
    else {
        $('.navbar').removeClass("navbar-dark bg-gradient");
        $('.navbar').addClass("navbar-light bg-light py-3");
    }
});

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
})(document.createElement("fakeelement"));

/* nav link active state */
var $activeURL = $(location).attr('href').split('/'),
    $activeURL = $activeURL[$activeURL.length - 2],
    $focus = $('nav .navbar-nav');

switch ($activeURL) {
    case 'localhost':
    case $('base').attr('href').substr(1, $('base').attr('href').length - 2):
        $focus.find('a.nav-link[href="./"]').parent().addClass('active');
        break;
}

/* login state */
if (localStorage.getItem('accType') == 0 || sessionStorage.getItem('accType') == 0) {
    $('nav .m-nav-right').remove();

    $.get('./assets/templates/nav_state/navUser.html', function(data) {
        $('nav .nav-right').html(data);
    });

    $.get('./assets/templates/nav_state/navUser_mobile.html', function(data) {
        $('#fixed-action').html(data);
    });
}
else if (localStorage.getItem('accType') == 1 || sessionStorage.getItem('accType') == 1) {
    $('nav .m-nav-right').remove();

    $.get('./assets/templates/nav_state/navOrganization.html', function(data) {
        $('nav .nav-right').html(data);
    });

    $.get('./assets/templates/nav_state/navOrganization_mobile.html', function(data) {
        $('#fixed-action').html(data);
    });
}

$('#fixed-action').on('shown.bs.dropdown', '#mProfileDropdown', function() {
    $('#fixed-action #profileAction.btn .fa-user-circle').addClass('d-none');
    $('#fixed-action #profileAction.btn .fa-times').removeClass('d-none');
    $('#mProfileDropdown > button[tooltip-toggle=fab-tooltip]').tooltip('show');

    $('#mProfileDropdown .dropdown-menu .btn').each(function() {
        $(this).addClass('slideInUp short').one($animationEnd, function() {
            $(this).tooltip('show');
            $(this).removeClass('slideInUp short');
        });
    });
});

$('#fixed-action').on('hide.bs.dropdown', '#mProfileDropdown', function(e) {
    $('#fixed-action #profileAction.btn .fa-user-circle').removeClass('d-none');
    $('#fixed-action #profileAction.btn .fa-times').addClass('d-none');
    $('#mProfileDropdown > button[tooltip-toggle=fab-tooltip]').tooltip('hide');

    $('#mProfileDropdown .dropdown-menu .btn').each(function() {
        $(this).tooltip('hide');
    });
});

/* periodic worker every 30 mins */
(function worker() {
    if (localStorage.getItem('uid') || sessionStorage.getItem('uid')) {
        $.ajax({
            type: 'POST',
            url: 'assets/db/db.php',
            data: 'uid=' + (localStorage.getItem('uid') ? localStorage.getItem('uid') : sessionStorage.getItem('uid')) + '&action=getUser',
            dataType: 'json',
            success: function(data) {
                // console.log(data); // Debugging Purpose
                if (data.success) {
                    setTimeout(function () {
                        $('nav .nav-right #name').html(data.name);
                        $('nav .nav-right #ecopoints').html(data.ecoPoints);
                        $('nav .nav-right .badge.count').html(data.newNotifications);
                        $('#fixed-action #mProfileDropdown .dropdown-menu .ecopoints').attr('data-original-title', data.ecoPoints + ' EcoPoints');
                        $('#fixed-action #mProfileDropdown .dropdown-menu .notifications').attr('data-original-title', 'Notifications (' + data.newNotifications + ')');
                    }, 500);

                    $('section#redeem').find('h5#ecopoints').html(data.ecoPoints);
                }
            },
            complete: function() {
                setTimeout(function () {
                    worker();
                }, 1800000);
            }
        });
    }
})();

/* footer year */
$('footer .year').html((new Date()).getFullYear());

/* sign up animation */
$('#signUpCard .card-header a[href="#user"]').on('show.bs.tab', function() {
    $('#signUpCard #user').removeClass('fadeIn');
    $('#signUpCard #user').addClass('fadeIn').one($animationEnd, function() {
        $('#signUpCard #user').removeClass('fadeIn');
    })
});

$('#signUpCard .card-header a[href="#organization"]').on('show.bs.tab', function() {
    $('#signUpCard #organization').removeClass('fadeIn');
    $('#signUpCard #organization').addClass('fadeIn').one($animationEnd, function() {
        $('#signUpCard #organization').removeClass('fadeIn');
    })
});

/* enable or re-enable tooltips */
enableTooltip();
enableNavToolTip()
enableFabToolTip();

/* nav tooltips fix */
$(document).on('focus', 'nav [tooltip-toggle=tooltip]', function() {
    $(this).tooltip('hide');
});

/* mobile hamburger animation */
$('nav .navbar-toggler').click(function() {
    if ($('nav .navbar-toggler').hasClass('collapsed')) {
        $('nav .navbar-toggler .fa-bars').addClass('d-none');
        $('nav .navbar-toggler .fa-times').removeClass('d-none');
    }
    else {
        $('nav .navbar-toggler .fa-bars').removeClass('d-none');
        $('nav .navbar-toggler .fa-times').addClass('d-none');
    }
});

/* carousel */
$('.carousel').carousel({
    interval: 3500
});

/* mobile form tooltip fix */
if ($(window).width() < 767) {
    enableMobile_FormToolTip();
}
else {
    enableFormToolTip();
}

$(window).resize(function() {
    if ($(window).width() < 767) {
        enableMobile_FormToolTip();
    }
    else {
        enableFormToolTip();
    }
});

/* mobile lanscape / portrait fab tooltip fix */
if ($(window).height() < 565) {
    fabTooltip_mobileLandscape();
}
else {
    fabTooltip_mobilePortrait();
}

$(window).resize(function() {
    if ($(window).height() < 565) {
        fabTooltip_mobileLandscape();
        $('[toggle-tooltip=fab-tooltip]').tooltip('hide');

        if ($('#mProfileDropdown .dropdown-menu').hasClass('show')) {
            $('#mProfileDropdown #profileAction').dropdown('toggle');
        }
    }
    else {
        fabTooltip_mobilePortrait();
        $('[toggle-tooltip=fab-tooltip]').tooltip('hide');

        if ($('#mProfileDropdown .dropdown-menu').hasClass('show')) {
            $('#mProfileDropdown #profileAction').dropdown('toggle');
        }
    }
});

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
