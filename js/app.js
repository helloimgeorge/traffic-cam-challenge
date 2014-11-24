// List of Seattle Traffic Cameras
// http://data.seattle.gov/resource/65fc-btcc.json

"use strict";

$(document).ready(function() {
    var allMarkers = [];
    var mapElem = document.getElementById('map');
    var center = {
        lat: 47.6,
        lng: -122.3
    };
    var map = new google.maps.Map(mapElem, {
        center: center,
        zoom: 12
    });

    var infoWindow = new google.maps.InfoWindow(); // information window

    $.getJSON('https://data.seattle.gov/resource/65fc-btcc.json')
        .done(function (data) {

            data.forEach(function (camera) { // create each existing marker
                var marker = new google.maps.Marker({
                    position: {
                        lat: Number(camera.location.latitude),
                        lng: Number(camera.location.longitude)
                    },
                    map: map
                });

                marker['cameraLabel'] = '' + camera.cameralabel;
                allMarkers.push(marker); // pushes marker into array

                google.maps.event.addListener(marker, 'click', function () {
                    map.panTo(this.getPosition()); // pan to location clicked

                    var html = '<h2>' + camera.cameralabel + '</h2>'; // html based off station name appended
                    html += '<img src=' + camera.imageurl.url + '>' + '</img>'; // append address
                    infoWindow.setContent(html);
                    infoWindow.open(map, this); // this refers to the element that raised the event, in this case the 'marker'
                    // this is useful because if it was just labeled 'marker' instead, it would attach to the last iteration of the for loop
                    // but this changes within each cycle

                });
            });
        }) // done
        .fail(function (error) {
            console.log(error); // shows error
        }) // fail
        .always(function () { // turn off ajax spider
            $('#ajax-loader').fadeOut(); // makes the loading icon disappear

        }); // always

    $('body').on('keyup', '#search', function () {

        allMarkers.forEach(function (marker) {
            var cameraName = marker.cameraLabel.toLowerCase();
            var searchString = $('#search').val().toLowerCase();

            if (cameraName.indexOf(searchString) == -1) {
                marker.setMap(null);
            } else {
                marker.setMap(map);
            }
        })
    });
});