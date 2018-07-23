securePage(1);
var uid = (localStorage.getItem('uid') ? localStorage.getItem('uid') : sessionStorage.getItem('uid'));
    eid = window.location.href.split('?')[1].split('=')[1];

var data = new FormData();
data.append('uid', (uid ? uid : ''));
data.append('eid', eid);
data.append('action', 'getEventCode');

httpPost('./assets/db/db.php', data, function(data) {
    // console.log(data);  // Debugging Purpose

    doc.querySelector('h1').innerHTML = data.eventCode.redeemCode;
    doc.querySelector('img').src = 'http://api.qrserver.com/v1/create-qr-code/?data=https://' + window.location.hostname + '/redeem_code/?redeem=' + data.eventCode.redeemCode + '&size=300x300';
});
