console.log('in ssl.js');

Meteor.startup(function() {
    console.log('try to set ssl proxy');

    SSLProxy({
       port: 6000, //or 443 (normal port/requires sudo)
       ssl : {
            key: Assets.getText("key.pem"),
            cert: Assets.getText("cert.pem"),

            //Optional CA
            //Assets.getText("ca.pem")
       }
    });
});
