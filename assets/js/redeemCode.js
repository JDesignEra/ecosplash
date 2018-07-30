'use strict';
securePage(0);

var sectionFocus = doc.querySelector('section#redeemCode'),
    uid = (localStorage.getItem('uid') ? localStorage.getItem('uid') : sessionStorage.getItem('uid')),
    redeemCode = (window.location.href.indexOf('?') != -1 ? window.location.href.split('?')[1].split('=')[1] : '');

if (redeemCode) {
    var data = new FormData();
    data.append('code', redeemCode);
    data.append('uid', (uid ? uid : ''));
    data.append('action, redeemEventCode');

    postRedeemCode(data);
}

doc.querySelector('form#redeemCode').onsubmit = function(e) {
    e.preventDefault();

    var data = new FormData(this);
    data.append('uid', (uid ? uid : ''));
    data.append('action', 'redeemEventCode');

    postRedeemCode(data);
}

function postRedeemCode(data) {
    httpPost('./assets/db/db.php', data, function(data) {
        // console.log(data);  // Debugging Purpose
        var formFocus = sectionFocus.querySelector('form#redeemCode'),
            focus = formFocus.querySelector('#code'),
            feedback = focus.querySelector('.feedback');

        focus.classList.remove('invalid', 'valid');
        feedback.classList.add('d-none');

        if (data.success) {
            var modal = doc.getElementById('redeemSuccessModal');

            $(modal).on('shown.bs.modal', function() {
                setTimeout(function () {
                    $(modal).modal('hide');
                }, 2500);
            });

            $(modal).on('hide.bs.modal', function() {
                location.href = './redeem_code';
            });

            $(modal).modal('show');
        }
        else if (data.errors) {
            if (data.errors.code) {
                focus.classList.add('invalid');

                feedback.innerHTML = data.errors.code;
                feedback.classList.remove('d-none');
            }
        }
    });
}