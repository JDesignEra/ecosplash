'use strict';
var focus;

loginForm('loginForm');
loginForm('mLoginForm')
signupForm('uSignupForm');
signupForm('oSignupForm');
forgotPasswordForm('fpass_1');
forgotPasswordForm('fpass_2');
forgotPasswordForm('fpass_3');

/* sign up animation */
$('#signUpCard .card-header a[href="#user"]').on('show.bs.tab', function() {
    focus = doc.querySelector('#signUpCard #user');
    focus.classList.remove('fadeIn');
    focus.classList.add('fadeIn');
});

$('#signUpCard .card-header a[href="#organization"]').on('show.bs.tab', function() {
    focus = doc.querySelector('#signUpCard #organization');
    focus.classList.remove('fadeIn');
    focus.classList.add('fadeIn');
});

/* logout on click */
window.onload = function() {
    if (doc.getElementById('logout') != null) {
        doc.getElementById('logout').onclick = function(e) {
            e.preventDefault();
            if (localStorage.getItem('accType')) {
                localStorage.clear();
            }
            else {
                sessionStorage.clear();
            }

            $('#logoutModal').on('shown.bs.modal', function() {
                doc.querySelector('#logoutModal button.btn-outline-danger[data-dismiss=modal]').focus();
                setTimeout(function () {
                    $('#logoutModal').modal('hide');
                }, 2000);
            });

            $('#logoutModal').on('hide.bs.modal', function() {
                location.href = './';
            });

            $('#logoutModal').modal("show");
        };
    }
}

/* login */
function loginForm(formID) {
    doc.querySelector('form#' + formID).onsubmit = function(e) {
        e.preventDefault();

        focus = this.querySelectorAll('.form-label-group');
        focus.forEach(function(el) {
            el.classList.remove('invalid');
            el.classList.remove('valid');
        });

        focus = this.querySelectorAll('.form-label-group .feedback');
        focus.forEach(function(el) {
            el.innerHTML = '';
        });

        var data = new FormData(this);
        data.append('action', 'login');
        if (!this.querySelector('#remember').checked) {
            data.append('remember', '');
        }

        $.ajax({
            type: 'POST',
            url: 'assets/db/db.php',
            data: data,
            dataType: 'json',
            processData: false,
            contentType: false
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

                var modal = doc.getElementById('loginSuccessModal');
                modal.getElementsByClassName('name')[0].innerHTML = data.name;

                $(modal).on('shown.bs.modal', function() {
                    modal.querySelector('button[data-dismiss=modal]').focus();
                    setTimeout(function () {
                        $(modal).modal('hide');
                    }, 2000);
                });

                $(modal).on('hide.bs.modal', function() {
                    location.href = './';
                });

                $(modal).modal("show");
            }
            else if (data.errors) {
                focus = doc.querySelector('#' + formID + ' #password');
                if (data.errors.password) {
                    focus.classList.add('invalid');
                    focus.getElementsByClassName('feedback')[0].innerHTML = data.errors.password;
                }
                else {
                    focus.classList.remove('valid');
                }

                focus = doc.querySelector('#' + formID + ' #email');
                if (data.errors.email) {
                    focus.classList.add('invalid');
                    focus.getElementsByClassName('feedback')[0].innerHTML = data.errors.email;
                }
                else {
                    focus.classList.add('valid');
                }
            }
        });
    };
}

/* sign up */
function signupForm(formID) {
    if (doc.querySelector('form#' + formID) != null) {
        doc.querySelector('form#' + formID).onsubmit = function(e) {
            e.preventDefault();

            focus = this.querySelectorAll('.form-label-group');
            focus.forEach(function(el) {
                el.classList.remove('invalid');
                el.classList.remove('valid');
            });

            focus = this.querySelectorAll('.form-label-group .feedback');
            focus.forEach(function(el) {
                el.innerHTML = '';
            });

            this.querySelector('button[type=submit] .signup-text').classList.add('d-none');
            this.querySelector('button[type=submit] .load-text').classList.remove('d-none');

            var data = new FormData(this);
            data.append('action', formID);

            $.ajax({
                type: 'POST',
                url: 'assets/db/db.php',
                data: data,
                dataType: 'json',
                processData: false,
                contentType: false
            })
            .done(function(data) {
                // console.log(data); // Debugging Purpose
                focus = doc.querySelector('form#' + formID);
                focus.querySelector('button[type=submit] .signup-text').classList.remove('d-none');
                focus.querySelector('button[type=submit] .load-text').classList.add('d-none');

                if (data.success) {
                    var modal = doc.getElementById('signupModal');

                    $(modal).on('shown.bs.modal', function() {
                        modal.querySelector('button[data-dismiss=modal]').focus();

                        setTimeout(function () {
                            $(modal).modal('hide');
                        }, 2000);
                    });

                    $(modal).on('hide.bs.modal', function() {
                        location.href = "./";
                    });

                    $(modal).modal("show");
                }
                else if (data.errors) {
                    var focus = doc.querySelector('form#' + formID + ' #password');
                    if (data.errors.password) {
                        focus.classList.add('invalid');
                        focus.getElementsByClassName('feedback')[0].innerHTML = data.errors.password;
                    }
                    else {
                        focus.classList.add('valid');
                    }

                    focus = doc.querySelector('#' + formID + ' #email');
                    if (data.errors.email) {
                        focus.classList.add('invalid');
                        focus.getElementsByClassName('feedback')[0].innerHTML = data.errors.email;
                    }
                    else {
                        focus.classList.add('valid');
                    }

                    focus = doc.querySelector('#' + formID + ' #name');
                    if (data.errors.name) {
                        focus.classList.add('invalid');
                        focus.getElementsByClassName('feedback')[0].innerHTML = data.errors.name;
                    }
                    else {
                        focus.classList.add('valid');
                    }
                }
            });
        };
    }
}

