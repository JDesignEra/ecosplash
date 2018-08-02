"user strict";
securePage(1);

var uid = uid = (localStorage.getItem('uid') ? localStorage.getItem('uid') : sessionStorage.getItem('uid')),
    sectionFocus = doc.querySelector('section#quizList');

/* populate table */
var data = new FormData();
data.append('uid', uid);
data.append('action', 'getQuizzesList');

httpPost('./assets/db/db.php', data, function(data) {
    // console.log(data);  // Debugging Purpose
    if (data.success) {
        var focus = sectionFocus.querySelector('.card-body #quiz-table');
        focus.innerHTML = '';

        httpGetDoc('./assets/templates/quiz_list/quiz_table.html', function(content) {
            for (var k in data.quizzesList) {
                var h4Date = content.querySelector('h4').cloneNode(),
                    table = content.querySelector('.table-responsive').cloneNode(true);

                h4Date.innerHTML = k;
                table.querySelector('tbody').innerHTML = '';

                var tbodyFocus = table.querySelector('tbody');
                data.quizzesList[k].forEach(function(qv) {
                    var row = content.querySelector('tbody tr').cloneNode(true),
                        td = row.querySelectorAll('td');

                    td[0].innerHTML = qv.name;
                    td[1].innerHTML = qv.qNo;
                    td[2].innerHTML = qv.ecoPoints;

                    /* view more btn */
                    var btnFocus = td[3].querySelector('button');
                    btnFocus.setAttribute('data-id', qv.qid);

                    btnFocus.onclick = function() {
                        var qid = this.getAttribute('data-id'),
                            data = new FormData();

                        data.append('uid', uid);
                        data.append('qid', qid);
                        data.append('action', 'getQuizList');

                        httpPost('./assets/db/db.php', data, function(data) {
                            // console.log(data);  // Debugging Purpose
                            if (data.success) {
                                httpGetDoc('./assets/templates/quiz_list/quiz_list.html', function(content) {
                                    var modal = doc.getElementById('view-more-modal');
                                    modal.querySelector('.modal-body').innerHTML = content.querySelector('body').innerHTML;
                                    modal.querySelector('.modal-body table tbody').innerHTML = '';
                                    modal.querySelector('.modal-header .modal-title').innerHTML = '# ' + data.qid + ': ' + data.name + ' (' + data.date + ')';

                                    data.questions.forEach(function(qv, qi) {
                                        var questionRow = content.querySelector('tbody tr.questionRow').cloneNode(true);
                                        questionRow.querySelector('th').innerHTML = qv;

                                        modal.querySelector('table tbody').appendChild(questionRow);

                                        var optionRow;
                                        data.options.splice(0, 4).forEach(function(ov, oi) {
                                            if (oi % 2 == 0) {  // create new row
                                                optionRow = content.querySelector('tbody tr.optionRow').cloneNode(true);
                                                optionRow.querySelectorAll('td.option')[0].innerHTML = ov;
                                            }
                                            else {  // add created row
                                                optionRow.querySelectorAll('td.option')[1].innerHTML = ov;
                                                modal.querySelector('table tbody').appendChild(optionRow);
                                            }
                                        });

                                        var focusAns = modal.querySelectorAll('.modal-body table tbody td.answer'),
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
                    }

                    tbodyFocus.appendChild(row);
                });

                focus.appendChild(h4Date);
                focus.appendChild(table);
            }
        });
    }
});

/* new quiz btn onclick */
sectionFocus.querySelector('#newQuiz').onclick = function() {
    this.classList.add('fadeOut', 'short');

    this.addEventListener(animationEnd, function _func() {
        this.classList.add('d-none');
        this.classList.remove('fadeOut', 'short');
        sectionFocus.querySelector('form#addQuizForm').classList.remove('d-none');

        this.removeEventListener(animationEnd, _func);
    });
}

/* add question btn onclick */
var formFocus = sectionFocus.querySelector('form#addQuizForm'),
    formSet = formFocus.querySelector('.formQset').cloneNode(true);

formSet.classList.add('fadeIn');

formFocus.querySelector('button#addQ').onclick = function() {
    var questionSet = formSet.cloneNode(true),
        optionsFocus = questionSet.querySelectorAll('.input-group'),
        count = formFocus.querySelectorAll('.formQset').length;

    questionSet.querySelector('h5').innerHTML = 'Question ' + (count + 1);
    questionSet.querySelector('#question').id = 'question-' + count;
    questionSet.querySelector('input#q-question').id = 'q-question-' + count;
    questionSet.querySelector('label[for=q-question]').setAttribute('for', 'q-question-' + count);

    optionsFocus.forEach(function(el, ei) {
        var radioFocus = el.querySelector('input[type=radio]');
        radioFocus.name = 'answers[' + count +']';
        radioFocus.id = 'q' + count + '-ans' + ei;

        el.querySelector('label[for=q0-ans' + ei + ']').setAttribute('for', 'q' + count + '-ans' + ei);
        el.querySelector('input[type=text]').name = 'options[' + count + '][]';
    });

    formFocus.querySelector('#formQuestions').appendChild(questionSet);
}

/* addQuizForm onsubmit */
sectionFocus.querySelector('form#addQuizForm').onsubmit = function(e) {
    e.preventDefault();

    var formFocus = this,
        data = new FormData(this);

    data.append('uid', (uid ? uid : ''));
    data.append('action', 'addQuiz');

    httpPost('./assets/db/db.php', data, function(data) {
        // console.log(data);  // Debugging Purpose
        var focus = formFocus.querySelectorAll('.is-invalid', 'is-valid');

        focus.forEach(function(el) {
            el.classList.remove('is-invalid', 'is-valid');
        });

        if (data.success) {
            var modal = doc.getElementById('formSuccessModal');
            $(modal).on('shown.bs.modal', function() {
                setTimeout(function () {
                    $(modal).modal('hide');
                }, 5000);
            });

            $(modal).on('hide.bs.modal', function() {
                location.href = './events_list';
            });

            $(modal).modal('show');
        }
        else if (data.errors) {
            if (data.errors.answers) {
                if (typeof data.errors.answers == 'string') {
                    var focus = formFocus.querySelectorAll('input[type=radio]');
                    focus.forEach(function(el) {
                        el.classList.add('is-invalid');
                    });
                }
                else {
                    for (var k in data.errors.answers) {
                        var focus = formFocus.querySelectorAll('input[name="answers[' + k + ']"]');

                        focus.forEach(function(el) {
                            el.classList.add('is-invalid');
                        });
                    }
                }
            }

            if (data.errors.options) {
                if (typeof data.errors.options == 'string') {
                    var focus = formFocus.querySelectorAll('input.option');
                    focus.forEach(function(el) {
                        el.classList.add('is-invalid');
                    });
                }
                else {
                    for (var key in data.errors.options) {
                        for (var k in data.errors.options[key]) {
                            var focus = formFocus.querySelectorAll('input[name="options[' + key + '][]"]');

                            focus.forEach(function(el, ei) {
                                if (ei == k) {
                                    el.classList.add('is-invalid');

                                    var feedbackFocus = formFocus.querySelectorAll('input[name="options[' + key + '][]"] + .feedback');
                                    feedbackFocus[ei].innerHTML = data.errors.options[key][k];
                                }
                            });
                        }
                    }
                }
            }

            if (data.errors.questions) {
                if (typeof data.errors.options == 'string') {
                    var focus = formFocus.querySelectorAll('.form-label-group.question');

                    focus.forEach(function(el) {
                        el.querySelector('input').classList.add('is-invalid');
                        el.querySelector('.feedback').innerHTML = data.errors.questions;
                    });
                }
                else {
                    var focus = formFocus.querySelectorAll('.form-label-group.question');

                    for (var k in data.errors.questions) {
                        focus[k].querySelector('input').classList.add('is-invalid');
                        focus[k].querySelector('.feedback').innerHTML = data.errors.questions[k];
                    }
                }
            }

            var focus = formFocus.querySelectorAll('input[type=text]:not(.is-invalid)');
            focus.forEach(function(el) {
                el.classList.add('is-valid');
            });
        }
    });
}
