'use strict';

var uid = (localStorage.getItem('uid') ? localStorage.getItem('uid') : sessionStorage.getItem('uid'));

var data = new FormData();
data.append('uid', uid);
data.append('action', 'getFriends');

httpPost('./assets/db/db.php', data, function(data) {
    console.log(data);  // Debugging Purpose
    if (data.success) {
        if (data.friends) {
            doc.getElementById('friends').innerHTML = '';

            httpGet('./assets/templates/friends/friends_row.html', function(content) {
                var row,
                temp = doc.createElement('div');
                temp.innerHTML = content;

                data.friends.fid.forEach(function(fv, fi) {
                    if (fi % 3 == 0) {
                        row = doc.createElement('div');
                        row.className = 'row';
                    }

                    if (fi != 0 && fi % 4 == 0 || fi == data.friends.fid.length - 1) {
                        doc.getElementById('friends').appendChild(row);
                    }

                    var col = doc.createElement('div');
                    col.classList.add('col-12', 'col-md-3');
                    col.innerHTML = temp.querySelector('div.col-12.col-md-3').innerHTML;

                    col.querySelector('h5.name').innerHTML = data.friends.name[fi];
                    col.querySelector('h5.ecopoints').innerHTML = data.friends.ecoPoints[fi];

                    var buttonFocus = col.querySelector('button');

                    if (data.friends.status[fi] == 0 && data.friends.rr_status[fi] == 'request') {
                        buttonFocus.classList.add('btn-outline-danger');
                        buttonFocus.innerHTML = 'Cancel Pending Follow Request';
                        buttonFocus.id = 'cancelPending'
                    }
                    else if (data.friends.status[fi] == 0 && data.friends.rr_status[fi] == 'response') {
                        buttonFocus.classList.add('btn-success');
                        buttonFocus.innerHTML = 'Accept Follow Request';
                        buttonFocus.id = 'acceptRequest';

                        var addBtn = col.querySelector('button').cloneNode();
                        addBtn.classList.add('btn-outline-danger');
                        addBtn.innerHTML = 'Decline Follow Request';
                        addBtn.id = 'declineRequest';

                        col.getElementsByClassName('card-body')[0].appendChild(addBtn);
                    }

                    row.appendChild(col);
                });
            });
        }
    }
});
