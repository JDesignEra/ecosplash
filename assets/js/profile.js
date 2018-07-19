'use strict';
securePage();

document.title = 'EcoSplash \u00B7 ' + (localStorage.getItem('name') ? localStorage.getItem('name') : sessionStorage.getItem('name'));

var uid = (localStorage.getItem('uid') ? localStorage.getItem('uid') : sessionStorage.getItem('uid')),
    sectionFocus = doc.querySelector('section#profile'),
    accType = (localStorage.getItem('accType') ? localStorage.getItem('accType') : sessionStorage.getItem('accType'));

// checks account type
if (accType) {
    // case 0 = user, case 1 = organization
    switch (accType) {
        case '0':
            sectionFocus.querySelector('#quiz-list.card').remove();
            sectionFocus.querySelector('#event-list.card').remove();

            /* get today's daily challenges */
            var data = new FormData();
            data.append('action', 'getTodayTask');

            httpPost('./assets/db/db.php', data, function(data) {
                // console.log(data);  // Debugging Purpose
                if (data.success) {
                    var focus = sectionFocus.querySelectorAll('form#dailyTask label.form-check-label');

                    focus.forEach(function(el, i) {
                        el.innerHTML = data.tasks[i];
                    });
                }
            });

            /* get user recent event histories (max 10) */
            var data = new FormData();
            data.append('uid', uid)
            data.append('action', 'getEventHistories');

            httpPost('./assets/db/db.php', data, function(data) {
                if (data.success) {
                    // console.log(data); // Debugging Purpose
                    httpGet('./assets/templates/profile/event_histories.html', function(content) {
                        sectionFocus.querySelector('#event-history-table').innerHTML = content;
                        sectionFocus.querySelector('#event-history-table tbody').innerHTML = '';

                        for (var i = 0; i < data.event_histories.length && i < 10; i++) {
                            var temp = doc.createElement('div');
                            temp.innerHTML = content;

                            var row = temp.querySelector('tbody tr').cloneNode(true);
                            row.id = data.event_histories[i]['eid'];

                            var td = row.querySelectorAll('td');
                            td[0].innerHTML = data.event_histories[i]['eid'];
                            td[1].innerHTML = data.event_histories[i]['joinDate'];
                            td[2].innerHTML = data.event_histories[i]['event'];
                            td[3].innerHTML = data.event_histories[i]['status'];

                            sectionFocus.querySelector('#event-history-table tbody').append(row);
                        }

                        enableTooltip();
                    });
                }
            });

            /* event history view more button */
            addWindowOnload(function() {
                var focus = sectionFocus.querySelectorAll('#event-history-table button#view-more');

                focus.forEach(function(el) {
                    el.addEventListener('click', function() {
                        var eid = el.parentElement.parentElement.id,
                            data = new FormData();

                        data.append('uid', uid);
                        data.append('eid', eid);
                        data.append('action', 'getEventHistory');

                        httpPost('./assets/db/db.php', data, function(data) {
                            // console.log(data);  // Debugging Purpose
                            if (data.success) {
                                httpGet('./assets/templates/profile/event_history.html', function(content) {
                                    focus = doc.getElementById('view-more-modal');
                                    focus.getElementsByClassName('modal-body')[0].innerHTML = content;
                                    focus.querySelector('.modal-header .modal-title').innerHTML = '# ' + data.eid + ' On ' + data.joinDate;

                                    var td = focus.querySelectorAll('tbody tr td');
                                    td[0].innerHTML = data.joinDate;
                                    td[1].innerHTML = data.event;
                                    td[2].innerHTML = data.date;
                                    td[3].innerHTML = data.time;
                                    td[4].innerHTML = data.ecoPoints;
                                    td[5].innerHTML = data.status;
                                });

                                $('[tooltip-toggle=tooltip]').tooltip('hide');
                                $('#view-more-modal').modal('show');
                            }
                        });
                    });
                });
            });

            /* get user redeemed history (max 10) */
            var data = new FormData();
            data.append('uid', uid);
            data.append('action', 'getRedeemHistories');

            httpPost('./assets/db/db.php', data, function(data) {
                if (data.success) {
                    // console.log(data); // Debugging Purpose
                    httpGet('./assets/templates/profile/redeem_histories.html', function(content) {
                        sectionFocus.querySelector('#redeem-history-table').innerHTML = content;
                        sectionFocus.querySelector('#redeem-history-table tbody').innerHTML = '';

                        for (var i = 0; i < data.redeem_histories.length && i < 10; i++) {
                            var temp = doc.createElement('div');
                            temp.innerHTML = content;

                            var row = temp.querySelector('tbody tr').cloneNode(true);
                            row.id = data.redeem_histories[i]['oid'];

                            var td = row.querySelectorAll('td');
                            td[0].innerHTML = data.redeem_histories[i]['oid'];
                            td[1].innerHTML = data.redeem_histories[i]['date'];
                            td[2].innerHTML = data.redeem_histories[i]['totalQty'];
                            td[3].innerHTML = data.redeem_histories[i]['totalEcoPoints'];

                            sectionFocus.querySelector('#redeem-history-table tbody').appendChild(row);
                        }

                        enableTooltip();
                    });
                }
            });

            /* redeem history view more button */
            addWindowOnload(function() {
                var focus = sectionFocus.querySelectorAll('#redeem-history-table button#view-more');

                focus.forEach(function(el) {
                    el.addEventListener('click', function() {
                        var oid = this.parentElement.parentElement.id;

                        var data = new FormData();
                        data.append('uid', uid);
                        data.append('oid', oid);
                        data.append('action', 'getRedeemHistory');

                        httpPost('./assets/db/db.php', data, function(data) {
                            // console.log(data);  // Debugging Purpose
                            if (data.success) {
                                httpGet('./assets/templates/profile/redeem_history.html', function(content) {
                                    focus = doc.getElementById('view-more-modal');

                                    focus.getElementsByClassName('modal-body')[0].innerHTML = content;
                                    focus.querySelector('.modal-header .modal-title').innerHTML = '#' + data.oid + ' on ' + data.date;
                                    focus.querySelector('.modal-body table tbody').innerHTML = '';
                                    focus.querySelector('.modal-body h6 #total').innerHTML = data.totalEcoPoints;

                                    data.items.forEach(function(k, i) {
                                        var temp = doc.createElement('div');
                                        temp.innerHTML = content;

                                        var row = temp.querySelector('tbody tr').cloneNode(true);

                                        var td = row.querySelectorAll('td');
                                        td[0].innerHTML = k;
                                        td[1].innerHTML = data.itemsQty[i];
                                        td[2].innerHTML = data.itemsEcoPoints[i];

                                        focus.querySelector('table tbody').appendChild(row);
                                    });
                                });

                                $('[tooltip-toggle=tooltip]').tooltip('hide');
                                $('#view-more-modal').modal('show');
                            }
                        });
                    });
                });
            });

            /* daily task form */
            doc.querySelector('form#dailyTask').onsubmit = function(e) {
                e.preventDefault();

                var checkbox = doc.querySelectorAll('form#dailyTask input[type=checkbox]:not([disabled])'),
                data = new FormData();

                checkbox.forEach(function(el) {
                    if (el.checked) {
                        data.append(el.getAttribute('name'), el.checked);
                    }
                });

                data.append('uid', uid);
                data.append('action', 'updateUserTask');

                httpPost('./assets/db/db.php', data, function(data) {
                    // console.log(data); // Debugging Purpose
                    if (data.success) {
                        var modal = doc.getElementById('dailyTaskModal');
                        modal.getElementsByClassName('award-ecopoints')[0].innerHTML = data.addEcoPoints;

                        $(modal).on('shown.bs.modal', function() {
                            modal.querySelector('.modal-footer button[data-dismiss=modal]').focus();

                            setTimeout(function () {
                                $(modal).modal('hide');
                            }, 2500);
                        });

                        $(modal).on('hide.bs.modal', function() {
                            location.href = './profile';
                        });

                        $(modal).modal("show");
                    }
                });
            }
            break;

        case '1':
            sectionFocus.querySelector('#daily-task.card').remove();
            sectionFocus.querySelector('#redeem-history.card').remove();
            sectionFocus.querySelector('#event-history.card').remove();

            /* get events list (max 10) */
            var data = new FormData();
            data.append('uid', uid);
            data.append('action', 'getEventsList');

            httpPost('./assets/db/db.php', data, function(data) {
                // console.log(data);  // Debugging Purpose
                if (data.success) {
                    httpGet('./assets/templates/profile/events_list.html', function(content) {
                        sectionFocus.querySelector('#event-list-table').innerHTML = content;
                        sectionFocus.querySelector('#event-list-table tbody').innerHTML = '';

                        for (var i = 0; i < data.events_list.length && i < 10; i++) {
                            var temp = doc.createElement('div');
                            temp.innerHTML = content;

                            var row = temp.querySelector('tbody tr').cloneNode(true);
                            row.id = data.events_list[i]['eid'];

                            var td = row.querySelectorAll('td');
                            td[0].innerHTML = data.events_list[i]['eid'];
                            td[1].innerHTML = data.events_list[i]['date'];
                            td[2].innerHTML = data.events_list[i]['time'];
                            td[3].innerHTML = data.events_list[i]['location'];
                            td[4].innerHTML = data.events_list[i]['ecoPoints'];

                            sectionFocus.querySelector('#event-list-table tbody').appendChild(row);
                        }
                    });
                }
            });

            /* get quizzes list (max 10) */
            var data = new FormData();
            data.append('uid', uid);
            data.append('action', 'getQuizzesList');

            httpPost('./assets/db/db.php', data, function(data) {
                // console.log(data);  // Debugging Purpose

                httpGet('./assets/templates/profile/quizzes_list.html', function(content) {
                    sectionFocus.querySelector('#quiz-list-table').innerHTML = content;
                    sectionFocus.querySelector('#quiz-list-table tbody').innerHTML = '';

                    for (var i = 0; i < data.quizzes_list.length && i < 10; i++) {
                        var temp = doc.createElement('div');
                        temp.innerHTML = content;

                        var row = temp.querySelector('tbody tr').cloneNode(true);
                        row.id = data.quizzes_list[i]['qid'];

                        var td = row.querySelectorAll('td');
                        td[0].innerHTML = data.quizzes_list[i]['qid'];
                        td[1].innerHTML = data.quizzes_list[i]['date'];
                        td[2].innerHTML = data.quizzes_list[i]['name'];
                        td[3].innerHTML = data.quizzes_list[i]['ecoPoints'];

                        sectionFocus.querySelector('#quiz-list-table tbody').appendChild(row);
                    }
                });

                enableTooltip();
            });

            /* quizzes list view more button */
            addWindowOnload(function() {
                var focus = sectionFocus.querySelectorAll('#quiz-list-table button#view-more');

                focus.forEach(function(el) {
                    el.addEventListener('click', function() {
                        var qid = this.parentElement.parentElement.id;

                        var data = new FormData();
                        data.append('uid', uid);
                        data.append('qid', qid);
                        data.append('action', 'getQuizList');

                        httpPost('./assets/db/db.php', data, function(data) {
                            // console.log(data);  // Debugging Purpose
                            if (data.success) {
                                httpGet('./assets/templates/profile/quiz_list.html', function(content) {
                                    focus = doc.getElementById('view-more-modal');
                                    focus.getElementsByClassName('modal-body')[0].innerHTML = content;
                                    focus.querySelector('.modal-body table tbody').innerHTML = '';
                                    focus.querySelector('.modal-header .modal-title').innerHTML = '# ' + data.qid + ': ' + data.name + ' (' + data.date + ')';

                                    data.questions.forEach(function(qv, qi) {
                                        var temp = doc.createElement('div');
                                        temp.innerHTML = content;

                                        var questionRow = temp.querySelector('tbody tr.questionRow').cloneNode(true);
                                        questionRow.querySelector('th').innerHTML = qv;

                                        focus.querySelector('table tbody').appendChild(questionRow);

                                        var optionRow;
                                        data.options.splice(0, 4).forEach(function(ov, oi) {
                                            if (oi % 2 == 0) {  // create new row
                                                optionRow = temp.querySelector('tbody tr.optionRow').cloneNode(true);
                                                optionRow.querySelectorAll('td.option')[0].innerHTML = ov;
                                            }
                                            else {  // add created row
                                                optionRow.querySelectorAll('td.option')[1].innerHTML = ov;
                                                focus.querySelector('table tbody').appendChild(optionRow);
                                            }
                                        });

                                        var focusAns = focus.querySelectorAll('.modal-body table tbody td.answer'),
                                            minusAns = (data.answers[qi] != 0 ? 3 - data.answers[qi] : 3),
                                            correctIcon = doc.createElement('i');

                                            correctIcon.classList.add('fas', 'fa-check', 'fa-lg', 'text-success');

                                        focusAns[(focusAns.length - 1) - minusAns].appendChild(correctIcon);
                                    });
                                });

                                $('[tooltip-toggle=tooltip]').tooltip('hide');
                                $('#view-more-modal').modal('show');
                            }
                        });
                    });
                });
            });
            break;
    }
}

