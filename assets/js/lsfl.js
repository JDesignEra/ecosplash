'use strict';
/* invoke forms onsubmit */
if (doc.querySelector('form#loginForm')) {
    loginForm('loginForm');
}

if (doc.querySelector('form#mLoginForm')) {
    loginForm('mLoginForm')
}

if (doc.querySelector('form#uSignupForm')) {
    signupForm('uSignupForm');
}

if (doc.querySelector('form#oSignupForm')) {
    signupForm('oSignupForm');
}

if (doc.querySelector('form#fpass_1')) {
    forgotPasswordForm('fpass_1');
}

if (doc.querySelector('form#fpass_2')) {
    forgotPasswordForm('fpass_2');
}

if (doc.querySelector('form#fpass_3')) {
    forgotPasswordForm('fpass_3');
}

/* sign up animation */
$('#signUpCard .card-header a[href="#user"]').on('show.bs.tab', function() {
    var focus = doc.querySelector('#signUpCard #user');
    focus.classList.remove('fadeIn');
    focus.classList.add('fadeIn');
});

$('#signUpCard .card-header a[href="#organization"]').on('show.bs.tab', function() {
    var focus = doc.querySelector('#signUpCard #organization');
    focus.classList.remove('fadeIn');
    focus.classList.add('fadeIn');
});

/* logout on click */
addWindowOnload(function() {
    if (doc.querySelector('.logout')) {
        var focus = doc.querySelectorAll('.logout');

        focus.forEach(function(el) {
            el.onclick = function(e) {
                e.preventDefault();

                if (localStorage) {
                    localStorage.clear();
                }

                if (sessionStorage) {
                    sessionStorage.clear();
                }

                $('#logoutModal').on('shown.bs.modal', function() {
                    doc.querySelector('#logoutModal button.btn[data-dismiss=modal]').focus();
                    setTimeout(function () {
                        $('#logoutModal').modal('hide');
                    }, 2500);
                });

                $('#logoutModal').on('hide.bs.modal', function() {
                    location.href = './';
                });

                $('#logoutModal').modal("show");
            }
        });
    }
});

/* login function */
function loginForm(formID) {
    doc.querySelector('form#' + formID).onsubmit = function(e) {
        e.preventDefault();

        var focus = this.querySelectorAll('.form-label-group');
        focus.forEach(function(el) {
            el.querySelector('input').classList.remove('is-invalid', 'is-valid');
            el.querySelector('.feedback').innerHTML = '';
        });

        var data = new FormData(this);
        data.append('action', 'login');

        if ((this.querySelector('input[name=remember]') && !this.querySelector('input[name=remember]').checked)) {
            data.append('remember', '');
        }

        httpPost('./assets/db/db.php', data, function(data) {
            // console.log(data); // Debugging Purpose
            if (data.success) {
                if (data.remember) {
                    localStorage.setItem('uid', data.uid);
                    localStorage.setItem('name', data.name);
                    localStorage.setItem('accType', data.type);
                    localStorage.setItem('pass', data.password);
                }
                else {
                    sessionStorage.setItem('uid', data.uid);
                    sessionStorage.setItem('name', data.name);
                    sessionStorage.setItem('accType', data.type);
                    sessionStorage.setItem('pass', data.password);
                }

                var modal = doc.getElementById('loginSuccessModal');
                modal.getElementsByClassName('name')[0].innerHTML = data.name;

                $(modal).on('shown.bs.modal', function() {
                    modal.querySelector('button.btn[data-dismiss=modal]').focus();
                    setTimeout(function () {
                        $(modal).modal('hide');
                    }, 2500);
                });

                $(modal).on('hide.bs.modal', function() {
                    location.href = './';
                });

                $(modal).modal("show");
            }
            else if (data.errors) {
                focus = doc.querySelector('#' + formID + ' #password');
                if (data.errors.password) {
                    focus.querySelector('input').classList.add('is-invalid');
                    focus.querySelector('.feedback').innerHTML = data.errors.password;
                }
                else {
                    focus.querySelector('input').classList.add('is-valid');
                }

                focus = doc.querySelector('#' + formID + ' #email');
                if (data.errors.email) {
                    focus.querySelector('input').classList.add('is-invalid');
                    focus.querySelector('.feedback').innerHTML = data.errors.email;
                }
                else {
                    focus.querySelector('input').classList.add('is-valid');
                }
            }
        });
    }
}

