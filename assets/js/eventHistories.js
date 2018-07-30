'use strict';
securePage(0);

var uid = (localStorage.getItem('uid') ? localStorage.getItem('uid') : sessionStorage.getItem('uid')),
    sectionFocus = doc.querySelector('section#eventHistories');

/* get user event histories */
var data = new FormData();
data.append('uid', uid)
data.append('action', 'getEventHistories');

httpPost('./assets/db/db.php', data, function(data) {
    if (data.success) {
        // console.log(data); // Debugging Purpose
        httpGetDoc('./assets/templates/event_histories/event_histories.html', function(content) {
            var focus = sectionFocus.querySelector('#event-history-table');
            focus.innerHTML = content.querySelector('body').innerHTML;
            focus.querySelector('tbody').innerHTML = '';

            for (var i in data.event_histories) {
                var row = content.querySelector('tbody tr').cloneNode(true);

                var td = row.querySelectorAll('td');
                td[0].innerHTML = data.event_histories[i]['eid'];
                td[1].innerHTML = data.event_histories[i]['date'];
                td[2].innerHTML = data.event_histories[i]['event'];
                td[3].innerHTML = data.event_histories[i]['status'];

                // view more button
                var btnFocus = row.querySelector('button');
                btnFocus.setAttribute('data-id', data.event_histories[i]['eid']);

                btnFocus.onclick = function() {
                    var eid = this.getAttribute('data-id'),
                        data = new FormData();

                    data.append('uid', uid);
                    data.append('eid', eid);
                    data.append('action', 'getEventHistory');

                    httpPost('./assets/db/db.php', data, function(data) {
                        // console.log(data);  // Debugging Purpose
                        if (data.success) {
                            httpGetDoc('./assets/templates/event_histories/event_history.html', function(content) {
                                var modal = doc.getElementById('view-more-modal');
                                modal.querySelector('.modal-body').innerHTML = content.querySelector('body').innerHTML;
                                modal.querySelector('.modal-header .modal-title').innerHTML = 'Event #' + data.eid + ' Joined On ' + data.joinDate;

                                var td = modal.querySelectorAll('tbody tr td');
                                td[0].innerHTML = data.event;
                                td[1].innerHTML = data.date;
                                td[2].innerHTML = data.time;
                                td[3].innerHTML = data.ecoPoints;
                                td[4].innerHTML = data.status;
                            });

                            $('[tooltip-toggle=tooltip]').tooltip('hide');
                            $('#view-more-modal').modal('show');
                        }
                    });
                }

                focus.querySelector('tbody').appendChild(row);
            }

            enableTooltip();
        });
    }
});
