'use strict';
securePage(0);

var sectionFocus = doc.querySelector('section#quiz'),
    uid = (localStorage.getItem('uid') ? localStorage.getItem('uid') : sessionStorage.getItem('uid'));

var data = new FormData();
data.append('action', 'getTodayQuiz');
httpPost('./assets/db/db.php', data, function(data) {
    console.log(data);
});
