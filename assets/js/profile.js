if (!(localStorage.getItem('accType') || sessionStorage.getItem('accType'))) {
    location.href = './'
}

document.title = 'EcoSplash \u00B7 ' + (localStorage.getItem('name') ? localStorage.getItem('name') : sessionStorage.getItem('name'));
$uid = (localStorage.getItem('uid') ? localStorage.getItem('uid') : sessionStorage.getItem('uid'));
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
        $inputFocus = $sectionFocus.find('form#dailyTask input[type=checkbox]');
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

        $.get('./assets/img/uploads/' + data.uid + '.png').done(function() {
            $sectionFocus.find('#basicProfile.card .pic').css('background-image', 'url(./assets/img/uploads/' + data.uid + '.png)');
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
    if (data.success) {
        $sectionFocus.find('form#dailyTask label.form-check-label').each(function(i) {
            $(this).html(data.task[i]);
        });
    }
});

/* get user recent redeemed history */
$.ajax({
    type: 'POST',
    url: 'assets/db/db.php',
    data: 'uid=' + $uid + '&action=getRedeemHistory',
    dataType: 'json'
})
.done(function(data) {
    if (data.success) {
        // console.log(data); // Debugging Purpose
        $.get('./assets/templates/profile/redeem_history.html', function(content) {
            $sectionFocus.find('#redeem-history-table').html(content);
            $sectionFocus.find('tbody').empty();

            $(data.redeem_histories).each(function(i) {
                $totalQty = 0;
                $qtyStr = data.redeem_histories[i]['itemsQty'].split(',');
                $($qtyStr).each(function(i) {
                    $totalQty += parseInt($qtyStr[i]);
                });

                $row = $(content).find('tbody tr').clone().attr('id', data.redeem_histories[i]['oid']);
                $('td', $row).eq(0).html($.format.date(data.redeem_histories[i]['date'], 'dd MMMM yyyy'));
                $('td', $row).eq(1).html($totalQty);
                $('td', $row).eq(2).html(data.redeem_histories[i]['totalEcoPoints']);

                $sectionFocus.find('#redeem-history-table tbody').append($row);
            })
        });
    }
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
            $modal = $('#dailyTaskModal');
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
