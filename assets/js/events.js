'use strict';
var uid = (localStorage.getItem('uid') ? localStorage.getItem('uid') : sessionStorage.getItem('uid')),
    accType = (localStorage.getItem('accType') ? localStorage.getItem('accType') : sessionStorage.getItem('accType'));

var data = new FormData();
data.append('uid', (uid ? uid : ''));
data.append('action', 'getUpcomingEvents');

httpPost('./assets/db/db.php', data, function(data) {
    // console.log(data);  // Debugging Purpose
    if (data.success) {
        httpGetDoc('./assets/templates/events/events_set.html', function(content) {
            var focus = doc.querySelector('section#events .card-body .eventsContent');

            focus.innerHTML = '';

            var i = 0;
            for (var date in data.events) {
                if (i != 0) {
                    var hr = doc.createElement('hr');
                    focus.appendChild(hr);
                }

                var h4Date = content.querySelector('h4').cloneNode();
                h4Date.innerHTML = date;

                focus.appendChild(h4Date);

                for (var event in data.events[date]) {
                    var row = content.querySelector('div.row').cloneNode(true),
                        cols = row.querySelectorAll('div.column');

                    cols[0].innerHTML = '<p><span class="font-weight-bold text-primary">' + data.events[date][event].event + '</span> at <span class="font-weight-bold text-primary">' + data.events[date][event].time + '</span> located at <span class="font-weight-bold text-primary">' + data.events[date][event].location + '</span></p>';

                    var eid = data.events[date][event].eid,
                        btnFocus = cols[1].querySelector('button');

                    btnFocus.setAttribute('data-id', data.events[date][event].eid);

                    if (accType == 0) {
                        btnFocus.classList.remove('d-none');

                        if (data.states && data.states[eid]) {
                            btnFocus.innerHTML = 'Joined';
                            btnFocus.classList.add('btn-danger');
                        }
                        else {
                            btnFocus.innerHTML = 'Join';
                            btnFocus.classList.add('btn-success');

                            /* join btn onclick */
                            btnFocus.onclick = function() {
                                var data = new FormData();
                                data.append('uid', uid);
                                data.append('eid', this.getAttribute('data-id'));
                                data.append('action', 'joinEvent');

                                httpPost('./assets/db/db.php', data, function(data) {
                                    //console.log(data);  // Debugging Purpose
                                    if (data.success) {
                                        var modal = doc.getElementById('successModal');

                                        $(modal).on('shown.bs.modal', function() {
                                            modal.querySelector('button.btn[data-dismiss=modal]').focus();
                                            setTimeout(function () {
                                                $(modal).modal('hide');
                                            }, 2500);
                                        });

                                        $(modal).on('hide.bs.modal', function() {
                                            location.href = './events';
                                        });

                                        $(modal).modal("show");
                                    }
                                });
                            }
                        }
                    }
                    else {
                        cols[0].classList.remove('col-8', 'col-md-10');
                        cols[0].classList.add('col-12');
                        cols[1].remove();
                    }

                    focus.appendChild(row);
                    i++;
                }
            }
        });
    }
});
