'use strict';
securePage(1);

var uid = uid = (localStorage.getItem('uid') ? localStorage.getItem('uid') : sessionStorage.getItem('uid')),
    sectionFocus = doc.querySelector('section#eventsList');

var data = new FormData();
data.append('uid', uid);
data.append('action', 'getEventsList');

/* populate table */
httpPost('./assets/db/db.php', data, function(data) {
    // console.log(data);  // Debugging Purpose
    var focus = sectionFocus.querySelector('.card-body');

    httpGetDoc('./assets/templates/events_list/events_table.html', function(content) {
        for (var k in data.eventsList) {
            var h4Date = content.querySelector('h4').cloneNode(),
                table = content.querySelector('table').cloneNode(true);

            h4Date.innerHTML = k;
            table.querySelector('tbody').innerHTML = '';

            var tbodyFocus = table.querySelector('tbody');
            data.eventsList[k].forEach(function(ev, ei) {
                var row = content.querySelector('tbody tr').cloneNode(true),
                    td = row.querySelectorAll('td');

                td[0].innerHTML = ev.event;
                td[1].innerHTML = ev.location;
                td[2].innerHTML = ev.time;
                td[3].innerHTML = ev.redeemCode;

                var btnFocus = td[4].querySelector('button');
                btnFocus.setAttribute('data-id', ev.eid);

                btnFocus.onclick = function() {
                    var eid = this.getAttribute('data-id');

                    $('#distributeModal').on('show.bs.modal', function() {
                        var btnFocus = this.querySelectorAll('.modal-footer a');

                        btnFocus.forEach(function(el) {
                            el.href = el.href + '?eid=' + eid;
                        });
                    });
                }

                tbodyFocus.appendChild(row);
            });

            focus.appendChild(h4Date);
            focus.appendChild(table);
        }
    });
});

// add new event btn
sectionFocus.querySelector('button#addNew').onclick = function() {
    this.classList.add('fadeOut', 'short');

    this.addEventListener(animationEnd, function _func() {
        this.classList.add('d-none');
        sectionFocus.querySelector('form#addEvent').classList.remove('d-none');

        this.removeEventListener(animationEnd, _func);
    });
}

// addEvent form submit
sectionFocus.querySelector('form#addEvent').onsubmit = function(e) {
    e.preventDefault();

    var formFocus = this,
        data = new FormData(formFocus);

    data.append('uid', uid);
    data.append('action', 'addEvent');

    httpPost('./assets/db/db.php', data, function(data) {
        // console.log(data);  // Debugging Purpose
        var focus = formFocus.querySelectorAll('.form-label-group');

        focus.forEach(function(el) {
            el.querySelector('input').classList.remove('is-invalid', 'is-valid');
        });

        if (data.success) {
            window.location = './events_list';
        }
        else if (data.errors) {
            focus = formFocus.querySelector('#date.form-label-group');
            if (data.errors.date) {
                focus.querySelector('input').classList.add('is-invalid');
                focus.querySelector('.feedback').innerHTML = data.errors.date;
            }
            else {
                focus.querySelector('input').classList.add('is-valid');
            }

            focus = formFocus.querySelector('#event.form-label-group');
            if (data.errors.event) {
                focus.querySelector('input').classList.add('is-invalid');
                focus.querySelector('.feedback').innerHTML = data.errors.event;
            }
            else {
                focus.querySelector('input').classList.add('is-valid');
            }

            focus = formFocus.querySelector('#location.form-label-group');
            if (data.errors.location) {
                focus.querySelector('input').classList.add('is-invalid');
                focus.querySelector('.feedback').innerHTML = data.errors.location;
            }
            else {
                focus.querySelector('input').classList.add('is-valid');
            }

            focus = formFocus.querySelector('#time.form-label-group');
            if (data.errors.time) {
                focus.querySelector('input').classList.add('is-invalid');
                focus.querySelector('.feedback').innerHTML = data.errors.time;
            }
            else {
                focus.querySelector('input').classList.add('is-valid');
            }
        }
    });
}

// enable datepicker
$(function() {
    $('#e-date').datetimepicker({
        format: 'L'
    });

    $('#e-time').datetimepicker({
        format: 'LT'
    });
});
