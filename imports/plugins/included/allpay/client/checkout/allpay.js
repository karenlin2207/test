/* eslint camelcase: 0 */
import { Meteor } from "meteor/meteor";
import { Template } from "meteor/templating";
import { Reaction } from "/client/api";
import { Cart, Shops ,Packages} from "/lib/collections";
var allpay = require("../../lib/api");
import { allpayPayment } from "../../lib/collections/schemas";

import "./allpay.html";

function uiEnd(template, buttonText) {
  template.$(":input").removeAttr("disabled");
  template.$("#btn-complete-order").text(buttonText);
  return template.$("#btn-processing").addClass("hidden");
}

function paymentAlert(errorMessage) {
  return $(".alert").removeClass("hidden").text(errorMessage);
}

function hidePaymentAlert() {
  return $(".alert").addClass("hidden").text("");
}

function handleallpaySubmitError(error) {
  let serverError = error !== null ? error.message : void 0;
  if (serverError) {
    return paymentAlert("Oops! " + serverError);
  } else if (error) {
    return paymentAlert("Oops! " + error, null, 4);
  }
}


Template.allpayPaymentForm.helpers({
  allpayPayment() {
    return allpayPayment;
  },
  allpaycheckout(){
    var allpaycheckout;
    var items = Cart.findOne({ userId: Meteor.userId() }).items;
    var Items = new Array();
    items.forEach(function(data){
      var item = { name : data.title, price: parseInt(data.variants.price) ,currency : "NTD", quantity: data.quantity};
      Items.push(item);
    })
    var date = new Date();
    let cartInfo={
      MerchantTradeNo : Random.id(),
      MerchantTradeDate: moment(date).format("YYYY/MM/DD HH:mm:ss"),
      TotalAmount: parseInt(Cart.findOne().cartTotal()),
      TradeDesc: "test",
      Items:  Items,
      ReturnURL: "https://ec2-52-43-22-203.us-west-2.compute.amazonaws.com/receive",
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
        console.log(result.html);
      });
    return allpaycheckout;
  }
});

Template.allpayPaymentForm.events({
  'click #allpaybutton': function(event){
    event.preventDefault();
    var paymentMethod = {
            processor: "AllPay",
            storedCard: "AllPay",
            method: "AllPay Payment",
            transactionId: document.getElementsByName("MerchantID")[0].value ,
            currency: "NTD",
            amount: parseInt(document.getElementsByName("TotalAmount")[0].value),
            status: "new",
            paymentstatus: "unpaid",
            mode: "authorize",
            createdAt: new Date(),
            transactions: []
          };
          response={
          amount: parseInt(document.getElementsByName("TotalAmount")[0].value),
          transactionId: document.getElementsByName("MerchantID")[0].value,
          currency: "NTD"
          };
          paymentMethod.transactions.push(response);
          Meteor.call("cart/submitPayment", paymentMethod);
  }
});
