'use strict';

loginForm('loginForm');
loginForm('mLoginForm')
signupForm('uSignupForm');
signupForm('oSignupForm');
forgotPasswordForm('fpass_1');
forgotPasswordForm('fpass_2');
forgotPasswordForm('fpass_3');

/* logout */
$(document).on('click', '#logout', function(e) {
    e.preventDefault();

    if (localStorage.getItem('accType')) {
        localStorage.clear();
    }
    else {
        sessionStorage.clear();
    }

    var $modal = $('#logoutModal');

    $modal.on('shown.bs.modal', function() {
        $modal.find('button[data-dismiss=modal]').focus();
        setTimeout(function () {
            $modal.modal('hide');
        }, 2000);
    });

    $modal.on('hide.bs.modal', function() {
        location.href = './';
    });

    $modal.modal("show");
});

/* login */
function loginForm($formID) {
    $('form#' + $formID).submit(function(e) {
        e.preventDefault();

        $(this).find(".form-label-group .feedback").empty();
        $(this).find(".form-label-group").removeClass("invalid");
        $(this).find(".form-label-group").removeClass("valid");

        var $data;
        if (!$(this).find('#remember').is(':checked')) {
            $data = $(this).serialize() + '&remember=&action=login';
        }
        else {
            $data = $(this).serialize() + '&action=login';
        }

        $.ajax({
            type: 'POST',
            url: 'assets/db/db.php',
            data: $data,
            dataType: 'json',
            error: function(data) {
                console.log(data);
            }
        })
        .done(function(data) {
            // console.log(data); // Debugging Purpose
            if (data.success) {
                if (data.remember) {
                    localStorage.setItem('uid', data.uid);
                    localStorage.setItem('name', data.name);
                    localStorage.setItem('accType', data.accType);
                }
                else {
                    sessionStorage.setItem('uid', data.uid);
                    sessionStorage.setItem('name', data.name);
                    sessionStorage.setItem('accType', data.accType);
                }

                var $modal = $('#loginSuccessModal');
                $modal.find('.name').html(data.name);

                $modal.on('shown.bs.modal', function() {
                    $modal.find('button[data-dismiss=modal]').focus();
                    setTimeout(function () {
                        $modal.modal('hide');
                    }, 2000);
                });

                $modal.on('hide.bs.modal', function() {
                    location.href = './';
                });

                $modal.modal("show");
            }
            else if (data.errors) {
                var $focus = $('#' + $formID + ' #password');
                if (data.errors.password) {
                    $focus.addClass('invalid');
                    $focus.find('.feedback').html(data.errors.password);
                }
                else {
                    $focus.addClass('valid');
                }

                $focus = $('#' + $formID + ' #email');
                if (data.errors.email) {
                    $focus.addClass('invalid');
                    $focus.find('.feedback').html(data.errors.email);
                }
                else {
                    $focus.addClass('valid');
                }
            }
        });
    });
}

/* sign up */
function signupForm($formID) {
    $('form#' + $formID).submit(function(e) {
        e.preventDefault();

        $(this).find('.form-label-group .feedback').empty();
        $(this).find('.form-label-group').removeClass("invalid");
        $(this).find('.form-label-group').removeClass("valid");
        $(this).find('button[type=submit] .signup-text').addClass('d-none');
        $(this).find('button[type=submit] .load-text').removeClass('d-none');

        $.ajax({
            type: 'POST',
            url: 'assets/db/db.php',
            data: $(this).serialize() + '&action=' + $formID,
            dataType: 'json'
        })
        .done(function(data) {
            // console.log(data); // Debugging Purpose
            $('form#' + $formID).find('button[type=submit] .signup-text').removeClass('d-none');
            $('form#' + $formID).find('button[type=submit] .load-text').addClass('d-none');

            if (data.success) {
                var $modal = $('#signupModal');

                $modal.on('shown.bs.modal', function() {
                    $modal.find('button[data-dimiss=modal]').focus();

                    setTimeout(function () {
                        $modal.modal('hide');
                    }, 2000);
                });

                $modal.on('hide.bs.modal', function() {
                    location.href = "./";
                });

                $modal.modal("show");
            }
            else if (data.errors) {
                var $focus = $('#' + $formID + ' #password');
                if (data.errors.password) {
                    $focus.addClass('invalid');
                    $focus.find('.feedback').html(data.errors.password);
                }
                else {
                    $focus.addClass('valid');
                }

                $focus = $('#' + $formID + ' #email');
                if (data.errors.email) {
                    $focus.addClass('invalid');
                    $focus.find('.feedback').html(data.errors.email);
                }
                else {
                    $focus.addClass('valid');
                }

                $focus = $('#' + $formID + ' #name');
                if (data.errors.name) {
                    $focus.addClass('invalid');
                    $focus.find('.feedback').html(data.errors.name);
                }
                else {
                    $focus.addClass('valid');
                }
            }
        });
    });
}

