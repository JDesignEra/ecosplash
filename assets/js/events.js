// TODO Join btn submit
'use strict';
var uid = (localStorage.getItem('uid') ? localStorage.getItem('uid') : sessionStorage.getItem('uid'));

var data = new FormData();
data.append('action', 'getUpcomingEvents');

httpPost('./assets/db/db.php', data, function(data) {
    console.log(data);  // Debugging Purpose
    if (data.success) {
        httpGet('./assets/templates/events/events_set.html', function(content) {
            var temp = doc.createElement('div'),
                focus = doc.querySelector('section#events .card-body .eventsContent');

            focus.innerHTML = '';
            temp.innerHTML = content;

            var i = 0;
            for (var date in data.events) {
                if (i != 0) {
                    var hr = doc.createElement('hr');
                    focus.appendChild(hr);
                }

                var h4Date = temp.querySelector('h4').cloneNode();
                h4Date.innerHTML = date;

                focus.appendChild(h4Date);

                for (var event in data.events[date]) {
                    var row = temp.querySelector('div.row').cloneNode(true),
                        cols = row.querySelectorAll('div.col-6');

                    cols[0].innerHTML = '<p><span class="font-weight-bold text-primary">' + data.events[date][event].event + '</span> at <span class="font-weight-bold text-primary">' + data.events[date][event].time + '</span> located at <span class="font-weight-bold text-primary">' + data.events[date][event].location + '</span></p>';

                    var btnFocus = cols[1].querySelector('button');
                    btnFocus.setAttribute('data-id', data.events[date][event].eid);

                    if (uid == 0) {
                        btnFocus.classList.remove('d-none');
                    }

                    focus.appendChild(row);
                    i++;
                }
            }
        });
    }
});
