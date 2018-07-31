'use strict';

var sectionFocus = doc.querySelector('section#quiz'),
    uid = (localStorage.getItem('uid') ? localStorage.getItem('uid') : sessionStorage.getItem('uid'));

/* populate quiz */
var data = new FormData();
data.append('action', 'getTodayQuiz');
httpPost('./assets/db/db.php', data, function(data) {
    console.log(data);

    if (data.success) {
        sectionFocus.querySelector('#uName').innerHTML = data.quiz.uName;
        sectionFocus.querySelector('#quizName').innerHTML = data.quiz.name;

        if (uid) {
            sectionFocus.querySelector('#description').innerHTML = 'This quiz has <span class="text-primary font-weight-bold">' + data.quiz.questions.length + '</span> question and each correct question will award you with <span class="text-primary font-weight-bold">' + data.quiz.ecoPoints / data.quiz.questions.length + '</span> EcoPoints. And you are able to earn up to a maximum of <span class="text-primary font-weight-bold">' + data.quiz.ecoPoints + '</span> EcoPoints.';

            /* start quiz btn */
            var btnFocus = sectionFocus.querySelector('.card-footer');
            btnFocus.innerHTML = '<button type="button" class="btn btn-primary btn-block start">Start Quiz</button>';

            btnFocus.onclick = function() {
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

                        inputFocus.name = 'answers[' + i + ']';
                        inputFocus.value = x;
                        inputFocus.id = 'q' + i + 'o' + x;
                        labelFocus.setAttribute('for', 'q' + i + 'o' + x);
                        labelFocus.innerHTML = data.quiz.options[i][x];
                    }

                    btnFocuses.forEach(function(el) {
                        el.setAttribute('data-number', i);
                    });

                    /* remove previous btn */
                    if (i == 0) {
                        btnFocuses[0].parentElement.remove();
                    }

                    /* next btn to submit */
                    if (i == data.quiz.questions.length - 1) {
                        btnFocuses[1].type = 'submit';
                        btnFocuses[1].classList.remove('btn-primary');
                        btnFocuses[1].classList.add('btn-success');
                        btnFocuses[1].innerHTML = 'Submit';
                    }

                    /* previous btn onclick animation */
                    btnFocuses[0].onclick = function() {
                        if (this.type == 'button' && this.getAttribute('data-number') != 0) {
                            var cardsFocus = doc.querySelectorAll('.card:not(#start)'),
                                i = parseInt(this.getAttribute('data-number'));

                            cardsFocus.forEach(function(el) {
                                el.removeEventListener(animationEnd, function(){});
                            });

                            if (this.type == 'button') {
                                cardsFocus[i].classList.add('fadeOutLeft', 'short');

                                cardsFocus[i].addEventListener(animationEnd, function _func() {
                                    this.classList.add('d-none');
                                    this.classList.remove('fadeOutLeft', 'short');

                                    cardsFocus[i - 1].classList.remove('d-none');
                                    cardsFocus[i - 1].classList.add('fadeInRight', 'short');

                                    this.removeEventListener(animationEnd, _func);
                                    cardsFocus[i - 1].addEventListener(animationEnd, function _func() {
                                        this.classList.remove('fadeInRight', 'short');
                                        this.removeEventListener(animationEnd, _func);
                                    });

                                    this.removeEventListener(animationEnd, _func);
                                });
                            }
                        }
                    }

                    /* next btn onclick animation */
                    btnFocuses[1].onclick = function() {
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
    }
});

/* quiz form submit */
sectionFocus.querySelector('form#quizForm').onsubmit = function(e) {
    e.preventDefault();

    var data = new FormData(this);
    data.append('uid', (uid ? uid : ''));
    data.append('action', 'submitQuiz');
    httpPost('./assets/db/db.php', data, function(data) {
        console.log(data);
    });
}
