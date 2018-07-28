'use strict';
// Status, 0 = Pending Request, 1 = Friends

var uid = (localStorage.getItem('uid') ? localStorage.getItem('uid') : sessionStorage.getItem('uid'));

/* get friends */
var friends = {},
        friendsStatus,
        data = new FormData();

data.append('uid', uid);
data.append('action', 'getFriends');

httpPost('./assets/db/db.php', data, function(data) {
    // console.log(data);  // Debugging Purpose
    if (data.success) {
        if (data.friends) {
            httpGetDoc('./assets/templates/friends/friends_row.html', function(content) {
                var friendsRow,
                    friendsCount = 0,
                    requestRow,
                    requestCount = 0;

                    // Friends tab empty
                    if (data.friends.status.indexOf('1') != -1) {
                        doc.querySelector('#friends').innerHTML = '';
                    }

                    // Request tab empty
                    if (data.friends.status.indexOf('0') != -1) {
                        doc.querySelector('#requests').innerHTML = '';
                    }

                    data.friends.fid.forEach(function(fv, fi) {
                        friends[fv] = data.friends.status[fi];

                        /* Friends tab */
                        if (friendsCount % 3 == 0 && data.friends.status[fi] == 1) {
                            friendsRow = content.getElementsByClassName('row')[0].cloneNode();
                        }

                        if ((friendsCount != 0 && friendsCount % 4 == 0) || (friendsRow && fi == data.friends.fid.length - 1)) {
                            doc.getElementById('friends').appendChild(friendsRow);
                        }

                        if (data.friends.status[fi] == 1) {
                            friendsCount++;

                            var friendsCol = content.getElementsByClassName('card')[0].cloneNode(true);
                            friendsCol.id = data.friends.fid[fi];

                            friendsCol.querySelector('h5.name').innerHTML = data.friends.name[fi];
                            friendsCol.querySelector('h5.ecopoints').innerHTML = data.friends.ecoPoints[fi];

                            if (data.friends.bio[fi]) {
                                friendsCol.querySelector('p.bio').innerHTML = data.friends.bio[fi];
                            }

                            var btnFocus = friendsCol.querySelector('button');
                            btnFocus.classList.add('btn-outline-danger', 'unfollow');
                            btnFocus.innerHTML = 'Unfollow';

                            friendsRow.appendChild(friendsCol);
                        }

                        /* requests tab */
                        if (requestCount % 3 == 0 && data.friends.status[fi] == 0) {
                            requestRow = content.getElementsByClassName('row')[0].cloneNode();
                        }

                        if ((requestCount != 0 && requestCount % 4 == 0) || (requestRow && fi == data.friends.fid.length - 1)) {
                            doc.getElementById('requests').appendChild(requestRow);
                        }

                        if (data.friends.status[fi] == 0) {
                            requestCount++;

                            var requestCol = content.getElementsByClassName('card')[0].cloneNode(true);
                            requestCol.id = data.friends.fid[fi];

                            requestCol.querySelector('h5.name').innerHTML = data.friends.name[fi];
                            requestCol.querySelector('h5.ecopoints').innerHTML = data.friends.ecoPoints[fi];

                            if (data.friends.rr_status[fi] == 'request') {
                                var btnFocus = requestCol.querySelector('button');
                                btnFocus.classList.add('btn-outline-danger', 'cancelRequest');
                                btnFocus.innerHTML = 'Cancel Follow Request';
                            }

                            if (data.friends.rr_status[fi] == 'response') {
                                var addBtn = requestCol.querySelector('button').cloneNode();
                                addBtn.classList.add('btn-outline-danger', 'declineFollow');
                                addBtn.innerHTML = 'Decline Friend Request';

                                requestCol.getElementsByClassName('card-footer')[0].appendChild(addBtn);

                                var btnFocus = requestCol.querySelector('button');
                                btnFocus.classList.add('btn-success', 'acceptFollow');
                                btnFocus.innerHTML = 'Accept Follow Request';
                            }

                            requestRow.appendChild(requestCol);
                        }
                    });
            });
        }
    }
});

/* get all users */
addWindowOnload(function() {
    var data = new FormData();
    data.append('action', 'getAllUsers');

    httpPost('./assets/db/db.php', data, function(data) {
        // console.log(data);  // Debugging Purpose

        if (data.success) {
            doc.querySelector('#all').innerHTML = '';

            httpGetDoc('./assets/templates/friends/friends_row.html', function(content) {
                var row;

                data.users.forEach(function(uv, ui) {
                    var col = content.getElementsByClassName('card')[0].cloneNode(true),
                        btnFocus = col.querySelector('button');

                    col.id = uv.uid;
                    col.querySelector('h5.name').innerHTML = uv.name;
                    col.querySelector('h5.ecopoints').innerHTML = uv.ecoPoints;

                    if (friends.hasOwnProperty(uv.uid)) {
                        if (friends[uv.uid] == 0) {
                            var addBtn = col.querySelector('button').cloneNode();
                            addBtn.classList.add('btn-success', 'cancelRequest');
                            addBtn.innerHTML = 'Cancel Follow Request';
                            col.getElementsByClassName('card-footer')[0].appendChild(addBtn);

                            btnFocus.classList.add('btn-outline-danger', 'declineFollow');
                            btnFocus.innerHTML = 'Decline Friend Request';
                        }
                        else if (friends[uv.uid] == 1) {
                            btnFocus.classList.add('btn-outline-danger', 'unfollow');
                            btnFocus.innerHTML = 'Unfollow';
                        }
                    }
                    else {
                        btnFocus.classList.add('btn-success', 'follow');
                        btnFocus.innerHTML = 'Follow'
                    }

                    if (ui % 3 == 0) {
                        row = content.getElementsByClassName('row')[0].cloneNode();
                    }

                    if ((ui != 0 && ui % 4 == 0) || ui == data.users.length - 1) {
                        doc.getElementById('all').appendChild(row);
                    }

                    row.appendChild(col);
                });
            });
        }
    });
});
