'use strict'

if (!(localStorage.getItem('accType') || sessionStorage.getItem('accType'))) {
    $('#challenges').find('a.btn[href="./profile"]').addClass('d-none');
}

/* today's quiz */
$.ajax({
    type: 'POST',
    url: 'assets/db/db.php',
    data: '&action=getTodayQuiz',
    dataType: 'json'
})
.done(function(data) {
    // console.log(data);  // Debugging Purpose
    var $focus = $('#todayQuiz');
    if (data.success) {
        $focus.find('#quizName').html(data.quiz.name);
        $focus.find('#name').html(data.quiz.uName);
        $focus.find('#questionNo').html(data.quiz.questions.length);
        $focus.find('#ecoPoints').html(data.quiz.ecoPoints);
    }
});

/* top 5 of the month */
$.ajax({
    type: 'POST',
    url: 'assets/db/db.php',
    data: '&action=getTopEcoPoints',
    dataType: 'json'
})
.done(function(data) {
    // console.log(data);  // Debugging Purpose
    if (data.success) {
        $('#topMonth').find('#topMonthContent').empty();

        var $focus = $('#topMonth').find('#topMonthContent');
        $.each(data.top.name, function(i) {
            if (i != 0) {
                $focus.append('<hr />');
            }

            $focus.append('<h6 class="text-center">' + data.top.name[i] + '</h6><h6 class="text-primary text-center">' + data.top.ecoPoints[i] + '</h6>');
        });
    }
});

/* get today's challenges */
$.ajax({
    type: 'POST',
    url: 'assets/db/db.php',
    data: '&action=getTodayTask',
    dataType: 'json'
})
.done(function(data) {
    // console.log(data);  // Debugging Purpose
    if (data.success) {
        $('#challenges').find('#challengeContent').empty();

        var $focus = $('#challenges').find('#challengeContent');
        $.each(data.tasks, function(i) {
            if (i != 0) {
                $focus.append('<hr />');
            }

            $focus.append(data.tasks[i]);
        });
    }
});
