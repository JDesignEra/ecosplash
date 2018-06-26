// TODO Organization Event List & Quiz List
'use strict';

if (!(localStorage.getItem('accType') || sessionStorage.getItem('accType'))) {
    location.href = './'
}

document.title = 'EcoSplash \u00B7 ' + (localStorage.getItem('name') ? localStorage.getItem('name') : sessionStorage.getItem('name'));
var $uid = (localStorage.getItem('uid') ? localStorage.getItem('uid') : sessionStorage.getItem('uid')),
    $sectionFocus = $('section#profile'),
    $accType = (localStorage.getItem('accType') ? localStorage.getItem('accType') : sessionStorage.getItem('accType'));

if ($accType !== '' && $accType !== null) {
    switch ($accType) {
        case '0':
            $sectionFocus.find('#quiz-list.card').remove();
            $sectionFocus.find('#event-list.card').remove();

            /* get today's daily challenges */
            $.ajax({
                type: 'POST',
                url: 'assets/db/db.php',
                data: 'action=getTodayTask',
                dataType: 'json'
            })
            .done(function(data) {
                // console.log(data);  // Debugging Purpose
                if (data.success) {
                    $sectionFocus.find('form#dailyTask label.form-check-label').each(function(i) {
                        $(this).html(data.tasks[i]);
                    });
                }
            });

            /* get user recent event histories */
            $.ajax({
                type: 'POST',
                url: 'assets/db/db.php',
                data: 'uid=' + $uid + '&action=getEventHistories',
                dataType: 'json'
            })
            .done(function(data) {
                if (data.success) {
                    console.log(data); // Debugging Purpose
                    $.get('./assets/templates/profile/event_histories.html', function(content) {
                        $sectionFocus.find('#event-history-table').html(content);
                        $sectionFocus.find('#event-history-table tbody').empty();

                        for (var i = 0; i < data.event_histories.length && i < 10; i++) {
                            var $row = $(content).find('tbody tr').clone().attr('id', data.event_histories[i]['eid']);
                            $('td', $row).eq(0).html(data.event_histories[i]['eid']);
                            $('td', $row).eq(1).html(data.event_histories[i]['joinDate']);
                            $('td', $row).eq(2).html(data.event_histories[i]['event']);
                            $('td', $row).eq(3).html(data.event_histories[i]['status']);

                            $sectionFocus.find('#event-history-table tbody').append($row);
                        }

                        enableTooltip();
                    });
                }
            });

            /* event history view more button */
            $($sectionFocus).on('click', '#event-history-table button#view-more', function() {
                var $eid = $(this).parent().parent().attr('id');

                $.ajax({
                    type: 'POST',
                    url: 'assets/db/db.php',
                    data: 'uid=' + $uid + '&eid=' + $eid + '&action=getEventHistory',
                    dataType: 'json'
                })
                .done(function(data) {
                    // console.log(data);  // Debugging Purpose
                    if (data.success) {
                        $.get('./assets/templates/profile/event_history.html', function(content) {
                            var $focus = $('#view-more-modal');
                            $focus.find('.modal-body').html(content);
                            $focus.find('.modal-header .modal-title').html('# ' + data.eid + ' On ' + data.joinDate);
                            $focus.find('.modal-body table tbody').empty();

                            var $row = $(content).find('tr').clone();
                            $('th', $row).html('Joined Date');
                            $('td', $row).html(data.joinDate);
                            $focus.find('.modal-body table tbody').append($row);

                            $row = $(content).find('tr').clone();
                            $('th', $row).html('Event');
                            $('td', $row).html(data.event);
                            $focus.find('.modal-body table tbody').append($row);

                            $row = $(content).find('tr').clone();
                            $('th', $row).html('Event Date');
                            $('td', $row).html(data.date);
                            $focus.find('.modal-body table tbody').append($row);

                            $row = $(content).find('tr').clone();
                            $('th', $row).html('Event Time');
                            $('td', $row).html(data.time);
                            $focus.find('.modal-body table tbody').append($row);

                            $row = $(content).find('tr').clone();
                            $('th', $row).html('EcoPoints');
                            $('td', $row).html(data.ecoPoints);
                            $focus.find('.modal-body table tbody').append($row);

                            $row = $(content).find('tr').clone();
                            $('th', $row).html('Status');
                            $('td', $row).html(data.status);
                            $focus.find('.modal-body table').append($row);
                        });

                        $('[tooltip-toggle=tooltip]').tooltip('hide');
                        $('#view-more-modal').modal('show');
                    }
                });
            });

            /* get user recent redeemed history */
            $.ajax({
                type: 'POST',
                url: 'assets/db/db.php',
                data: 'uid=' + $uid + '&action=getRedeemHistories',
                dataType: 'json'
            })
            .done(function(data) {
                if (data.success) {
                    // console.log(data); // Debugging Purpose
                    $.get('./assets/templates/profile/redeem_histories.html', function(content) {
                        $sectionFocus.find('#redeem-history-table').html(content);
                        $sectionFocus.find('#redeem-history-table tbody').empty();

                        for (var i = 0; i < data.redeem_histories.length && i < 10; i++) {
                            var $row = $(content).find('tbody tr').clone().attr('id', data.redeem_histories[i]['oid']);
                            $('td', $row).eq(0).html(data.redeem_histories[i]['oid']);
                            $('td', $row).eq(1).html(data.redeem_histories[i]['date']);
                            $('td', $row).eq(2).html(data.redeem_histories[i]['totalQty']);
                            $('td', $row).eq(3).html(data.redeem_histories[i]['totalEcoPoints']);

                            $sectionFocus.find('#redeem-history-table tbody').append($row);
                        }

                        enableTooltip();
                    });
                }
            });

            /* redeem history view more button */
            $($sectionFocus).on('click', '#redeem-history-table button#view-more', function() {
                var $oid = $(this).parent().parent().attr('id');

                $.ajax({
                    type: 'POST',
                    url: 'assets/db/db.php',
                    data: 'uid=' + $uid + '&oid=' + $oid + '&action=getRedeemHistory',
                    dataType: 'json'
                })
                .done(function(data) {
                    // console.log(data);  // Debugging Purpose
                    if (data.success) {
                        $.get('./assets/templates/profile/redeem_history.html', function(content) {
                            var $focus = $('#view-more-modal');
                            $focus.find('.modal-body').html(content);
                            $focus.find('.modal-header .modal-title').html('# ' + data.oid + ' On ' + data.date);
                            $focus.find('.modal-body table tbody').empty();
                            $focus.find('.modal-body h6 #total').html(data.totalEcoPoints);

                            $.each(data.items, function(i, v) {
                                var $row = $(content).find('tbody tr').clone();
                                $('td', $row).eq(0).html(v);
                                $('td', $row).eq(1).html(data.itemsQty[i]);
                                $('td', $row).eq(2).html(data.itemsEcoPoints[i]);

                                $focus.find('table tbody').append($row);
                            });
                        });

                        $('[tooltip-toggle=tooltip]').tooltip('hide');
                        $('#view-more-modal').modal('show');
                    }
                });
            });

            /* daily task form */
            $('form#dailyTask').submit(function(e) {
                e.preventDefault();

                $.ajax({
                    type: 'POST',
                    url: 'assets/db/db.php',
                    data: $(this).serialize() + '&uid=' + $uid + '&action=updateUserTask',
                    dataType: 'json'
                })
                .done(function(data) {
                    // console.log(data); // Debugging Purpose
                    if (data.success) {
                        var $modal = $('#dailyTaskModal');
                        $modal.find('.award-ecopoints').html(data.addEcoPoints);

                        $modal.on('shown.bs.modal', function() {
                            $modal.find('button[data-dismiss=modal]').focus();
                            setTimeout(function () {
                                $modal.modal('hide');
                            }, 2000);
                        });

                        $modal.on('hide.bs.modal', function() {
                            location.href = './profile';
                        });

                        $modal.modal("show");
                    }
                });
            });
            break;

        case '1':
            $sectionFocus.find('#daily-task.card').remove();
            $sectionFocus.find('#redeem-history.card').remove();
            $sectionFocus.find('#event-history.card').remove();

            /* get events list (max 10) */
            $.ajax({
                type: 'POST',
                url: 'assets/db/db.php',
                data: '&uid=' + $uid + '&action=getEventsList',
                dataType: 'json'
            })
            .done(function(data) {
                // console.log(data);  // Debugging Purpose
                if (data.success) {
                    $.get('./assets/templates/profile/events_list.html', function(content) {
                        $sectionFocus.find('#event-list-table').html(content);
                        $sectionFocus.find('#event-list-table tbody').empty();

                        for (var i = 0; i < data.events_list.length && i < 10; i++) {
                            var $row = $(content).find('tbody tr').clone().attr('id', data.events_list[i]['eid']);
                            $('td', $row).eq(0).html(data.events_list[i]['eid']);
                            $('td', $row).eq(1).html(data.events_list[i]['date']);
                            $('td', $row).eq(2).html(data.events_list[i]['time']);
                            $('td', $row).eq(3).html(data.events_list[i]['location']);
                            $('td', $row).eq(4).html(data.events_list[i]['ecoPoints']);

                            $sectionFocus.find('#event-list-table tbody').append($row);
                        }
                    });
                }
            });

            /* get quizzes list (max 10) */
            $.ajax({
                type: 'POST',
                url: 'assets/db/db.php',
                data: '&uid=' + $uid + '&action=getQuizzesList',
                dataType: 'json'
            })
            .done(function(data) {
                // console.log(data);  // Debugging Purpose
                $.get('./assets/templates/profile/quizzes_list.html', function(content) {
                    $sectionFocus.find('#quiz-list-table').html(content);
                    $sectionFocus.find('#quiz-list-table tbody').empty();

                    for (var i = 0; i < data.quizzes_list.length && i < 10; i++) {
                        var $row = $(content).find('tbody tr').clone().attr('id', data.quizzes_list[i]['qid']);
                        $('td', $row).eq(0).html(data.quizzes_list[i]['qid']);
                        $('td', $row).eq(1).html(data.quizzes_list[i]['date']);
                        $('td', $row).eq(2).html(data.quizzes_list[i]['name']);
                        $('td', $row).eq(3).html(data.quizzes_list[i]['ecoPoints']);

                        $sectionFocus.find('#quiz-list-table tbody').append($row);
                    }
                });

                enableTooltip();
            });

            /* quizzes list view more button */
            $($sectionFocus).on('click', '#quiz-list-table button#view-more', function() {
                var $qid = $(this).parent().parent().attr('id');

                $.ajax({
                    type: 'POST',
                    url: 'assets/db/db.php',
                    data: 'uid=' + $uid + '&qid=' + $qid + '&action=getQuizList',
                    dataType: 'json'
                })
                .done(function(data) {
                    // console.log(data);  // Debugging Purpose
                    if (data.success) {
                        $.get('./assets/templates/profile/quiz_list.html', function(content) {
                            var $focus = $('#view-more-modal');
                            $focus.find('.modal-body').html(content);
                            $focus.find('.modal-header .modal-title').html('# ' + data.qid + ': ' + data.name + ' (' + data.date + ')');
                            $focus.find('.modal-body table tbody').empty();

                            $.each(data.questions, function(i, v) {
                                var $questionRow = $(content).find('tr.questionRow').clone(),
                                    $optionRow;

                                $('th', $questionRow).html(v);
                                $focus.find('table tbody').append($questionRow);

                                $.each(data.options.splice(0, 4), function(j, jv) {
                                    if (j % 2 == 0) {
                                        $optionRow = $(content).find('tr.optionRow').clone();
                                        $('td.option', $optionRow).eq(0).html(jv);
                                    }
                                    else {
                                        $('td.option', $optionRow).eq(1).html(jv);
                                        $focus.find('table tbody').append($optionRow);
                                    }
                                });

                                var $focusAns = $focus.find('.modal-body table tbody td.answer'),
                                    $minusAns = (data.answers[i] != 0 ? 3 - data.answers[i] : 3);

                                $focusAns.eq(($focusAns.length - 1) - $minusAns).append('<i class="fas fa-check fa-lg text-success"></i>');
                            });
                        });

                        $('[tooltip-toggle=tooltip]').tooltip('hide');
                        $('#view-more-modal').modal('show');
                    }
                });
            });
            break;
    }
}

