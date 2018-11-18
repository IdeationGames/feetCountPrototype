cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/cordova-pedometer/www/pedometer.js",
        "id": "cordova-pedometer.Pedometer",
        "pluginId": "cordova-pedometer",
        "clobbers": [
            "pedometer"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "cordova-plugin-whitelist": "1.3.3",
    "cordova-plugin-geolocation": "4.0.1",
    "cordova-pedometer": "0.2.0"
}
// BOTTOM OF METADATA
});