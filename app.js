'use strict';

var fs = require('fs');
var http = require('http');
var async = require('async');

var HERE_APP_ID = ''; // Add App id here
var HERE_APP_CODE = ''; // Add App code here
var HERE_REVERSE_GEOCODE_ENDPOINT = 'http://reverse.geocoder.api.here.com/6.2/reversegeocode.json';

var dataObj;

function addMetaData (aPOI, callback) {
    var queryString = HERE_REVERSE_GEOCODE_ENDPOINT +
        '?prox=' +
        aPOI.Latitude + ',' +
        aPOI.Longitude +
        '%2C150' + '&' +
        'mode=retrieveAreas' + '&' +
        'maxresults=1' + '&' +
        'gen=6' + '&' +
        'app_id=' + HERE_APP_ID + '&' +
        'app_code=' + HERE_APP_CODE;

    function hereCallback (res) {
        var body = '';

        res.on('data', function(chunk) {
            body += chunk;
        });

        res.on('end', function() {
            var response = JSON.parse(body).Response;
            aPOI.AddressDetails = response.View[0].Result[0].Location.Address;
            callback(null, aPOI);
        });
    }

    http.get(queryString, hereCallback).on('error', function (err) {
        throw err;
    });
}

function saveData (aData) {
    var fileNameRoot = process.argv[2].replace(/\.[^/.]+$/, '');
    fs.writeFile(fileNameRoot + 'Augmented.json', JSON.stringify(aData, null, 2), function (err) {
        if (err) {
            throw err;
        } else {
            console.log('Data saved as: ' + fileNameRoot + 'Augmented.json');
        }
    });
}

function augmentData () {
    async.map(dataObj.pois, addMetaData, function (err, results) {
        if(!err) {
            dataObj.pois = results;
            saveData(dataObj);
        } else {
            throw err;
        }
    });
}

function parseExternalJSON () {
    fs.readFile(process.argv[2], 'utf8', function (err, data) {
        if (err) {
            throw err;
        } else {
            dataObj = JSON.parse(data);
            // call the Here api for augmentation
            augmentData();
        }
    });
}

parseExternalJSON();
