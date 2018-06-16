/* scrolling nav */
$OFFSET_TOP = 0.5;
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

/* nav active state */
$activeURL = $(location).attr('href').split('/');
$activeURL = $activeURL[$activeURL.length - 2];
$focus = $('nav .navbar-nav');

switch ($activeURL) {
    case 'localhost':
    case $('base').attr('href').substr(1, $('base').attr('href').length - 2):
        $focus.find('a.nav-link[href="./"]').parent().addClass('active');
        break;
}

/* animation end fix */
$animationEnd = (function(el) {
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
    $focus = '#fixed-action #mProfileDropdown button[tooltip-toggle=fabp-tooltip]';
    $($focus + ' .fa-user-circle').addClass('d-none');
    $($focus + ' .fa-times').removeClass('d-none');
    $('#mProfileDropdown > button[tooltip-toggle=fab-tooltip]').tooltip('show');

    $('#mProfileDropdown .dropdown-menu .btn').each(function() {
        $(this).addClass('slideInUp short').one($animationEnd, function() {
            $(this).tooltip('show');
            $(this).removeClass('slideInUp short');
        });
    });
});

$('#fixed-action').on('hide.bs.dropdown', '#mProfileDropdown', function(e) {
    $($focus + ' .fa-user-circle').removeClass('d-none');
    $($focus + ' .fa-times').addClass('d-none');
    $('#mProfileDropdown > button[tooltip-toggle=fab-tooltip]').tooltip('hide');

    $('#mProfileDropdown .dropdown-menu .btn').each(function() {
        $(this).tooltip('hide');
    });
});

/* periodic worker */
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
                        $('#fixed-action #mProfileDropdown .dropdown-menu .ecopoints').attr('title', (data.ecoPoints + ' EcoPoints'));
                        $('#fixed-action #mProfileDropdown .dropdown-menu .notifications').attr('title', ('Notifications (' + data.newNotifications + ')'));
                    }, 500);
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

/* enable tooltips */
$(function () {
    $('[tooltip-toggle="tooltip"]').tooltip({
        delay: {
            'show': 150,
            'hide': 50,
        }
    });
});

$(function () {
    $('[tooltip-toggle="nav-tooltip"]').tooltip({
        delay: {
            'show': 150,
            'hide': 50
        },
        trigger: 'hover'
    });
});

$(function () {
    $('[tooltip-toggle="form-tooltip"]').tooltip({
        template: '<div class="tooltip form-tooltip" role="tooltip"><div class="arrow"></div><div class="tooltip-inner"></div></div>',
        offset: '0, 10'
    });
});

$(function () {
    $('[tooltip-toggle="fab-tooltip"]').tooltip({
        template: '<div class="tooltip d-block d-md-none d-lg-none d-xl-none" role="tooltip"><div class="arrow"></div><div class="tooltip-inner"></div></div>',
        offset: '0, 5',
        trigger: 'manual'
    });
});

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
