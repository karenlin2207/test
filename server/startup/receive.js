export default function () {
  WebApp.connectHandlers.use("/receive", function(req, res, next) {
    var body = [];
    var MerchantID = res.body;
    req.on('data', Meteor.bindEnvironment(function (data) {
      body.push(data.toString());
    }));

    req.on('end', Meteor.bindEnvironment(function () {
      console.log(req.method);
      if (MerchantID) console.log(MerchantID);
      res.writeHead(200);
      res.end("Hello world from: " + body + '\n');
    }));
  });
}