'use strict';
securePage(0);
var uid = (localStorage.getItem('uid') ? localStorage.getItem('uid') : sessionStorage.getItem('uid')),
    redeemCode = (window.location.href.indexOf('?') != -1 ? window.location.href.split('?')[1].split('=')[1] : '');

if (redeemCode) {
    var data = new FormData();
    data.append('code', redeemCode);
    data.append('uid', (uid ? uid : ''));
    data.append('action, redeemEventCode');

    postRedeemCode();
}

doc.querySelector('form#redeemCode').onclick = function(e) {
    e.preventDefault();

    var data = new FormData(this);
    data.append('uid', (uid ? uid : ''));
    data.append('action', 'redeemEventCode');

    postRedeemCode();
}

function postRedeemCode() {
    httpPost('./assets/db/db.php', data, function(data) {
        console.log(data);  // Debugging Purpose
    });
}
