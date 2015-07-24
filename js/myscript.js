$(function() {

  // MAKES JAVASCRIPT RUN A BIT SMOOTHER
  'use strict';

  var chart,
      fromDate,
      toDate,
      last30,
      yesterday;

// Functions ------------------------------
  function formatDate(date, divider ) {
    var someday = new Date(date);

    var month = someday.getUTCMonth()+1,
    day = someday.getUTCDate(),
    year = someday.getUTCFullYear();

    if (month <= 9) { month = '0' + month; }
    if (day <= 9) { day = '0' + day; }

    return ('' + year + divider + month + divider + day);
  }// END FUNCTION formatDate(date, divider ) {


  function getMean(myArray) {
      var mean = myArray.reduce(function(a, b) { return a + b; })/myArray.length;
      return mean.toFixed(2);
  }// END FUNCTION

  function getMedian(myArray) {
    var median;
    var sorted = myArray.sort(myArray);

    var middleIndex = Math.floor((sorted.length) / 2);

    if(sorted.length % 2 === 0) {
      var medianA = sorted[middleIndex];
      var medianB = sorted[middleIndex-1];
      median = (medianA + medianB) / 2;
    } else {
      median = sorted[middleIndex + 1];
    }
    return median.toFixed(2);

  }// END FUNCTION

  // var testArray = [1, 2, 2, 4, 1000];
  //
  // console.log('Mean: ' + getMean(testArray));
  // console.log('Mean: ' + getMedian(testArray));

  function initChart(data) {
    console.log('FUNCTION initChart(data) CALLED ******************');

    // here we use the variable 'chart' we created earlier
    // This is going to use the c3 method frokm our c3 library,
    // and first we are going to use the generate method
    // and in there we are going to pass it an object with a bunch of set up parameters

    chart = c3.generate({
      // first we create our data object
      // this is going to have information
      // about our X axis - We are asking c3 to have a look the first element in the array
      // that we are going to pass it and use it as our X axis
      // Next we specify our columns that will contain most of our arrays
      // the columns is going to come from our data array that we recieve when we call this function

      data: {
          x: 'x',
          columns: data,
          // type: 'bar',
          // groups: [
          //     ['Mean Temperature', 'Median Temperature', 'Mean Pressure', 'Median Pressure', 'Median Speed', 'Mean Speed']
          // ]
      },
      bar: {
          width: {
              ratio: 0.8
          }
      },
      // next up we need to create our axis, that will be another object
      //  that will contain info about our chart
      axis: {
          x: {
              type: 'timeseries',
              tick: {
                  format: '%Y-%m-%d'
              }
          }
      },
      subchart: {
          show: true
      }
    }); //generate chart
  }// END FUNCTION initChart(data) {


  function processData(data) {


    // here we create an array of arrays that this particular d3js graph (Timeseries Chart) needs
    var myData = [];

    var myDates = ['x'];
    var meanTemps = ['Mean Temperature'];
    var medTemps = ['Median Temperature'];
    var meanPress = ['Mean Pressure'];
    var medPress = ['Median Pressure'];
    var medSpeeds = ['Median Speed'];
    var meanSpeeds = ['Mean Speed'];
    var id = 0;

    for ( var key in data) {
      if (data.hasOwnProperty(key)) {
        if ((data[key].t !== null) &&
            (data[key].p !== null) &&
            (data[key].s !== null)) {
          myDates.push(key);
          meanTemps.push(getMean(data[key].t));
          medTemps.push(getMedian(data[key].t));
          meanPress.push(getMean(data[key].p));
          medPress.push(getMedian(data[key].p));
          meanSpeeds.push(getMean(data[key].s));
          medSpeeds.push(getMedian(data[key].s));
          id++;
        }
      } //hasOwnProperty
    } //for loop


    myData.push(myDates, meanTemps, medTemps, meanPress, medSpeeds, meanSpeeds);
    return myData;
  }// END FUNCTION processData



  //Load Chart function that will create and load our data from ajax response -------------------
  function loadChart() {
    console.log('FUNCTION load chart CALLED ******************');

    // here we use the jQuery $.ajax method. into which we will pass an object indicated by the {}
     // and this object will require some data

     // we also need to specify the callback function that we use to retrieve the data. remember the call back jsonReturnData is the function call that is in that foundation url
    $.ajax({
        //url: 'http://foundationphp.com/phpclinic/podata.php?startDate=20150301&endDate=20150307&raw',
        url: 'http://foundationphp.com/phpclinic/podata.php?raw&callback=?',
        jsonpCallback: 'jsonReturnData',
        dataType: 'jsonp',
        data: {
            // startDate: formatDate(fromDate, ''),
            // endDate: formatDate(toDate, ''),
            // format: 'json'

            startDate: formatDate(fromDate, ''),
            endDate: formatDate(toDate, ''),
            format: 'json'
        },
        // here we add a success parameter that will run if the call is succesfull,
        // that will recieve a RESPONSE from the SERVER, and then we do whatever we want
        success: function( response ) {
          console.log('$.ajax success function CALLED ******************');
          console.log(processData(response));
          initChart(processData(response));
          //initChart(processData(response));
        }
    });
  }// END FUNCTION



  //Set up Dates -------------------
  fromDate = new Date();
  fromDate.setDate(fromDate.getDate() - 62);

  toDate = new Date();
  toDate.setDate(toDate.getDate() - 1);
  //
  document.forms.rangeform.from.value = formatDate(fromDate, '-');
  document.forms.rangeform.to.value = formatDate(toDate, '-');

  loadChart();

//Events -------------------
document.forms.rangeform.addEventListener('change', function(e) {
    fromDate = new Date(document.rangeform.from.value);
    toDate = new Date(document.rangeform.to.value);

    fromDate = fromDate.toUTCString();
    toDate = toDate.toUTCString();

    loadChart();
}, false);// END FUNCTION

});// END FUNCTION
