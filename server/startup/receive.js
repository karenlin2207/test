import { Orders} from '/lib/collections';
import { Reaction, Logger } from "/server/api";
import { Packages } from "/lib/collections";


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
  var body = new Array();
  var data = Packages.findOne({ 
  name: "allPay",
  shopId: Reaction.getShopId()
  });
  var temparray = new Array();
  var obj={};
  console.log('[connectHandlers][receive]');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, Content-Type, X-Auth-Token');
  req.on('data', Meteor.bindEnvironment(function (data) {
    body = data.toString().split("&");
  }));


  req.on('end', Meteor.bindEnvironment(function () {
    for(var i = 0; i<body.length;i++) {
      body[i]=body[i].split("=");
      obj[body[i][0]]=body[i][1];
      temparray.push(obj);
    }
    console.log(obj);
    console.log(obj.MerchantTradeNo);

    orders = Orders.findOne({cartId:obj.MerchantTradeNo});

      var Allpay = require("allpay");
      var allpay = new Allpay({
        merchantID: data.settings.merchantID || "2000132",
        hashKey: data.settings.hashKey || "5294y06JbISpM5x9",
        hashIV: data.settings.hashIV || "v77hoKGq4kWxNNIS",
        mode: "test",
        debug: true
      });

      allpay.setHost({
        baseUrl: "payment-stage.allpay.com.tw",
        port: 80,
        useSSL: false
      });
      objresult = allpay.genCheckMacValue(obj);
      console.log(obj);
      result = allpay.isDataValid(obj);
    Orders.update({
      "cartId":obj.MerchantTradeNo,
      "billing.paymentMethod.transactionId": orders.billing[0].paymentMethod.transactionId
    }, {
      $set: {
        "billing.$.paymentMethod.paymentstatus": "paid"
      }
    });
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end("Hello world from: " + body + '\n');
  }));

});
//*/


}
