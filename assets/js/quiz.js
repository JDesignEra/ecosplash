"user strict";

var sectionFocus = doc.querySelector('section#quiz'),
    accType = (localStorage.getItem('accType') ? localStorage.getItem('accType') : sessionStorage.getItem('accType')),
    uid = (localStorage.getItem('uid') ? localStorage.getItem('uid') : sessionStorage.getItem('uid'));

/* populate quiz */
var data = new FormData();
data.append('action', 'getTodayQuiz');
httpPost('./assets/db/db.php', data, function(data) {
    // console.log(data);

    if (data.success) {
        sectionFocus.querySelector('#uName').innerHTML = data.quiz.uName;
        sectionFocus.querySelector('#quizName').innerHTML = data.quiz.name;

        if (uid) {
            sectionFocus.querySelector('#description').innerHTML = 'This quiz has <span class="text-primary font-weight-bold">' + data.quiz.questions.length + '</span> question and each correct question will award you with <span class="text-primary font-weight-bold">' + data.quiz.ecoPoints / data.quiz.questions.length + '</span> EcoPoints. And you are able to earn up to a maximum of <span class="text-primary font-weight-bold">' + data.quiz.ecoPoints + '</span> EcoPoints.';

            /* start quiz btn */
            var cardFooterFocus = sectionFocus.querySelector('.card-footer'),
                formData = new FormData();

            formData.append('uid', (uid ? uid : ''));
            formData.append('action', 'getUserQuizStatus');

            if (accType == 0) {
                /* start btn or attempted btn */
                httpPost('./assets/db/db.php', formData, function(data) {
                    // console.log(data);  // Debugging Purpose
                    if (data.status) {
                        cardFooterFocus.innerHTML = '<button type="button" class="btn btn-primary btn-block">Start Quiz</button>';

                        cardFooterFocus.onclick = function() {
                            var focus = this.parentElement;
                            focus.classList.add('fadeOut', 'short');

                            focus.addEventListener(animationEnd, function _func() {
                                focus.classList.add('d-none');

                                focus = sectionFocus.querySelector('.card:not(#start)');
                                focus.classList.remove('d-none');
                                focus.classList.add('bounceIn', 'short');

                                focus.addEventListener(animationEnd, function _func() {
                                    focus.classList.remove('bounceIn', 'short');
                                    this.removeEventListener(animationEnd, _func);
                                });

                                this.removeEventListener(animationEnd, _func);
                            });
                        }
                    }
                    else {
                        cardFooterFocus.innerHTML = '<button type="button" class="btn btn-danger btn-block">Quiz Attempted</button>';
                    }
                });
            }
            else {
                cardFooterFocus.innerHTML = '<button type="button" class="btn btn-danger btn-block">Organization Can\'t Take Quiz</button>';
            }

            /* populate questions card */
            httpGetDoc('./assets/templates/quiz/quiz_card.html', function(content) {
                var temp = content.querySelector('.card').cloneNode(true);

                for (var i = 0; i < data.quiz.questions.length; i++) {
                    var qCard = temp.cloneNode(true),
                        cardFooterFocuses = qCard.querySelectorAll('button'),
                        radioInputs = qCard.querySelectorAll('.custom-radio');

                    qCard.querySelector('h4.qNo').innerHTML = 'Question ' + (i + 1);
                    qCard.querySelector('p.question').innerHTML = data.quiz.questions[i];

                    for (var x = 0; x < radioInputs.length; x++) {
                        var inputFocus = radioInputs[x].querySelector('input'),
                            labelFocus = radioInputs[x].querySelector('label');

                        inputFocus.name = 'answers[' + i + ']';
                        inputFocus.value = x;
                        inputFocus.id = 'q' + i + 'o' + x;
                        labelFocus.setAttribute('for', 'q' + i + 'o' + x);
                        labelFocus.innerHTML = data.quiz.options[i][x];
                    }

                    cardFooterFocuses.forEach(function(el) {
                        el.setAttribute('data-number', i);
                    });

                    /* remove previous btn */
                    if (i == 0) {
                        cardFooterFocuses[0].parentElement.remove();
                    }

                    /* next btn to submit */
                    if (i == data.quiz.questions.length - 1) {
                        var feedback = doc.createElement('p');
                        feedback.classList.add('feedback', 'text-danger', 'small', 'text-center', 'mb-0', 'pt-4', 'fadeIn', 'd-none');

                        cardFooterFocuses[1].type = 'submit';
                        cardFooterFocuses[1].classList.remove('btn-primary');
                        cardFooterFocuses[1].classList.add('btn-success');
                        cardFooterFocuses[1].innerHTML = 'Submit';

                        qCard.querySelector('.card-body').appendChild(feedback);
                    }

                    /* previous btn onclick animation */
                    cardFooterFocuses[0].onclick = function() {
                        if (this.type == 'button' && this.getAttribute('data-number') != 0) {
                            var cardsFocus = doc.querySelectorAll('.card:not(#start)'),
                                i = parseInt(this.getAttribute('data-number'));

                            if (this.type == 'button') {
                                cardsFocus[i].classList.add('fadeOutRight', 'short');

                                cardsFocus[i].addEventListener(animationEnd, function _func() {
                                    this.classList.add('d-none');
                                    this.classList.remove('fadeOutRight', 'short');

                                    cardsFocus[i - 1].classList.remove('d-none');
                                    cardsFocus[i - 1].classList.add('fadeInLeft', 'short');

                                    this.removeEventListener(animationEnd, _func);
                                    cardsFocus[i - 1].addEventListener(animationEnd, function _func() {
                                        this.classList.remove('fadeInLeft', 'short');
                                        this.removeEventListener(animationEnd, _func);
                                    });

                                    this.removeEventListener(animationEnd, _func);
                                });
                            }
                        }
                    }

                    /* next btn onclick animation */
                    cardFooterFocuses[1].onclick = function() {
                        var cardsFocus = doc.querySelectorAll('.card:not(#start)'),
                            i = parseInt(this.getAttribute('data-number'));

                        if (this.type == 'button') {
                            cardsFocus[i].classList.add('fadeOutLeft', 'short');

                            cardsFocus[i].addEventListener(animationEnd, function _func() {
                                this.classList.add('d-none');
                                this.classList.remove('fadeOutLeft', 'short');

                                cardsFocus[i + 1].classList.remove('d-none');
                                cardsFocus[i + 1].classList.add('fadeInRight', 'short');

                                this.removeEventListener(animationEnd, _func);
                                cardsFocus[i + 1].addEventListener(animationEnd, function _func() {
                                    this.classList.remove('fadeInRight', 'short');
                                    this.removeEventListener(animationEnd, _func);
                                });

                                this.removeEventListener(animationEnd, _func);
                            });
                        }
                    }

                    doc.querySelector('form#quizForm').appendChild(qCard);
                }
            });
        }
        else if (uid == 1) {

        }
    }
});

