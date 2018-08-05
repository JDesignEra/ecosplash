'use strict'

if (localStorage.getItem('accType') || sessionStorage.getItem('accType')) {
    /* update daily challenges btn */
    var btn = doc.createElement('a');
    btn.classList.add('btn', 'btn-primary', 'btn-block', 'mt-3');
    btn.href = './profile';
    btn.innerHTML = 'Update Your Daily Challenges';

    doc.querySelector('#challenges .card-body').appendChild(btn);

    /* carousel signup btn */
    var carouselSignups = doc.querySelectorAll('#carousel .carousel-item a[href="./signup"]');
    carouselSignups.forEach(function(el) {
        el.classList.add('d-none');
    });
}

/* today's weather */
/*
httpGet('https://dataservice.accuweather.com/currentconditions/v1/300597?apikey=CAWQjoOpwTwnuOVCHwTaYy2lus6hFTTh', function(data) {
    // console.log(data[0]);  // Debugging Purpose
    if (data[0]) {
        var focus = doc.querySelector('#weather #weatherContent'),
            weatherText = doc.createElement('p'),
            weatherImg = doc.createElement('img'),
            weatherTemp = doc.createElement('h4');

        weatherImg.src = './assets/img/weather_icons/' + data[0].WeatherIcon + '.svg';

        weatherTemp.innerHTML = data[0].Temperature.Metric.Value + '&deg;' + data[0].Temperature.Metric.Unit;
        weatherTemp.classList.add('text-center', 'text-primary');

        weatherText.innerHTML = data[0].WeatherText;
        weatherText.className = 'text-center';

        focus.innerHTML = '';
        focus.appendChild(weatherImg);
        focus.appendChild(weatherTemp);
        focus.appendChild(weatherText);
    }
});
*/

/* recent upcoming events (10 dates) */
var data = new FormData();
data.append('action', 'getRecentEvents');

httpPost('./assets/db/db.php', data, function(data) {
    // console.log(data);  // Debugging Purpose
    var focus = doc.querySelector('#upcomingEvents #upcomingEventsContent');
    if (data.success) {
        focus.innerHTML = '';

        var i = 0;
        for (var date in data.events) {
            if (i != 0) {
                var hr = doc.createElement('hr');
                focus.appendChild(hr);
            }

            var h4Date = doc.createElement('h4');
            h4Date.classList.add('text-secondary', 'pb-3');
            h4Date.innerHTML = date;

            focus.appendChild(h4Date);

            for (var event in data.events[date]) {
                var pEvent = doc.createElement('p');
                pEvent.innerHTML = '<span class="font-weight-bold text-primary">' + data.events[date][event].event + '</span> at <span class="font-weight-bold text-primary">' + data.events[date][event].time + '</span> located at <a class="font-weight-bold text-secondary" href="./find_event/?postal=' + data.events[date][event].postal + '">' + data.events[date][event].location + '</a></p>';

                focus.appendChild(pEvent);
                i++;
            }
        }

        var btn = doc.createElement('a');
        btn.classList.add('btn', 'btn-primary', 'btn-block');
        btn.innerHTML = 'View All Upcoming Events';
        btn.href = './events';

        focus.appendChild(btn);
    }
});

/* today's quiz */
var data = new FormData();
data.append('action', 'getTodayQuiz');

httpPost('./assets/db/db.php', data, function(data) {
    // console.log(data);  // Debugging Purpose
    var focus = doc.getElementById('todayQuiz');
    if (data.success) {
        focus.querySelector('#quizName').innerHTML = data.quiz.name;
        focus.querySelector('#name').innerHTML = data.quiz.uName;
        focus.querySelector('#questionNo').innerHTML = data.quiz.questions.length;
        focus.querySelector('#ecoPoints').innerHTML = data.quiz.ecoPoints;
    }
});

/* top 5 of the month */
var data = new FormData();
data.append('action', 'getTopEcoPoints');

httpPost('./assets/db/db.php', data, function(data) {
    // console.log(data);  // Debugging Purpose
    var focus = doc.querySelector('#topMonth #topMonthContent');
    focus.innerHTML = '';

    for (var i in data.top) {
        if (i != 0) {
            var hr = doc.createElement('hr');
            focus.appendChild(hr);
        }

        var h6Name = doc.createElement('h6');
        h6Name.className = 'text-center';
        h6Name.innerHTML = data.top[i].name;

        focus.appendChild(h6Name);

        var h6EcoPoints = h6Name.cloneNode();
        h6EcoPoints.classList.add('text-primary');
        h6EcoPoints.innerHTML = data.top[i].ecoPointsMonth;

        focus.appendChild(h6EcoPoints);
    }
});

/* get today's challenges */
var data = new FormData();
data.append('action', 'getTodayTask');

httpPost('./assets/db/db.php', data, function(data) {
    // console.log(data);  // Debugging Purpose;
    if (data.success) {
        var focus = doc.querySelector('#challenges #challengeContent');
        focus.innerHTML = '';

        for (var i in data.tasks) {
            if (i != 0) {
                var hr = doc.createElement('hr');
                focus.appendChild(hr);
            }

            var task = doc.createTextNode(data.tasks[i]);
            focus.appendChild(task);
        }
    }
});
