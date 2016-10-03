import { setRoles } from "/lib/collections";
import { Reaction } from "/server/api";

Meteor.methods({
 "addRoles": function (doc) {
    console.log("[addRoles][doc]", doc);
    check(doc, {
	rolesName: String,
	//permissions: [String],
	shopId: String
    });

    console.log(Reaction.getShopId());
    if (!Reaction.hasPermission("shipping")) {
      throw new Meteor.Error(403, "Access Denied");
    }
    var result = setRoles.find();
    console.log(setRoles.find().fetch());
    setRoles.insert({
        rolesName: doc.rolesName,
        shopId: doc.shopId
    });
    //return true;
  },
  "searchRoles": function(){
    console.log(setRoles.find({
        shopId: Reaction.getShopId()
      }).fetch());
    var result = setRoles.find({
        shopId: Reaction.getShopId()
      });
    return result;
  }
});
