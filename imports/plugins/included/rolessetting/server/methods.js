import { setRoles } from "/lib/collections";
import { Reaction } from "/server/api";

Meteor.methods({
 addRoles: function (doc) {

    console.log("[addRoles][doc]", doc);

    /*check(doc, {
	rolesName: String,
	//permissions: [String],
	//shopId: String
    });*/


    if (!Reaction.hasPermission("shipping")) {
      throw new Meteor.Error(403, "Access Denied");
    }
    setRoles.insert({
        rolesName: "test"
    });
    return true;
  }
});
