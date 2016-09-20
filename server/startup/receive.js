export default function () {

console.log('[Receive]')

/*
Router.map(function () {
  this.route('/receive', {
    where: 'server',
    action: function () {
      //doSomethingWithParams(this.request.query);
      console.log('[receive]', this.request.query);
      console.log('[receive]', this.request.body);
    }
  });
});
*/

///*
WebApp.connectHandlers.use("/receive", function(req, res, next) {
  var MerchantID = res.body;
  var body;

  console.log('[connectHandlers][receive]');
  
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, Content-Type, X-Auth-Token');
  req.on('data', Meteor.bindEnvironment(function (data) {
    body = data.toString().split("&");
  }));

  req.on('end', Meteor.bindEnvironment(function () {
    console.log('body ' +body);
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end("Hello world from: " + body + '\n');
  }));

});
//*/


}