/* sign up function */
function signupForm(formID) {
    if (doc.querySelector('form#' + formID)) {
        doc.querySelector('form#' + formID).onsubmit = function(e) {
            e.preventDefault();

            focus = this.querySelectorAll('.form-label-group');
            focus.forEach(function(el) {
                el.querySelector('input').classList.remove('is-invalid', 'is-valid');
            });

            this.querySelector('button[type=submit] .signup-text').classList.add('d-none');
            this.querySelector('button[type=submit] .load-text').classList.remove('d-none');

            var data = new FormData(this);
            data.append('action', formID);

            httpPost('./assets/db/db.php', data, function(data) {
                // console.log(data); // Debugging Purpose
                focus = doc.querySelector('form#' + formID);
                focus.querySelector('button[type=submit] .signup-text').classList.remove('d-none');
                focus.querySelector('button[type=submit] .load-text').classList.add('d-none');

                if (data.success) {
                    var modal = doc.getElementById('signupModal');

                    $(modal).on('shown.bs.modal', function() {
                        modal.querySelector('button.btn[data-dismiss=modal]').focus();

                        setTimeout(function () {
                            $(modal).modal('hide');
                        }, 2500);
                    });

                    $(modal).on('hide.bs.modal', function() {
                        location.href = "./";
                    });

                    $(modal).modal("show");
                }
                else if (data.errors) {
                    var focus = doc.querySelector('form#' + formID + ' #password');
                    if (data.errors.password) {
                        focus.querySelector('input').classList.add('is-invalid');
                        focus.querySelector('.feedback').innerHTML = data.errors.password;
                    }
                    else {
                        focus.querySelector('input').classList.add('is-valid');
                    }

                    focus = doc.querySelector('#' + formID + ' #email');
                    if (data.errors.email) {
                        focus.querySelector('input').classList.add('is-invalid');
                        focus.querySelector('.feedback').innerHTML = data.errors.email;
                    }
                    else {
                        focus.querySelector('input').classList.add('is-valid');
                    }

                    focus = doc.querySelector('#' + formID + ' #name');
                    if (data.errors.name) {
                        focus.querySelector('input').classList.add('is-invalid');
                        focus.querySelector('.feedback').innerHTML = data.errors.name;
                    }
                    else {
                        focus.querySelector('input').classList.add('is-valid');
                    }
                }
            });
        }
    }
}

/* forgot password function */
function forgotPasswordForm(formID) {
    if (doc.querySelector('#' + formID)) {
        doc.querySelector('#' + formID).onsubmit = function(e) {
            e.preventDefault();

            focus = this.querySelectorAll('.form-label-group');
            focus.forEach(function(el) {
                el.querySelector('input').classList.remove('is-invalid', 'is-valid');
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

            httpPost('./assets/db/db.php', data, function(data) {
                // console.log(data);  // Debugging Purpose
                doc.querySelector('form#fpass_1 button[type=submit] .next-text').classList.remove('d-none');
                doc.querySelector('form#fpass_3 button[type=submit] .change-pass-text').classList.remove('d-none');

                if (formID == 'fpass_1' || formID == 'fpass_3') {
                    doc.querySelector('form#' + formID + ' button[type=submit] .load-text').classList.add('d-none');
                }

                if (data.success) {
                    if (formID == 'fpass_1') {
                        var fpass1 = doc.getElementById('fpass_1'),
                            fpass2 = doc.getElementById('fpass_2');

                        fpass1.classList.add('fadeOutLeft');
                        fpass1.addEventListener(animationEnd, function _func() {
                            fpass1.classList.add('d-none');
                            fpass1.classList.remove('fadeOutLeft');

                            fpass2.classList.add('fadeInRight', 'd-block');

                            fpass2.addEventListener(animationEnd, function _func() {
                                fpass2.classList.add('fadeInRight');
                                this.removeEventListener(animationEnd, _func);
                            });

                            this.removeEventListener(animationEnd, _func);
                        });
                    }
                    else if (formID == 'fpass_2') {
                        var fpass2 = doc.getElementById('fpass_2'),
                            fpass3 = doc.getElementById('fpass_3');

                        fpass2.classList.add('fadeOutLeft');
                        fpass2.addEventListener(animationEnd, function _func() {
                            fpass2.classList.add('d-none');
                            fpass2.classList.remove('fadeOutLeft', 'd-block');

                            fpass3.classList.add('fadeInRight', 'd-block');
                            fpass3.addEventListener(animationEnd, function _func() {
                                fpass3.classList.remove('fadeInRight');
                                this.removeEventListener(animationEnd, _func);
                            });

                            this.removeEventListener(animationEnd, _func);
                        });
                    }
                    else if (formID == 'fpass_3') {
                        var modal = doc.getElementById('fpassModal');

                        $(modal).on('shown.bs.modal', function() {
                            doc.querySelector('#fpassModal button.btn[data-dismiss=modal]').focus();
                            setTimeout(function () {
                                $(modal).modal('hide');
                            }, 2500);
                        });

                        $(modal).on('hide.bs.modal', function() {
                            location.href = './';
                        });

                        $(modal).modal("show");
                    }
                }
                else if (data.errors) {
                    focus = doc.querySelector('#fpass_1 #email');
                    if (data.errors.email && formID == 'fpass_1') {
                        focus.querySelector('input').classList.add('is-invalid');
                        focus.querySelector('.feedback').innerHTML = data.errors.email;
                    }
                    else {
                        focus.querySelector('input').classList.add('is-valid');
                    }

                    focus = doc.querySelector('#fpass_2 #fcode');
                    if (data.errors.fcode && formID == 'fpass_2') {
                        focus.querySelector('input').classList.add('is-invalid');
                        focus.querySelector('.feedback').innerHTML = data.errors.fcode;
                    }
                    else {
                        focus.querySelector('input').classList.add('is-valid');
                    }

                    focus = doc.querySelector('#fpass_3 #password');
                    if (data.errors.password && formID == 'fpass_3') {
                        focus.querySelector('input').classList.add('is-invalid');
                        focus.querySelector('.feedback').innerHTML = data.errors.password;
                    }
                    else {
                        focus.querySelector('input').classList.add('is-valid');
                    }

                    focus = doc.querySelector('#fpass_3 #cfmPassword');
                    if (data.errors.cfmPassword && formID == 'fpass_3') {
                        focus.querySelector('input').classList.add('is-invalid');
                        focus.querySelector('.feedback').innerHTML = data.errors.cfmPassword;
                    }
                }
            });
        }
    }
}
