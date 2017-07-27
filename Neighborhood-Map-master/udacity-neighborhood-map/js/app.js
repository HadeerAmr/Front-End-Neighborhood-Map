var content;
var markers = [];
var map;
var Places = [];
var client_ID = "JCUUPO1JFZG13AMHR0B5GFEJ2OD4LF1VILPUWW4Z3GPDQCK0";
var client_Secret ="SSN1YWMVYIXGSZHAWYYMBZPRPP0RYYJVVF0YTXVJHVIDB1FY";
var initMap = function() {
    var ctrl = this;
    this.mapOptions = {
        center: new google.maps.LatLng(51.4927042, -0.1776179),
        zoom: 11,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById('map'), ctrl.mapOptions);
    ko.applyBindings(ViewModel());
};

var Locations = [{
        name: 'Halepi',
        lat: 51.5113362,
        lng: -0.1830298
    },
    {
        name: 'Macellaio',
        lat: 51.4927042,
        lng: -0.1776179
    },
    {
        name: 'Peckham Bazaar',
        lat: 51.467838,
        lng: -0.061822
    },
    {
        name: 'Vaulty Towers',
        lat: 51.501095,
        lng: -0.1119812
    },
    {
        name: 'Nobu Restaurant & Bar',
        lat: 51.525047,
        lng: -0.0823814
    },
    {
        name: 'Drunch Regent\'s Park',
        lat: 51.5350387,
        lng: -0.1688866
    },
    {
        name: 'Sager + Wilde',
        lat: 51.5308766,
        lng: -0.0721514
    }

];

var getAddress = function(url) {
    $.getJSON(url, function(response) {
        placeLoad(response.response.venues);
    }).fail(function() {
        alert("There was an error with the Foursquare API call. ");
    });
}

for (var key in Locations) {
    getAddress('https://api.foursquare.com/v2/venues/search?client_id=' + client_ID +
        '&client_secret=' + client_Secret +
        '&v=20130815&m=foursquare&ll=' + Locations[key].lat + ',' + Locations[key].lng + '&query=' + Locations[key].name + '&intent=match');
}

var placeLoad = function(data) {
    var dataPlace = data[0];
    var ctrl = this;
    var latlng = new google.maps.LatLng(dataPlace.location.lat, dataPlace.location.lng);
    var marker = new google.maps.Marker({
        position: latlng,
        map: map,
        title: dataPlace.name
    });
    this.contentString = '<div class="info-window"><div class="name"><b>' + dataPlace.name + "</b></div>" +
        '<div class="info-content">' + dataPlace.location.lat + '-' + dataPlace.location.lng + "</div>" +
        '<div class="info-content">' + dataPlace.location.state + "</div>" +
        '<div class="info-content">' + dataPlace.location.city + "</div></div>" +
        '<div class="info-content">' + dataPlace.location.address + ',' + dataPlace.location.state + "</div></div>";
    var window = new google.maps.InfoWindow({ content: ctrl.contentString });
    marker.infowindow = window;
    markers.push(marker);
    markers()[markers().length - 1].marker = marker;

    google.maps.event.addListener(marker, 'click', function() {
        for (var i = 0; i < markers.length; i++) {
            markers[i].infowindow.close();
        }
        window.open(map, marker);

    });
};

function ViewModel() {
    var self = this;
    self.map = ko.observable(map);
    self.markers = ko.observableArray(markers);
    self.query = ko.observable('');
    self.filtermarker = ko.computed(function() {
        var search = this.query().toLowerCase();
        return ko.utils.arrayFilter(self.markers(), function(mark) {
            if (mark.title.toLowerCase().indexOf(self.query().toLowerCase()) !== -1) {
                console.log(mark);
                if (mark.marker)
                    mark.marker.setMap(self.map());
            } else {
                if (mark.marker)
                    mark.marker.setMap(null);
            }
            return mark.title.toLowerCase().indexOf(search) >= 0;
        });
    });
    self.popInfo = function(markerIs) {
        google.maps.event.trigger(markerIs.marker, "click");
    };
};