/* quiz form submit */
sectionFocus.querySelector('form#quizForm').onsubmit = function(e) {
    e.preventDefault();

    var formFocus = this,
        data = new FormData(formFocus);

    data.append('uid', (uid ? uid : ''));
    data.append('action', 'submitQuiz');

    httpPost('./assets/db/db.php', data, function(data) {
        // console.log(data);  // Debugging Purpose
        var feedbackFocus = formFocus.querySelector('.feedback');
        feedbackFocus.classList.add('d-none');

        if (data.success) {
            var modal = doc.getElementById('successModal'),
                progressBars = modal.querySelectorAll('.modal-body .progress-bar');

            progressBars[0].innerHTML = data.score + ' / ' + data.maxScore;
            progressBars[0].style.width = (data.score / data.maxScore) * 100 + '%';
            progressBars[0].classList.add(data.score < data.maxScore / 2 ? 'bg-danger' : 'bg-success');

            progressBars[1].innerHTML = data.ecoPoints + ' / ' + data.maxEcoPoints;
            progressBars[1].style.width = (data.ecoPoints / data.maxEcoPoints) * 100 + '%';
            progressBars[1].classList.add(data.ecoPoints < data.maxEcoPoints / 2 ? 'bg-danger' : 'bg-success');

            $(modal).on('hide.bs.modal', function() {
                location.href = './quiz';
            });

            $(modal).modal('show');
        }
        else if (data.errors) {
            if (data.errors.questions) {
                feedbackFocus.innerHTML = data.errors.questions;
                feedbackFocus.classList.remove('d-none');
            }
        }
    });
}