/* forgot password */
function forgotPasswordForm($formID) {
    $('#' + $formID).submit(function(e) {
        e.preventDefault();

        $(this).find('.form-label-group .feedback').empty();
        $(this).find('.form-label-group').removeClass("invalid");
        $(this).find('.form-label-group').removeClass("valid");
        $(this).find('button[type=submit] .next-text').addClass('d-none');
        $(this).find('button[type=submit] .change-pass-text').addClass('d-none');
        $(this).find('button[type=submit] .load-text').removeClass('d-none');

        var $data = $(this).serialize() + '&action=' + $formID;
        if ($formID == 'fpass_2') {
            $data = $(this).serialize() + '&email=' + $('#fpass_1 input[name=email]').val() + '&action=' + $formID;
        }
        else if ($formID == 'fpass_3') {
            $data = $(this).serialize() + '&email=' + $('#fpass_1 input[name=email]').val() + '&fcode=' + $('#fpass_2 input[name=fcode]').val() + '&action=' + $formID;
        }

        $.ajax({
            type: 'POST',
            url: 'assets/db/db.php',
            data: $data,
            dataType: 'json'
        })
        .done(function(data) {
            // console.log(data); // Debugging Purpose
            $('form#fpass_1').find('button[type=submit] .next-text').removeClass('d-none');
            $('form#fpass_3').find('button[type=submit] .change-pass-text').removeClass('d-none');
            $('form#' + $formID).find('button[type=submit] .load-text').addClass('d-none');

            if (data.success) {
                if ($formID == 'fpass_1') {
                    $('#' + $formID).addClass('fadeOutLeft').one($animationEnd, function() {
                        $('#' + $formID).addClass('d-none');
                        $('#' + $formID).removeClass('fadeOutLeft');

                        $('#fpass_2').addClass('fadeInRight d-block').one($animationEnd, function() {
                            $('#fpass_2').removeClass('fadeInRight');
                        });
                    });
                }
                else if ($formID == 'fpass_2') {
                    $('#' + $formID).addClass('fadeOutLeft').one($animationEnd, function() {
                        $('#' + $formID).addClass('d-none');
                        $('#' + $formID).removeClass('fadeOutLeft d-block');

                        $('#fpass_3').addClass('fadeInRight d-block').one($animationEnd, function() {
                            $('#fpass_3').removeClass('fadeInRight');
                        });
                    });
                }
                else if ($formID == 'fpass_3') {
                    var $modal = $('#fpassModal');

                    $modal.on('shown.bs.modal', function() {
                        $modal.find('button[data-dimiss=modal]').focus();

                        setTimeout(function () {
                            $modal.modal('hide');
                        }, 2000);
                    });

                    $modal.on('hide.bs.modal', function() {
                        location.href = "./";
                    });

                    $modal.modal("show");
                }
            }
            else if (data.errors) {
                var $focus = $('#' + $formID + ' #email')
                if (data.errors.email) {
                    $focus.addClass('invalid');
                    $focus.find('.feedback').html(data.errors.email);
                }
                else {
                    $focus.addClass('valid');
                }

                $focus = $('#' + $formID + ' #fcode')
                if (data.errors.fcode) {
                    $focus.addClass('invalid');
                    $focus.find('.feedback').html(data.errors.fcode);
                }
                else {
                    $focus.addClass('valid');
                }

                $focus = $('#' + $formID + ' #password')
                if (data.errors.password) {
                    $focus.addClass('invalid');
                    $focus.find('.feedback').html(data.errors.password);
                }
                else {
                    $focus.addClass('valid');
                }

                $focus = $('#' + $formID + ' #cfmPassword')
                if (data.errors.cfmPassword) {
                    $focus.addClass('invalid');
                    $focus.find('.feedback').html(data.errors.cfmPassword);
                }
            }
        });
    });
}
