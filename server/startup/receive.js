export default function () {
WebApp.connectHandlers.use("/receive", function(req, res, next) {
  var MerchantID = res.body;
  var body;
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