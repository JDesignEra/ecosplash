'use strict';
securePage(0, 1);

var sectionFocus = doc.querySelector('section#utilities'),
    uid = (localStorage.getItem('uid') ? localStorage.getItem('uid') : sessionStorage.getItem('uid')),
    eChart = document.getElementById('electricChart').getContext('2d'),
    wChart = document.getElementById('waterChart').getContext('2d'),
    gChart = document.getElementById('gasChart').getContext('2d'),
    eData = [],
    wData = [],
    gData = [],
    months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
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
            httpGetDoc('./assets/templates/utilities/electric-table.html', function(content) {
                var focus = sectionFocus.querySelector('#electric-table');
                focus.innerHTML = content.querySelector('body').innerHTML;
                focus.querySelector('tbody').innerHTML = '';

                data.electric.useAmounts.forEach(function(ev, ei) {
                    if (ev != '0') {
                        var row = content.querySelector('tbody tr').cloneNode(true),
                            td = row.querySelectorAll('td');
                        td[0].innerHTML = months[ei];
                        td[1].innerHTML = ev;
                        td[2].innerHTML = data.electric.prices[ei];

                        /* delete btn */
                        var btnFocus = td[3].querySelector('button');
                        btnFocus.setAttribute('data-id', ei)

                        delRowOnClick(btnFocus, 'electric');
                        focus.querySelector('tbody').appendChild(row);
                    }
                });
            });
        }

        if (data.water) {
            httpGetDoc('./assets/templates/utilities/water-table.html', function(content) {
                var focus = sectionFocus.querySelector('#water-table');
                focus.innerHTML = content.querySelector('body').innerHTML;
                focus.querySelector('tbody').innerHTML = '';

                data.water.useAmounts.forEach(function(wv, wi) {
                    if (wv != '0') {
                        var row = content.querySelector('tbody tr').cloneNode(true),
                            td = row.querySelectorAll('td');

                        td[0].innerHTML = months[wi];
                        td[1].innerHTML = wv;
                        td[2].innerHTML = data.water.prices[wi];

                        var btnFocus = td[3].querySelector('button');
                        btnFocus.setAttribute('data-id', wi);

                        delRowOnClick(btnFocus, 'water');
                        focus.querySelector('tbody').appendChild(row);
                    }
                });
            });
        }

        if (data.gas) {
            httpGetDoc('./assets/templates/utilities/gas-table.html', function(content) {
                var focus = sectionFocus.querySelector('#gas-table');
                focus.innerHTML = content.querySelector('body').innerHTML;
                focus.querySelector('tbody').innerHTML = '';

                data.gas.useAmounts.forEach(function(gv, gi) {
                    if (gv != '0') {
                        var row = content.querySelector('tbody tr').cloneNode(true),
                            td = row.querySelectorAll('td');

                        td[0].innerHTML = months[gi];
                        td[1].innerHTML = gv;
                        td[2].innerHTML = data.gas.prices[gi];

                        var btnFocus = td[3].querySelector('button');
                        btnFocus.setAttribute('data-id', gi);

                        delRowOnClick(btnFocus, 'gas');
                        focus.querySelector('tbody').appendChild(row);
                    }
                });
            });
        }

        enableDangerTooltip();
    }
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
sectionFocus.querySelector('form#electricForm').onsubmit = function(e) {
    e.preventDefault();
    var formFocus = this;

    var feedbacks = formFocus.querySelectorAll('.feedback');
    feedbacks.forEach(function(el) {
        el.parentElement.classList.remove('invalid', 'valid');
        el.innerHTML = '';
    });

    var data = new FormData(formFocus);
    data.append('uid', uid);
    data.append('action', 'updateAddElectric');

    httpPost('./assets/db/db.php', data, function(data) {
        // console.log(data);  // Debugging Purpose
        if (data.success) {
            var modal = doc.getElementById('successModal');
            modal.querySelector('.modal-header h5.modal-title').innerHTML = 'Electric Bill Updated';
            modal.getElementsByClassName('modal-body')[0].innerHTML = 'You have successfuly updated your electric bill.';

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
                formFocus.querySelector('#electricUsage').classList.add('invalid');
                formFocus.querySelector('#electricUsage .feedback').innerHTML = data.errors.usage;
            }
            else {
                formFocus.querySelector('#electricUsage').classList.add('valid');
            }

            if (data.errors.month) {
                formFocus.querySelector('#electricMonth').parentElement.classList.add('invalid');
                formFocus.querySelector('.form-group.month .feedback').innerHTML = data.errors.month;
            }
            else {
                formFocus.querySelector('#electricMonth').parentElement.classList.add('valid');
            }
        }
    });
}

