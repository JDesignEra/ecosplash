'use strict';

if (!(localStorage.getItem('accType') || sessionStorage.getItem('accType'))) {
    location.href = './'
}

document.title = 'EcoSplash \u00B7 ' + (localStorage.getItem('name') ? localStorage.getItem('name') : sessionStorage.getItem('name'));
var $uid = (localStorage.getItem('uid') ? localStorage.getItem('uid') : sessionStorage.getItem('uid')),
    $sectionFocus = $('section#profile');

if (localStorage.getItem('accType') == 0 || sessionStorage.getItem('accType') == 0) {
    $sectionFocus.find('#quiz-list.card').remove();
    $sectionFocus.find('#event-list.card').remove();
}
else if (localStorage.getItem('accType') == 1 || sessionStorage.getItem('accType') == 1) {
    $sectionFocus.find('#daily-task.card').remove();
    $sectionFocus.find('#redeemed-history.card').remove();
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
        $sectionFocus.find('#ecopoints').html(data.ecoPoints);

        if (data.bio != '' && data.bio != null) {
            $sectionFocus.find('#bio').html(data.bio);
        }

        $.get('./assets/img/uploads/' + data.uid + '.png')
            .done(function() {
                $sectionFocus.find('#basicProfile.card .pic').css('background-image', 'url(./assets/img/uploads/' + data.uid + '.png)');
            })
            .fail(function() {
                console.clear();
            });
    }
});

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

/* get user recent event history */
$.ajax({
    type: 'POST',
    url: 'assets/db/db.php',
    data: 'uid=' + $uid + '&action=getEventHistories',
    dataType: 'json'
})
.done(function(data) {
    if (data.success) {
        // console.log(data); // Debugging Purpose
        $.get('./assets/templates/profile/event_histories.html', function(content) {
            $sectionFocus.find('#event-history-table').html(content);
            $sectionFocus.find('#event-history-table tbody').empty();

            for (var i = 0; i < data.event_histories.length; i++) {
                var $row = $(content).find('tbody tr').clone().attr('id', data.event_histories[i]['eid']);
                $('td', $row).eq(0).html(data.event_histories[i]['eid']);
                $('td', $row).eq(1).html($.format.date(data.event_histories[i]['joinDate'], 'dd MMMM yyyy'));
                $('td', $row).eq(2).html(data.event_histories[i]['event']);
                $('td', $row).eq(3).html(data.event_histories[i]['status'] == 1 ? 'Present' : 'Absent');

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
                $focus.find('.modal-header .modal-title').html('# ' + data.eid + ' On ' + $.format.date(data.joinDate, 'dd MMMM yyyy'));
                $focus.find('.modal-body table tbody').empty();

                var $row = $(content).find('tr').clone();
                $('th', $row).html('Joined Date');
                $('td', $row).html($.format.date(data.joinDate, 'dd MMMM yyyy'));
                $focus.find('.modal-body table tbody').append($row);

                $row = $(content).find('tr').clone();
                $('th', $row).html('Event');
                $('td', $row).html(data.event);
                $focus.find('.modal-body table tbody').append($row);

                $row = $(content).find('tr').clone();
                $('th', $row).html('Date');
                $('td', $row).html($.format.date(data.dateTime, 'dd MMMM yyyy'));
                $focus.find('.modal-body table tbody').append($row);

                $row = $(content).find('tr').clone();
                $('th', $row).html('Time');
                $('td', $row).html($.format.date(data.dateTime, 'hh:mm p'));
                $focus.find('.modal-body table tbody').append($row);

                $row = $(content).find('tr').clone();
                $('th', $row).html('EcoPoints');
                $('td', $row).html(data.ecoPoints);
                $focus.find('.modal-body table tbody').append($row);

                $row = $(content).find('tr').clone();
                $('th', $row).html('Status');
                $('td', $row).html((data.status == 1 ? 'Present' : 'Absent'));
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

            for (var i = 0; i < data.redeem_histories.length; i++) {
                var $totalQty = 0,
                $qtyStr = data.redeem_histories[i]['itemsQty'].split(',');
                $($qtyStr).each(function(i) {
                    $totalQty += parseInt($qtyStr[i]);
                });

                var $row = $(content).find('tbody tr').clone().attr('id', data.redeem_histories[i]['oid']);
                $('td', $row).eq(0).html(data.redeem_histories[i]['oid']);
                $('td', $row).eq(1).html($.format.date(data.redeem_histories[i]['date'], 'dd MMMM yyyy'));
                $('td', $row).eq(2).html($totalQty);
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
                $focus.find('.modal-header .modal-title').html('# ' + data.oid + ' On ' + $.format.date(data.date, 'dd MMMM yyyy'));
                $focus.find('.modal-body table tbody').empty();
                $focus.find('.modal-body h6 #total').html(data.totalEcoPoints);

                var $items = data.items.split(','),
                $quantities = data.itemsQty.split(','),
                $itemsEcoPoints = data.itemsEcoPoints.split(',');

                $($items).each(function(i) {
                    var $row = $(content).find('tbody tr').clone();
                    $('td', $row).eq(0).html($items[i]);
                    $('td', $row).eq(1).html($quantities[i]);
                    $('td', $row).eq(2).html($itemsEcoPoints[i]);

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
