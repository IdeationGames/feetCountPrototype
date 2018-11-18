function getDistanceFromLatLonInM(lat1,lon1,lat2,lon2) {
  var R = 6371e3; // metres
  var d = deg2rad(lat1);
  var g = deg2rad(lat2);
  var k = deg2rad(lat2-lat1);
  var sf = deg2rad(lon2-lon1);

  var a = Math.sin(k/2) * Math.sin(k/2) +
          Math.cos(d) * Math.cos(g) *
          Math.sin(sf/2) * Math.sin(sf/2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c;
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}