/* get user profile details */
var data = new FormData();
data.append('uid', uid);
data.append('action', 'getUser');

httpPost('./assets/db/db.php', data, function(data) {
    // console.log(data);  // Debugging Purpose
    if (data.success) {
        var inputFocus = sectionFocus.querySelectorAll('form#dailyTask input[type=checkbox]'),
            labelfocus = sectionFocus.querySelectorAll('form#dailyTask label.form-check-label');

        for (var i = 0; i < data.dailyTask.length; i++) {
            if (data.dailyTask.charAt(i) == '1') {
                inputFocus[i].checked = true;
                inputFocus[i].disabled = true;
                labelfocus[i].style.textDecoration = 'line-through';
            }
        }

        sectionFocus.querySelector('#name').innerHTML = data.name;
        sectionFocus.querySelector('#email').innerHTML = data.email;

        if (accType == '1') {
            sectionFocus.querySelector('#ecopointsContent').remove();
        }
        else {
            sectionFocus.querySelector('#ecopoints').innerHTML = data.ecoPoints;
        }

        if (data.bio) {
            sectionFocus.querySelector('#bio').innerHTML = data.bio;
        }

        httpGet('./assets/img/uploads/' + data.uid + '.png', function() {
            sectionFocus.querySelector('#basicProfile.card .pic').style.backgroundImage = 'url("./assets/img/uploads/' + data.uid + '.png")';
        });
    }
});
