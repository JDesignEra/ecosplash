"use strict";
var eventMarker,
    userMarker;

/* populate mapbox */
mapboxgl.accessToken = 'pk.eyJ1IjoiamRlc2lnbmVyYSIsImEiOiJjamk5bHB5aWcweHRpM3BsZHhlbHFpbXNkIn0.HGGX342G2_IlaMEkFyF1qg';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v10',
    center: [103.8, 1.35],
    zoom: 11
});

/* add control and buildings */
map.addControl(new mapboxgl.NavigationControl());
map.on('load', function() {
    var layers = map.getStyle().layers,
    labelLayerId;

    for (var i = 0; i < layers.length; i++) {
        if (layers[i].type === 'symbol' && layers[i].layout['text-field']) {
            labelLayerId = layers[i].id;
            break;
        }
    }

    map.addLayer({
        'id': '3d-buildings',
        'source': 'composite',
        'source-layer': 'building',
        'filter': ['==', 'extrude', 'true'],
        'type': 'fill-extrusion',
        'minzoom': 15,
        'paint': {
            'fill-extrusion-color': '#13547A',
            'fill-extrusion-height': [
                "interpolate", ["linear"], ["zoom"],
                15, 0,
                15.05, ["get", "height"]
            ],
            'fill-extrusion-base': [
                "interpolate", ["linear"], ["zoom"],
                15, 0,
                15.05, ["get", "min_height"]
            ],
            'fill-extrusion-opacity': .6
        }
    }, labelLayerId);
});

/* get current location & set your marker */
if (navigator.geolocation) {
    doc.querySelector('.feedback').classList.add('d-none');

    if (userMarker) {
        userMarker.remove();
    }

    var icon = doc.createElement('i');
    icon.classList.add('fas', 'fa-street-view', 'fa-4x', 'text-secondary');

    userMarker = new mapboxgl.Marker({
        element: icon,
        color: '#4DB6AC'
    })
    .setLngLat([103.8, 1.35])
    .addTo(map);

    var centerUserOnce = true;
    navigator.geolocation.watchPosition(function(pos) {
        var lat = pos.coords.latitude,
            lng = pos.coords.longitude;

        if (centerUserOnce) {
            map.setCenter([lng, lat]);
            map.setZoom(16);
            map.setPitch(55);
            map.setBearing(-20);
            centerUserOnce = false;
        }

        userMarker.setLngLat([lng, lat]);

        var btnFocus = doc.querySelector('button#zoomMe');
        btnFocus.setAttribute('data-lng', lng);
        btnFocus.setAttribute('data-lat', lat);

        btnFocus.onclick = function() {
            map.flyTo({ center: [this.getAttribute('data-lng'), this.getAttribute('data-lat')] });
        }

        /* if url parmeter exist */
        var postal = (window.location.href.indexOf('?') != -1 ? window.location.href.split('?')[1].split('=')[1] : '');
        if (postal) {
            window.history.replaceState({}, document.title, './display_code/');
            setEventMarker(postal);
        }

        /* attempt to draw direction (delay for event lng & lat before drawing) */
        setTimeout(function () {
            var eventLng = doc.querySelector('button#zoomEvent').getAttribute('data-lng'),
                eventLat = doc.querySelector('button#zoomEvent').getAttribute('data-lat');

            if (lng && lat && eventLng && eventLat) {
                drawDirection(lng, lat, eventLng, eventLat);
            }
        }, 2500);
    });
}
else {
    doc.querySelector('.feedback').classList.remove('d-none');
}

/* find event on click */
addWindowOnload(function() {
    var focus = doc.querySelector('#findEvent')
    focus.querySelector('button').onclick = function() {
        setEventMarker(focus.querySelector('input').value);

        setTimeout(function () {
            var userLng = doc.querySelector('button#zoomMe').getAttribute('data-lng'),
                userLat = doc.querySelector('button#zoomMe').getAttribute('data-lat'),
                eventLng = doc.querySelector('button#zoomEvent').getAttribute('data-lng'),
                eventLat = doc.querySelector('button#zoomEvent').getAttribute('data-lat');

            if (userLng && userLat && eventLng && eventLat) {
                drawDirection(userLng, userLat, eventLng, eventLat);
            }
        }, 500);
    }
});

/* set event marker function */
function setEventMarker(postal) {
    httpGet('https://maps.googleapis.com/maps/api/geocode/json?address=' + postal + '&sensor=true', function(data) {
        // console.log(data);  // Debugging Purpose
        if (data.status = 'OK') {
            if (eventMarker) {
                eventMarker.remove();
            }

            var lng = data.results[0].geometry.location.lng,
                lat = data.results[0].geometry.location.lat;

            eventMarker = new mapboxgl.Marker({
                color: '#DC3545'
            })
            .setLngLat([lng, lat])
            .addTo(map);

            var btnFocus = doc.querySelector('button#zoomEvent');
            btnFocus.setAttribute('data-lng', lng);
            btnFocus.setAttribute('data-lat', lat);

            btnFocus.onclick = function() {
                map.flyTo({ center: [this.getAttribute('data-lng'), this.getAttribute('data-lat')] });
            }
        }
    });
}

/* map draw direction function */
function drawDirection(fromLng, fromLat, toLng, toLat) {
    if (map.getSource('route')) {
        map.removeLayer('route')
        map.removeSource('route')
    }

    httpGet(
        'https://api.mapbox.com/directions/v5/mapbox/driving/' + fromLng + ',' + fromLat + ';' + toLng + ',' + toLat + '?geometries=geojson&steps=true&access_token=pk.eyJ1IjoiamRlc2lnbmVyYSIsImEiOiJjamk5bHB5aWcweHRpM3BsZHhlbHFpbXNkIn0.HGGX342G2_IlaMEkFyF1qg',
        function(data) {
            // console.log(data);  // Debugging Purpose
            if (data.code == 'Ok') {
                if (map.loaded()) {
                    map.addLayer({
                        "id": "route",
                        "type": "line",
                        "source": {
                            "type": "geojson",
                            "data": {
                                "type": "Feature",
                                "properties": {},
                                "geometry": data.routes[0].geometry
                            }
                        },
                        "layout": {
                            "line-join": "round",
                            "line-cap": "round"
                        },
                        "paint": {
                            "line-color": "#13547A",
                            "line-width": 10
                        }
                    });
                }
            }
        }
    );
}
