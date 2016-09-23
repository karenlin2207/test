import { Roles } from "/lib/collections";
import * as Collections from "/lib/collections";
import { Reaction } from "/server/api";

Meteor.methods({
 addRoles: function (doc) {
    if (!Reaction.hasPermission("shipping")) {
      throw new Meteor.Error(403, "Access Denied");
    }
    console.log(Collections.Account.find().fetch());
    Roles.insert({
        rolesName: "test"
    });
    //return true;
  }
});