/* forgot password */
function forgotPasswordForm(formID) {
    if (doc.querySelector('#' + formID) != null) {
        doc.querySelector('#' + formID).onsubmit = function(e) {
            e.preventDefault();

            focus = this.querySelectorAll('.form-label-group');
            focus.forEach(function(el) {
                el.classList.remove('invalid');
                el.classList.remove('valid');
            });

            focus = this.querySelectorAll('.form-label-group .feedback');
            focus.forEach(function(el) {
                el.innerHTML = '';
            });

            if (formID == 'fpass_1') {
                this.querySelector('button[type=submit] .next-text').classList.add('d-none');
                this.querySelector('button[type=submit] .load-text').classList.remove('d-none');
            }

            if (formID == 'fpass_3') {
                this.querySelector('button[type=submit] .change-pass-text').classList.add('d-none');
                this.querySelector('button[type=submit] .load-text').classList.remove('d-none');
            }

            var data = new FormData(this);
            data.append('action', formID);

            if (formID == 'fpass_2') {
                data.append('email', doc.querySelector('#fpass_1 input[name=email]').value);
            }
            else if (formID == 'fpass_3') {
                data.append('email', doc.querySelector('#fpass_1 input[name=email]').value);
                data.append('fcode', doc.querySelector('#fpass_2 input[name=fcode]').value);
            }

            $.ajax({
                type: 'POST',
                url: 'assets/db/db.php',
                data: data,
                dataType: 'json',
                processData: false,
                contentType: false
            })
            .done(function(data) {
                console.log(data);  // Debugging Purpose
                doc.querySelector('form#fpass_1 button[type=submit] .next-text').classList.remove('d-none');
                doc.querySelector('form#fpass_3 button[type=submit] .change-pass-text').classList.remove('d-none');

                if (formID == 'fpass_1' || formID == 'fpass_3') {
                    doc.querySelector('form#' + formID + ' button[type=submit] .load-text').classList.add('d-none');
                }

                if (data.success) {
                    if (formID == 'fpass_1') {
                        $('#' + formID).addClass('fadeOutLeft').one($animationEnd, function() {
                            doc.querySelector('#' + formID).classList.add('d-none');
                            doc.querySelector('#' + formID).classList.remove('fadeOutLeft');

                            $('#fpass_2').addClass('fadeInRight d-block').one($animationEnd, function() {
                                doc.getElementById('fpass_2').classList.add('fadeInRight');
                            });
                        });
                    }
                    else if (formID == 'fpass_2') {
                        $('#' + formID).addClass('fadeOutLeft').one($animationEnd, function() {
                            doc.querySelector('#' + formID).classList.add('d-none');
                            doc.querySelector('#' + formID).classList.remove('fadeOutLeft', 'd-block');

                            $('#fpass_3').addClass('fadeInRight d-block').one($animationEnd, function() {
                                doc.getElementById('fpass_3').classList.remove('fadeInRight');
                            });
                        });
                    }
                    else if (formID == 'fpass_3') {
                        var modal = doc.getElementById('fpassModal');

                        setTimeout(function () {
                            $(modal).modal('hide');
                        }, 2000);

                        $(modal).on('hide.bs.modal', function() {
                            location.href = "./";
                        });

                        $(modal).modal('show');
                    }
                }
                else if (data.errors) {
                    focus = doc.querySelector('#fpass_1 #email');
                    if (data.errors.email) {
                        focus.classList.add('invalid');
                        focus.getElementsByClassName('feedback')[0].innerHTML = data.errors.email;
                    }
                    else {
                        focus.classList.add('valid');
                    }

                    focus = doc.querySelector('#fpass_2 #fcode');
                    if (data.errors.fcode) {
                        focus.classList.add('invalid');
                        focus.getElementsByClassName('feedback')[0].innerHTML = data.errors.fcode;
                    }
                    else {
                        focus.classList.remove('valid');
                    }

                    focus = doc.querySelector('#fpass_3 #password');
                    if (data.errors.password) {
                        focus.classList.add('invalid');
                        focus.getElementsByClassName('feedback')[0].innerHTML = data.errors.password;
                    }
                    else {
                        focus.classList.add('valid');
                    }

                    focus = doc.querySelector('#fpass_3 #cfmPassword');
                    if (data.errors.cfmPassword) {
                        focus.classList.add('invalid');
                        focus.getElementsByClassName('feedback')[0].innerHTML = data.errors.cfmPassword;
                    }
                }
            });
        };
    }
}
