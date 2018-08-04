"user strict";
// Status: 0 = Pending Request, 1 = Friends
securePage(0, 1);

var uid = (localStorage.getItem('uid') ? localStorage.getItem('uid') : sessionStorage.getItem('uid'));

/* get friends */
var data = new FormData();

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
                            friendsCol.setAttribute('data-name', data.friends.name[fi]);
                            friendsCol.querySelector('h5.name').innerHTML = data.friends.name[fi];

                            if (data.friends.type[fi] == 0) {
                                friendsCol.querySelector('h5.ecopoints').innerHTML = data.friends.ecoPoints[fi];
                            }
                            else {
                                friendsCol.querySelector('#ePoints').remove();
                            }

                            if (data.friends.bio[fi]) {
                                friendsCol.querySelector('p.bio').innerHTML = data.friends.bio[fi];
                            }

                            var btnFocus = friendsCol.querySelector('button');
                            btnFocus.classList.add('btn-outline-danger');
                            btnFocus.setAttribute('data-id', data.friends.fid[fi]);
                            btnFocus.innerHTML = 'Unfollow';

                            /* unfollow btn onclick */
                            friendBtnOnClick(btnFocus, 'unfollowFriend', 'Unfollowed User', 'You have successfully unfollowed the user.');

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
                            requestCol.setAttribute('data-name', data.friends.name[fi]);
                            requestCol.querySelector('h5.name').innerHTML = data.friends.name[fi];

                            if (data.friends.type[fi] == 0) {
                                requestCol.querySelector('h5.ecopoints').innerHTML = data.friends.ecoPoints[fi];
                            }
                            else {
                                requestCol.querySelector('#ePoints').remove();
                            }

                            if (data.friends.rr_status[fi] == 'request') {
                                var btnFocus = requestCol.querySelector('button');
                                btnFocus.classList.add('btn-outline-danger');
                                btnFocus.setAttribute('data-id', data.friends.fid[fi]);
                                btnFocus.innerHTML = 'Cancel Follow Request';

                                /* cancel btn onclick */
                                friendBtnOnClick(btnFocus, 'cancelFollowFriend', 'Follow Request Cancelled', 'You have successfully canceled your follow request.');
                            }

                            if (data.friends.rr_status[fi] == 'response') {
                                var addBtn = requestCol.querySelector('button').cloneNode();
                                addBtn.classList.add('btn-outline-danger');
                                addBtn.setAttribute('data-id', data.friends.fid[fi]);
                                addBtn.innerHTML = 'Decline Follow Request';

                                /* decline btn onclick */
                                friendBtnOnClick(addBtn, 'cancelFollowFriend', 'Follow Request Cancel;ed', 'You have successfully canceled your follow request.');
                                requestCol.getElementsByClassName('card-footer')[0].appendChild(addBtn);

                                var btnFocus = requestCol.querySelector('button');
                                btnFocus.classList.add('btn-success');
                                btnFocus.setAttribute('data-id', data.friends.fid[fi]);
                                btnFocus.innerHTML = 'Accept Follow Request';

                                /* accept btn onclick */
                                friendBtnOnClick(btnFocus, 'acceptFollowFriend', 'Accepted Follow Request', 'You have successfully accepted the user follow request.');
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
    data.append('uid', (uid ? uid : ''));
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

                    btnFocus.setAttribute('data-id', uv.uid);

                    col.setAttribute('data-name', uv.name);
                    col.querySelector('h5.name').innerHTML = uv.name;
                    col.querySelector('p.bio').innerHTML = uv.bio;

                    if (uv.type == 0) {
                        col.querySelector('h5.ecopoints').innerHTML = uv.ecoPoints;
                    }
                    else {
                        col.querySelector('#ePoints').remove();
                    }

                    if (uv.status == 'request') {
                        btnFocus.classList.add('btn-danger');
                        btnFocus.innerHTML = 'Cancel Follow Request';

                        /* cancel btn onclick */
                        friendBtnOnClick(btnFocus, 'cancelFollowFriend', 'Follow Request Cancelled', 'You have successfully canceled your follow request.');
                    }
                    else if (uv.status == 'response') {
                        var addBtn = col.querySelector('button').cloneNode();
                        addBtn.classList.add('btn-outline-danger');
                        addBtn.innerHTML = 'Reject Follow Request';

                        /* reject btn onclick */
                        friendBtnOnClick(addBtn, 'rejectFollowFriend', 'Follow Request Rejected', 'You have successfully rejected the user follow request.');

                        col.getElementsByClassName('card-footer')[0].appendChild(addBtn);

                        btnFocus.classList.add('btn-success');
                        btnFocus.innerHTML = 'Accept Follow Request';

                        /* accept btn onclick */
                        friendBtnOnClick(btnFocus, 'acceptFollowFriend', 'Accepted Follow Request', 'You have successfully accepted the user follow request.');
                    }
                    else if (uv.status == 'followed') {
                        btnFocus.classList.add('btn-outline-danger');
                        btnFocus.innerHTML = 'Unfollow';

                        /* unfollow btn onclick */
                        friendBtnOnClick(btnFocus, 'unfollowFriend', 'Unfollowed User', 'You have successfully unfollowed the user.');
                    }
                    else {
                        btnFocus.classList.add('btn-secondary');
                        btnFocus.innerHTML = 'Follow';

                        /* follow btn onclick */
                        friendBtnOnClick(btnFocus, 'followFriend', 'Followed Request Send', 'Your follow request have been send.');
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

/* friends btn onclick function */
function friendBtnOnClick(btnTarget, action, modalHeader, modalBody) {
    btnTarget.onclick = function() {
        var data = new FormData();
        data.append('uid', (uid ? uid : ''));
        data.append('fuid', this.getAttribute('data-id'));
        data.append('action', action);

        httpPost('./assets/db/db.php', data, function(data) {
            // console.log(data);  // Debugging Purpose
            if (data.success) {
                var modal = doc.getElementById('feedbackModal');
                modal.querySelector('.modal-header h5.modal-title').innerHTML = modalHeader;
                modal.querySelector('.modal-body').innerHTML = modalBody;

                $(modal).on('shown.bs.modal', function() {
                    setTimeout(function () {
                        $(modal).modal('hide');
                    }, 4000);
                });

                $(modal).on('hide.bs.modal', function() {
                    location.href = './friends';
                });

                $(modal).modal('show');
            }
        });
    }
}

/* search btn */
doc.querySelector('button#search').onclick = function() {
    var cardsFocus = doc.querySelectorAll('.tab-content .card'),
        search = doc.querySelector('input#search').value;

    cardsFocus.forEach(function(el) {
        var name = el.getAttribute('data-name');

        if (name.indexOf(search) === -1) {
            el.classList.add('d-none');
        }
    });
}
