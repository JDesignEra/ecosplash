// TODO Electric, water
// TODO Gas delete and delete all
'use strict';
securePage();

var sectionFocus = doc.querySelector('section#utilities'),
    uid = (localStorage.getItem('uid') ? localStorage.getItem('uid') : sessionStorage.getItem('uid')),
    eChart = document.getElementById('electricChart').getContext('2d'),
    wChart = document.getElementById('waterChart').getContext('2d'),
    gChart = document.getElementById('gasChart').getContext('2d'),
    eData = [],
    wData = [],
    gData = [],
    months = ['Janauary', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    h4Years = sectionFocus.querySelectorAll('.card-body h4 .year');

/* bill year */
h4Years.forEach(function(el) {
    el.innerHTML = new Date().getFullYear();
});

/* populate all select date options */
var selectFocus = sectionFocus.querySelectorAll('select[name=month]');
selectFocus.forEach(function(el) {
    months.forEach(function(v, i) {
        var option = doc.createElement('option');
        option.value = i;
        option.innerHTML = v;

        el.appendChild(option);
    });
});

/* populate charts & table data */
var data = new FormData();
data.append('uid', uid);
data.append('action', 'getUtilities');

httpPost('./assets/db/db.php', data, function(data) {
    // console.log(data);  // Debugging Purpose
    if (data.success) {
        eData = (data.electric ? data.electric.useAmounts : []),
        wData = (data.water ? data.water.useAmounts : []),
        gData = (data.gas ? data.gas.useAmounts : []);

        newChart(eChart, eData, 'KW/H Usage');

        if (data.electric) {
            httpGet('./assets/templates/utilities/electric-table.html', function(content) {
                sectionFocus.querySelector('#electric-table').innerHTML = content;
                sectionFocus.querySelector('#electric-table table tbody').innerHTML = '';

                var temp = doc.createElement('div');
                temp.innerHTML = content;

                data.electric.useAmounts.forEach(function(ev, ei) {
                    if (ev != '0') {
                        var row = doc.createElement('tr');
                        row.id = ei;
                        row.innerHTML = temp.querySelector('tbody tr').innerHTML;

                        var td = row.querySelectorAll('td');
                        td[0].innerHTML = months[ei];
                        td[1].innerHTML = ev;
                        td[2].innerHTML = data.electric.prices[ei];

                        sectionFocus.querySelector('#electric-table table tbody').appendChild(row);
                    }
                });
            });
        }

        if (data.water) {
            httpGet('./assets/templates/utilities/water-table.html', function(content) {
                sectionFocus.querySelector('#water-table').innerHTML = content;
                sectionFocus.querySelector('#water-table table tbody').innerHTML = '';

                var temp = doc.createElement('div');
                temp.innerHTML = content;

                data.water.useAmounts.forEach(function(ev, ei) {
                    if (ev != '0') {
                        var row = doc.createElement('tr');
                        row.id = ei;
                        row.innerHTML = temp.querySelector('tbody tr').innerHTML;

                        var td = row.querySelectorAll('td');
                        td[0].innerHTML = months[ei];
                        td[1].innerHTML = ev;
                        td[2].innerHTML = data.water.prices[ei];

                        sectionFocus.querySelector('#water-table table tbody').appendChild(row);
                    }
                });
            });
        }

        if (data.gas) {
            httpGet('./assets/templates/utilities/gas-table.html', function(content) {
                sectionFocus.querySelector('#gas-table').innerHTML = content;
                sectionFocus.querySelector('#gas-table table tbody').innerHTML = '';

                var temp = doc.createElement('div');
                temp.innerHTML = content;

                data.gas.useAmounts.forEach(function(ev, ei) {
                    if (ev != '0') {
                        var row = doc.createElement('tr');
                        row.id = ei;
                        row.innerHTML = temp.querySelector('tbody tr').innerHTML;

                        var td = row.querySelectorAll('td');
                        td[0].innerHTML = months[ei];
                        td[1].innerHTML = ev;
                        td[2].innerHTML = data.gas.prices[ei];

                        sectionFocus.querySelector('#gas-table table tbody').appendChild(row);
                    }
                });
            });
        }
    }

    enableDangerTooltip();
});

/* show chart on tab shown */
$('a[href="#electric"][data-toggle=tab]').on('shown.bs.tab', function() {
    newChart(eChart, eData, 'KW/H Usage');
});

$('a[href="#water"][data-toggle=tab]').on('shown.bs.tab', function() {
    newChart(wChart, wData, 'm\u00B3 Usage');
});

$('a[href="#gas"][data-toggle=tab]').on('shown.bs.tab', function() {
    newChart(gChart, gData, 'KW/H Usage');
});

/* add or update button */
sectionFocus.querySelector('#electric button#addUpdate').onclick = function() {
    var formFocus = sectionFocus.querySelector('form#electricForm');
    if (formFocus.classList.contains('d-none')) {
        formFocus.classList.remove('d-none');
        formFocus.classList.add('fadeIn');
    }
}

sectionFocus.querySelector('#water button#addUpdate').onclick = function() {
    var formFocus = sectionFocus.querySelector('form#waterForm');
    if (formFocus.classList.contains('d-none')) {
        formFocus.classList.remove('d-none');
        formFocus.classList.add('fadeIn');
    }
}

sectionFocus.querySelector('#gas button#addUpdate').onclick = function() {
    var formFocus = sectionFocus.querySelector('form#gasForm');
    if (formFocus.classList.contains('d-none')) {
        formFocus.classList.remove('d-none');
        formFocus.classList.add('fadeIn');
    }
}

/* form submits */
sectionFocus.querySelector('form#gasForm').onsubmit = function(e) {
    e.preventDefault();
    var formFocus = this;

    var feedbacks = formFocus.querySelectorAll('.feedback');
    feedbacks.forEach(function(el) {
        el.parentElement.classList.remove('invalid', 'valid');
        el.innerHTML = '';
    });

    var data = new FormData(formFocus);
    data.append('uid', uid);
    data.append('action', 'updateAddGas');

    httpPost('./assets/db/db.php', data, function(data) {
        console.log(data);  // Debugging Purpose
        if (data.success) {
            var modal = doc.getElementById('successModal');
            modal.querySelector('.modal-header h5.modal-title').innerHTML = 'Gas Bill Updated';
            modal.getElementsByClassName('modal-body')[0].innerHTML = 'You have successfuly updated your gas bill.';

            $(modal).on('shown.bs.modal', function() {
                setTimeout(function () {
                    $(modal).modal('hide');
                }, 2500);
            });

            $(modal).on('hide.bs.modal', function() {
                location.href = './utilities';
            });

            $(modal).modal('show');
        }
        else if (data.errors) {
            if (data.errors.usage) {
                formFocus.querySelector('#gasUsage').classList.add('invalid');
                formFocus.querySelector('#gasUsage .feedback').innerHTML = data.errors.usage;
            }
            else {
                formFocus.querySelector('#gasUsage').classList.add('valid');
            }

            if (data.errors.month) {
                formFocus.querySelector('#gasMonth').parentElement.classList.add('invalid');
                formFocus.querySelector('.form-group.month .feedback').innerHTML = data.errors.month;
            }
            else {
                formFocus.querySelector('#gasMonth').parentElement.classList.add('valid');
            }
        }
    });
}

/* new chart function */
function newChart(target, dataSet, label) {
    var gradient = target.createLinearGradient(0, 0, 0, 600);
    gradient.addColorStop(0, '#13547a');
    gradient.addColorStop(1, '#4db6ac');

    new Chart(target, {
        type: 'bar',
        data: {
            defaultFontFamily: 'Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
            labels: ['Janauary', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            datasets: [{
                label: label,
                data: dataSet,
                backgroundColor: gradient,
                hoverBackgroundColor: '#13547a'
            }]
        },
        options: {
            animation: {
                easing: 'easeInOutQuad',
                duration: 2500
            },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero:true
                    }
                }]
            }
        }
    });
}
