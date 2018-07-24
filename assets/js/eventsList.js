//TODO manual attendance check
'use strict';
var uid = uid = (localStorage.getItem('uid') ? localStorage.getItem('uid') : sessionStorage.getItem('uid')),
    sectionFocus = doc.querySelector('section#eventsList');

var data = new FormData();
data.append('uid', uid);
data.append('action', 'getEventsList');

// Populate table
httpPost('./assets/db/db.php', data, function(data) {
    // console.log(data);  // Debugging Purpose

    var focus = sectionFocus.querySelector('.card-body');

    httpGet('./assets/templates/events_list/events_table.html', function(content) {
        var temp = doc.createElement('div');
        temp.classList.add('table-responsive', 'mb-5');
        temp.innerHTML = content;

        for (var k in data.eventsList) {
            var table = temp.cloneNode(true);
            table.querySelector('h4').innerHTML = k;
            table.querySelector('tbody').innerHTML = '';

            var tbodyFocus = table.querySelector('tbody');
            data.eventsList[k].forEach(function(ev, ei) {
                var row = temp.querySelector('tbody tr').cloneNode(true),
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

            focus.appendChild(table);
        }
    });
});

// add new event btn
sectionFocus.querySelector('button#addNew').onclick = function() {
    this.classList.add('fadeOut', 'short');

    this.addEventListener(animationEnd, function() {
        this.classList.add('d-none');
        sectionFocus.querySelector('form#addEvent').classList.remove('d-none');
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
        console.log(data);  // Debugging Purpose
        var inputs = formFocus.querySelectorAll('.form-label-group');

        inputs.forEach(function(el) {
            el.classList.remove('invalid');
            el.classList.remove('valid');

            el.querySelector('.feedback').classList.add('d-none');
        });

        if (data.success) {
            window.location = './events_list';
        }
        else if (data.errors) {
            if (data.errors.date) {
                var focus = formFocus.querySelector('#date.form-label-group');
                focus.classList.add('invalid');

                focus =  focus.querySelector('.feedback');
                focus.innerHTML = data.errors.date;
                focus.classList.remove('d-none');
            }
            else {
                var focus = formFocus.querySelector('#date.form-label-group');
                focus.classList.add('valid');
            }

            if (data.errors.event) {
                var focus = formFocus.querySelector('#event.form-label-group');
                focus.classList.add('invalid');

                focus = formFocus.querySelector('#event .feedback');
                focus.innerHTML = data.errors.event;
                focus.classList.remove('d-none');
            }
            else {
                var focus = formFocus.querySelector('#event.form-label-group');
                focus.classList.add('valid');
            }

            if (data.errors.location) {
                var focus = formFocus.querySelector('#location.form-label-group');
                focus.classList.add('invalid');

                focus = formFocus.querySelector('#location .feedback');
                focus.innerHTML = data.errors.location;
                focus.classList.remove('d-none');
            }
            else {
                var focus = formFocus.querySelector('#location.form-label-group');
                focus.classList.add('valid');
            }

            if (data.errors.time) {
                var focus = formFocus.querySelector('#time.form-label-group');
                focus.classList.add('invalid');

                focus = formFocus.querySelector('#time .feedback');
                focus.innerHTML = data.errors.time;
                focus.classList.remove('d-none');
            }
            else {
                var focus = formFocus.querySelector('#time.form-label-group');
                focus.classList.add('valid');
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
