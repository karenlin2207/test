import moment from "moment";
import { Template } from "meteor/templating";
import { Orders, Shops, Packages } from "/lib/collections";
import { Reaction } from "/client/api";
/**
 * dashboardOrdersList helpers
 *
 */
Template.dashboardOrdersList.helpers({
  orderStatus() {
    if (this.workflow.status === "coreOrderCompleted") {
      return true;
    }
  },
  orders(data) {
    if (data.hash.data) {
      return data.hash.data;
    }
    return Orders.find({}, {
      sort: {
        createdAt: -1
      },
      limit: 25
    });
  },
  allpaycheckout : function(payment){
    if (payment == "AllPay"){
      return true;
    }
    else{
      return false;
    }
  },
  allpaycheckoutform(){
      var allpaycheckout;
      var strUrl = location.search;
      var getPara, ParaVal;
      var aryPara = [];
      if (strUrl.indexOf("?") != -1) {
        var getSearch = strUrl.split("?");
        getPara = getSearch[1].split("&");
        for (i = 0; i < getPara.length; i++) {
          ParaVal = getPara[i].split("=");
          aryPara.push(ParaVal[1]);
          aryPara[ParaVal[1]] = ParaVal[2];
        }
      }
      var order = Orders.findOne({ cartId: aryPara[0] });
      var items = order.items;
      var Items = new Array();
      items.forEach(function(data){
        var item = { name : data.title, price: parseInt(data.variants.price) ,currency : "NTD", quantity: data.quantity};
        Items.push(item);
      })
      var date = new Date();
      let cartInfo={
        MerchantTradeNo : aryPara[0],
        MerchantTradeDate: moment(date).format("YYYY/MM/DD HH:mm:ss"),
        TotalAmount: parseInt(order.billing[0].paymentMethod.amount),
        TradeDesc: "test",
        Items:  Items,
        ReturnURL: "http://192.168.1.15:3000/receive",
        ChoosePayment: "ALL"
      };
      var data = Packages.findOne({ 
        name: "allPay",
              shopId: Reaction.getShopId()
            });
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

      allpay.aioCheckOut(cartInfo, function(err, result) {
          allpaycheckout = result.html;
        });
      return allpaycheckout;
  },
  orderAge() {
    return moment(this.createdAt).fromNow();
  },
  shipmentTracking() {
    return this.shipping[0].shipmentMethod.tracking;
  },
  shopName() {
    let shop = Shops.findOne(this.shopId);
    return shop !== null ? shop.name : void 0;
  }

});

Template.dashboardOrdersList.events({
  'click #allpaybutton': function(event){
    var form = document.getElementById("_allpayForm");
    form.submit();
  }
});