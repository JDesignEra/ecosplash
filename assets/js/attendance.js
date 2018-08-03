"user strict";
securePage(1);

/* populate attendance data */
var sectionFocus = doc.querySelector('section#attendance'),
    uid = (localStorage.getItem('uid') ? localStorage.getItem('uid') : sessionStorage.getItem('uid')),
    eid = eid = (window.location.href.indexOf('?') != -1 ? window.location.href.split('?')[1].split('=')[1] : '');

if (eid) {
    //window.history.replaceState({}, document.title, './attendance/');

    var data = new FormData();
    data.append('uid', (uid ? uid : ''));
    data.append('eid', (eid ? eid : ''));
    data.append('action', 'getAttendance');

    httpPost('./assets/db/db.php', data, function(data) {
        if (data.success) {
            httpGetDoc('./assets/templates/attendances/attendances.html', function(content) {
                var h5Focus = sectionFocus.querySelector('.eventDetails'),
                    table = content.querySelector('form#attendanceForm').cloneNode(true),
                    focus = sectionFocus.querySelector('#attendanceTable');

                h5Focus.querySelector('.event').innerHTML = data.event.name;
                h5Focus.querySelector('.date').innerHTML = data.event.date;
                h5Focus.querySelector('.time').innerHTML = data.event.time;
                h5Focus.querySelector('.location').innerHTML = data.event.location;

                if (data.attendances) {
                    table.querySelector('tbody').innerHTML = '';
                    focus.innerHTML = '';

                    for (var uid in data.attendances) {
                        var row = content.querySelector('tbody tr').cloneNode(true),
                            td = row.querySelectorAll('td');

                        td[0].innerHTML = data.attendances[uid].name;
                        td[1].innerHTML = data.attendances[uid].email;

                        var statusCheckBox = td[2].querySelector('input[type=checkbox]');
                        statusCheckBox.value = uid;

                        if (data.attendances[uid].status == 1) {
                            statusCheckBox.setAttribute('checked', true);
                            statusCheckBox.setAttribute('disabled', true);
                        }

                        table.querySelector('tbody').appendChild(row);
                    }

                    focus.appendChild(table);

                    /* attendance form submit */
                    doc.querySelector('form#attendanceForm').onsubmit = function(e) {
                        e.preventDefault();

                        var data = new FormData(this);
                        data.append('uid', (uid ? uid : ''));
                        data.append('eid', (eid ? eid : ''));
                        data.append('action', 'updateAttendance');

                        httpPost('./assets/db/db.php', data, function(data) {
                            console.log(data);  // Debugging Purpose

                            if (data.success) {
                                var modal = doc.getElementById('successModal');

                                $(modal).on('shown.bs.modal', function() {
                                    modal.querySelector('button.btn[data-dismiss=modal]').focus();
                                    setTimeout(function () {
                                        $(modal).modal('hide');
                                    }, 4000);
                                });

                                $(modal).on('hide.bs.modal', function() {
                                    location.href = './events_list';
                                });

                                $(modal).modal("show");
                            }
                            else if (data.errors) {
                                if (data.errors.status) {
                                    var modal = doc.getElementById('errorModal');

                                    $(modal).on('shown.bs.modal', function() {
                                        modal.querySelector('button.btn[data-dismiss=modal]').focus();
                                        setTimeout(function () {
                                            $(modal).modal('hide');
                                        }, 4000);
                                    });

                                    $(modal).modal("show");
                                }
                            }
                        });
                    }
                }
            });
        }
    });
}
else {
    window.location = './events_list';
}