sectionFocus.querySelector('form#waterForm').onsubmit = function(e) {
    e.preventDefault();
    var formFocus = this;

    var feedbacks = formFocus.querySelectorAll('.feedback');
    feedbacks.forEach(function(el) {
        el.parentElement.classList.remove('invalid', 'valid');
        el.innerHTML = '';
    });

    var data = new FormData(formFocus);
    data.append('uid', uid);
    data.append('action', 'updateAddWater');

    httpPost('./assets/db/db.php', data, function(data) {
        // console.log(data);  // Debugging Purpose
        if (data.success) {
            var modal = doc.getElementById('successModal');
            modal.querySelector('.modal-header h5.modal-title').innerHTML = 'Water Bill Updated';
            modal.getElementsByClassName('modal-body')[0].innerHTML = 'You have successfuly updated your water bill.';

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
                formFocus.querySelector('#waterUsage').classList.add('invalid');
                formFocus.querySelector('#waterUsage .feedback').innerHTML = data.errors.usage;
            }
            else {
                formFocus.querySelector('#waterUsage').classList.add('valid');
            }

            if (data.errors.month) {
                formFocus.querySelector('#waterMonth').parentElement.classList.add('invalid');
                formFocus.querySelector('.form-group.month .feedback').innerHTML = data.errors.month;
            }
            else {
                formFocus.querySelector('#waterMonth').parentElement.classList.add('valid');
            }
        }
    });
}

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
        // console.log(data);  // Debugging Purpose
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

/* deleteModal confirm button */
doc.querySelector('#deleteModal button.confirmDel').onclick = function() {
    var data = new FormData();
    data.append('uid', uid);
    data.append('uuid', this.getAttribute('data-id'));

    var delType = this.getAttribute('data-type');
    if (delType == 'electric') {
        data.append('action', 'deleteElectric');
    }
    else if (delType == 'water') {
        data.append('action', 'deleteWater');
    }
    else if (delType == 'gas') {
        data.append('action', 'deleteGas');
    }

    httpPost('./assets/db/db.php', data, function(data) {
        // console.log(data);  // Debugging Purpose
        if (data.success) {
            location.href = './utilities';
        }
    });
}

/* deleteModal on hide */
$('#deleteModal').on('hide.bs.modal', function() {
    var btnFocus = this.querySelector('.modal-footer button.confirmDel');
    btnFocus.removeAttribute('data-id');
    btnFocus.removeAttribute('data-type');
});

/* delete all button */
sectionFocus.querySelector('#electric #electricDelAll ').onclick = function() {
    doc.querySelector('#deleteAllModal button.confirmDel').setAttribute('data-type', 'electric');

    var modal = doc.getElementById('deleteAllModal'),
        bTypeFocus = modal.querySelectorAll('#deleteAllModal .bType');

    bTypeFocus.forEach(function(el) {
        el.innerHTML = 'Electric';
    });

    $('#deleteAllModal').modal('show');
}

sectionFocus.querySelector('#water #waterDelAll ').onclick = function() {
    doc.querySelector('#deleteAllModal button.confirmDel').setAttribute('data-type', 'water');

    var modal = doc.getElementById('deleteAllModal'),
        bTypeFocus = modal.querySelectorAll('#deleteAllModal .bType');

    bTypeFocus.forEach(function(el) {
        el.innerHTML = "Water";
    });

    $('#deleteAllModal').modal('show');
}

sectionFocus.querySelector('#gas #gasDelAll ').onclick = function() {
    doc.querySelector('#deleteAllModal button.confirmDel').setAttribute('data-type', 'gas');

    var modal = doc.getElementById('deleteAllModal'),
        bTypeFocus = modal.querySelectorAll('#deleteAllModal .bType');

    bTypeFocus.forEach(function(el) {
        el.innerHTML = 'Electric';
    });

    $('#deleteAllModal').modal('show');
}

/* deleteAllModal confirm button */
doc.querySelector('#deleteAllModal button.confirmDel').onclick = function() {
    var data = new FormData();
    data.append('uid', uid);

    var delType = this.getAttribute('data-type');
    if (delType == 'electric') {
        data.append('action', 'deleteAllElectric');
    }
    else if (delType == 'water') {
        data.append('action', 'deleteAllWater');
    }
    else if (delType == 'gas') {
        data.append('action', 'deleteAllGas');
    }

    httpPost('./assets/db/db.php', data, function(data) {
        // console.log(data);  // Debugging Purpose
        if (data.success) {
            location.href = './utilities';
        }
    });
}

/* deleteAllModal on hide */
$('#deleteAllModal').on('hide.bs.modal', function() {
    this.querySelector('.modal-footer button.confirmDel').removeAttribute('data-type');
});

/* delete btn function */
function delRowOnClick(target, billType) {
    target.onclick = function() {
        var id = this.getAttribute('data-id');

        var modal = doc.getElementById('deleteModal'),
            monthFocus = modal.querySelectorAll('.month'),
            bTypeFocus = modal.querySelectorAll('.bType'),
            btnFocus = modal.querySelector('.modal-footer button.confirmDel');

        btnFocus.setAttribute('data-id', id);
        btnFocus.setAttribute('data-type', billType.toLowerCase());

        monthFocus.forEach(function(el) {
            el.innerHTML = months[id];
        });

        bTypeFocus.forEach(function(el) {
            el.innerHTML = 'Electric';
        });

        $(modal).modal('show');
    }
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
            labels: months,
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
