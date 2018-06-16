if (!(localStorage.getItem('accType') || sessionStorage.getItem('accType'))) {
    location.href = './'
}

document.title = 'EcoSplash \u00B7 ' + (localStorage.getItem('name') ? localStorage.getItem('name') : sessionStorage.getItem('name'));
$uid = (localStorage.getItem('uid') ? localStorage.getItem('uid') : sessionStorage.getItem('uid'));
$sectionFocus = $('section#profile');

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
        if (localStorage.getItem('accType')) {
            localStorage.setItem('name', data.name);
            localStorage.setItem('email', data.email);
            localStorage.setItem('ecoPoints', data.ecoPoints);
            localStorage.setItem('newNotifications', data.newNotifications);
        }
        else {
            sessionStorage.setItem('name', data.name);
            sessionStorage.setItem('email', data.email);
            sessionStorage.setItem('ecoPoints', data.ecoPoints);
            sessionStorage.setItem('newNotifications', data.newNotifications);
        }
    }

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
});

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

if (localStorage.getItem('accType') == 0 || sessionStorage.getItem('accType') == 0) {
    $sectionFocus.find('#quiz-list.card').remove();
    $sectionFocus.find('#event-list.card').remove();
}
else if (localStorage.getItem('accType') == 1 || sessionStorage.getItem('accType') == 1) {
    $sectionFocus.find('#daily-task.card').remove();
    $sectionFocus.find('#redeemed-history.card').remove();
}

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
