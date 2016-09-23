import { Roles } from "/lib/collections";
import { Reaction } from "/server/api";

Meteor.methods({
 addRoles: function (doc) {
    if (!Reaction.hasPermission("shipping")) {
      throw new Meteor.Error(403, "Access Denied");
    }
    Roles.insert({
        rolesName: "test"
    });
    //return true;
  }
});
