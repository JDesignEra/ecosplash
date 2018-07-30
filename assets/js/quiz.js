'use strict';

var sectionFocus = doc.querySelector('section#quiz'),
    uid = (localStorage.getItem('uid') ? localStorage.getItem('uid') : sessionStorage.getItem('uid'));

    var data = new FormData();
    data.append('action', 'getTodayQuiz');
    httpPost('./assets/db/db.php', data, function(data) {
        console.log(data);

        if (data.success) {
            sectionFocus.querySelector('#uName').innerHTML = data.quiz.uName;
            sectionFocus.querySelector('#quizName').innerHTML = data.quiz.name;

            if (uid) {
                sectionFocus.querySelector('#description').innerHTML = 'This quiz has <span class="text-primary font-weight-bold">' + data.quiz.questions.length + '</span> question and each correct question will award you with <span class="text-primary font-weight-bold">2</span> EcoPoints. And you are able to earn up to a maximum of <span class="text-primary font-weight-bold">' + data.quiz.ecoPoints + '</span> EcoPoints.';

                var btnFocus = sectionFocus.querySelector('.card-footer');
                btnFocus.innerHTML = '<button type="button" class="btn btn-primary btn-block start">Start Quiz</button>';

                /* populate questions card */
                httpGetDoc('./assets/templates/quiz/quiz_card.html', function(content) {
                    var temp = content.querySelector('.card').cloneNode(true);

                        for (var i = 0; i < data.quiz.questions.length; i++) {
                            var qCard = temp.cloneNode(true),
                                btnFocuses = qCard.querySelectorAll('button'),
                                radioInputs = qCard.querySelectorAll('.custom-radio');

                            qCard.querySelector('h4.qNo').innerHTML = 'Question ' + (i + 1);
                            qCard.querySelector('p.question').innerHTML = data.quiz.questions[i];

                            for (var x = 0; x < radioInputs.length; x++) {
                                var inputFocus = radioInputs[x].querySelector('input'),
                                    labelFocus = radioInputs[x].querySelector('label');

                                inputFocus.id = 'q' + i + 'o' + x;
                                labelFocus.setAttribute('for', 'q' + i + 'o' + x);
                                labelFocus.innerHTML = data.quiz.options[i][x];
                            }

                            btnFocuses.forEach(function(el) {
                                el.setAttribute('data-currentNo', i + 1);
                            });

                            if (i == 0 || i == data.quiz.questions.length - 1) {
                                btnFocuses[0].remove();
                            }

                            doc.querySelector('form#quizForm').appendChild(qCard);
                        }
                });

                btnFocus.onclick = function() {
                    sectionFocus.querySelector('#start').remove();
                }
            }
        }
    });

/* login btn toggle dropdown */
if (sectionFocus.querySelector('button.login') && doc.querySelector('#loginDropdown')) {
    sectionFocus.querySelector('button.login').onclick = function() {
        $('#loginDropdown + .dropdown-menu').dropdown('toggle');
    }
}
