locAugment
==========

Node.js tool for enhancing location information.

Simple node.js based utility for adding address details to an array of Lat/Long POIs.

## Input format

The utility expects data in the following form:
```
{
  "pois": [{
    "Longitude": -1.2628915,
    "Latitude": 54.5530867
  }]
}
```

where "pois" is an array of Lat/Long objects.

## Usage


Simply pass in the name of the raw data file that you want to have processed, eg:

`node app.js exampleRaw.json`

This will write out a JSON file with 'Augmented' appended to the original file name, eg:

`exampleRawAugmented.json`

For the example above.

## Output

The output will look something like this:

```
{
  "pois": [{
    "Longitude": -1.2628915,
    "Latitude": 54.5530867,
    "AddressDetails": {
      "Label": "Linthorpe, Middlesbrough, England, United Kingdom",
      "Country": "GBR",
      "State": "England",
      "County": "Cleveland",
      "City": "Middlesbrough",
      "District": "Linthorpe",
      "PostalCode": "TS5 5",
      "AdditionalData": [
        {
          "value": "United Kingdom",
          "key": "CountryName"
        },
        {
          "value": "England",
          "key": "StateName"
        }
      ]
    }
  }]
}
```

## API

This utility makes use of the HERE reverse-geolocation api:

`http://reverse.geocoder.api.here.com/6.2/reversegeocode.json`

This is documented here:

[HERE reverse-geolocation api](https://developer.here.com/rest-apis/documentation/geocoder/topics/request-first-reverse-geocode.html)

You will need to add your own api keys though.