/* get user profile details */
$.ajax({
    type: 'POST',
    url: 'assets/db/db.php',
    data: 'uid=' + $uid + '&action=getUser',
    dataType: 'json'
})
.done(function(data) {
    // console.log(data); // Debugging Purpose
    if (data.success) {
        var $inputFocus = $sectionFocus.find('form#dailyTask input[type=checkbox]'),
        $labelFocus = $sectionFocus.find('form#dailyTask label.form-check-label');
        for (var i = 0; i < data.dailyTask.length; i++) {
            if (data.dailyTask.charAt(i) == '1') {
                $($inputFocus[i]).attr('checked', 'checked');
                $($inputFocus[i]).attr('disabled', 'disabled');
                $($labelFocus[i]).css('text-decoration', 'line-through');
            }
        }

        $sectionFocus.find('#name').html(data.name);
        $sectionFocus.find('#email').html(data.email);

        if ($accType == '1') {
            $sectionFocus.find('#ecopointsContent').remove();
        }
        else {
            $sectionFocus.find('#ecopoints').html(data.ecoPoints);
        }

        if (data.bio != '' && data.bio != null) {
            $sectionFocus.find('#bio').html(data.bio);
        }

        $.get('./assets/img/uploads/' + data.uid + '.png')
            .done(function() {
                $sectionFocus.find('#basicProfile.card .pic').css('background-image', 'url(./assets/img/uploads/' + data.uid + '.png)');
            })
            .fail(function() {
                // console.clear();
            });
    }
});
