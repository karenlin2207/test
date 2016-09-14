export default function () {
WebApp.connectHandlers.use("/receive", function(req, res, next) {
  var MerchantID = res.body;
  var body;
  
  req.setHeader('Access-Control-Allow-Origin', '*');
  req.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
  req.setHeader('Access-Control-Allow-Headers', 'Origin, Content-Type, X-Auth-Token');
  req.on('data', Meteor.bindEnvironment(function (data) {
    body = data.toString();
  }));

  req.on('end', Meteor.bindEnvironment(function () {
    console.log(body);
    res.writeHead(200, {'Content-Type': 'application/json'});
    if (MerchantID) console.log(MerchantID);
    res.end("Hello world from: " + body + '\n');
  }));
});
}