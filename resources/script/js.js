// resize map
const mapdiv = window['map-area'];
var margin;
if (document.all) {
  margin = parseInt(document.body.currentStyle.marginTop, 10) + parseInt(document.body.currentStyle.marginBottom, 10);
} else {
  margin = parseInt(document.defaultView.getComputedStyle(document.body, '').getPropertyValue('margin-top')) + parseInt(document.defaultView.getComputedStyle(document.body, '').getPropertyValue('margin-bottom'));
}
mapdiv.style.height = (window.innerHeight - margin) + 'px';

var basemapVTURL = "https://api.hkmapservice.gov.hk/ags/map/basemap/VT/WGS84"
var mapLabelVTUrl = "https://api.hkmapservice.gov.hk/ags/map/label-en/VT/WGS84"
            
/////
require([
  "esri/map","esri/basemaps", "esri/geometry/Point", "esri/layers/VectorTileLayer", "esri/SpatialReference", "dojo/_base/array", "dijit/form/CheckBox", "dojo/dom", "dojo/dom-construct", "dojo/domReady!"
],
        function(Map, esriBasemaps, Point, VectorTileLayer, SpatialReference, arrayUtils, CheckBox, dom, domConstruct) {
  
  XMLHttpRequest.prototype.openRaw = XMLHttpRequest.prototype.open
  XMLHttpRequest.prototype.open = function(method, url, asyn, usr, pwd){
    if(url.indexOf("ags/map")>=0){
      if(url.indexOf("?")>=0) url += "&key="+apikey
      else url += "?key="+apikey
    }
    this.openRaw(method, url, asyn, usr, pwd)
  }
  esriBasemaps.LandsDVT84 = {
    baseMapLayers: [
      {url: basemapVTURL + "/resources/styles/root.json",
       type: "VectorTile"}
    ]}

  var map = new Map("map-area", {
    center: [114.1095, 22.3964],
    zoom: 9,
    basemap: "LandsDVT84",
    showAttribution: true
  });
  
  var layers = []
  arrayUtils.forEach([
  {
  	url:"https://api.hkmapservice.gov.hk/ags/map/label-en/VT/WGS84/resources/styles/root.json",
		id: "English Label"
  },
  {
    url:"https://api.hkmapservice.gov.hk/ags/map/label-tc/VT/WGS84/resources/styles/root.json",
    id: "Traditional Chinese Label"
  },
  {
    url:"https://api.hkmapservice.gov.hk/ags/map/label-sc/VT/WGS84/resources/styles/root.json",
    id: "Simplified Chinese Label"
  }], function(layer){
    map.addLayer(new VectorTileLayer(layer.url+"?key="+apikey,{"id":layer.id}));
    layers.unshift(layer.id)
  })
  arrayUtils.forEach(layers, function(id) {
    new CheckBox({
      id: "cb_" + id,
      name: "cb_" + id,
      checked: false,
      onChange: function(bool) {
        bool ?
          map.getLayer(this.id.split("_")[1]).show() :
        	map.getLayer(this.id.split("_")[1]).hide();
      }
    }, domConstruct.create("input", {
      id: "lyr_" + id
    })).placeAt(dom.byId("layerToggle"));
    map.getLayer(id).hide();
    // create a label for the check box
    var label = domConstruct.create('label', {
      "for": "cb_" + id,
      "innerHTML": id
    });
    domConstruct.place(label, dom.byId("layerToggle"));
    domConstruct.place(domConstruct.create("br"), dom.byId("layerToggle"));
  });    
  map.on('mouse-move', function(evt){
    if(!evt.mapPoint) return;
    var pt = evt.mapPoint
    document.getElementById("coor").innerHTML = "X: "+pt.x+" <br>Y: "+pt.y
  });
  map.on('load', function(event) {
    const attr = document.getElementsByClassName('esriAttribution')[0];
    if (attr) {
      attr.parentNode.insertBefore(landsdlogo, attr.nextSibling);
    }
  });
});
//PlanD test key
var apikey = 'a5ce32f456ad45db98ff08089fed7153';

/* test key
var apikey = '584b2fa686f14ba283874318b3b8d6b0'; */