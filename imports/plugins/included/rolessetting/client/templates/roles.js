import { Reaction, i18next } from "/client/api";
import { Packages} from "/lib/collections";
import { setRoles } from "/lib/collections";
import * as Collections from "/lib/collections";
import { Meteor } from "meteor/meteor";
import { Session } from "meteor/session";
import { Template } from "meteor/templating";

//
Template.body.onCreated(function bodyOnCreated() {
  this.state = new ReactiveDict();
  Meteor.subscribe('setRoles');
});



/*
 * Template shipping Helpers
 */
Template.rolesDashboardControls.events({
  "click [data-event-action=addRoles]": function () {
    Reaction.showActionView({
      label: i18next.t("roles.addRoles"),
      template: "addRoles"
    });
  }
});

Template.roles.events({
  "click"() {
    return Alerts.removeSeen();
  },
  "click [data-action=addRoles]"() {
    Reaction.showActionView({
      label: i18next.t("roles.addRoles"),
      template: "addRoles"
    });
  }
});

Template.addRoles.events({
  "click #submitbtn": function(){
    var doc = {
      rolesName: document.getElementById('rolesName').value,
      shopId: Reaction.getShopId()
    };
    Meteor.call("addRoles",doc);
  }
});

/*
Template.addRoles.helpers({
  roles(){
    return Roles;
  }
})
*/
Template.rolesTable.events({
  "click [data-event-action=editRoles]": function () {
    Reaction.showActionView({
      label: "edit Roles",
      data: this,
      template: "editRoles"
    });
    Session.set("updatedMethodObj", "");
    Session.set("selectedMethodObj", this);
  }
});

Template.rolesTable.helpers({
  roles() {
    var rolesData = Collections.setRoles.find();
    return rolesData.fetch();
  }
});
Template.editRoles.events({
  "change [data-event-action=toggleMemberPermission]": function (event, template) {
    const self = this;
    let permissions = [];
    const member = template.data;
    if (!this.shopId) {
      throw new Meteor.Error("Shop is required");
    }
    if (self.name) {
      permissions.push(self.name);
      for (let pkgPermissions of self.permissions) {
        permissions.push(pkgPermissions.permission);
      }
    } else {
      permissions.push(self.permission);
    }
    if (!Roles.userIsInRole(Meteor.userId(), permissions, this.shopId)){
        throw new Meteor.Error(403,"You can't change this permissions!");
    }else {
      if ($(event.currentTarget).is(":checked")) {
        Meteor.call("accounts/addUserPermissions", member.userId, permissions, this.shopId);
      } else {
        Meteor.call("accounts/removeUserPermissions", member.userId, permissions, this.shopId);
      }
    }
  },
  "click [data-event-action=resetMemberPermission]": function (event, template) {
    const $icon = $(event.currentTarget);
    if (confirm($icon.data("confirm"))) {
      const results = [];
      for (let role of template.data.roles) {
        results.push(Meteor.call("accounts/setUserPermissions", this.userId, ["guest", "account/profile"], role));
      }
      return results;
    }
  }
})
Template.editRoles.helpers({
    isOwnerDisabled: function () {
    if (Meteor.userId() === this.userId) {
      if (Roles.userIsInRole(this.userId, "owner", this.shopId)) {
        return true;
      }
    }
  },
  hasthisPermissions: function(permissions){
    if (!Roles.userIsInRole(Meteor.userId(), permissions, this.shopId)){
      return true;
    }else{
      return false;
    }
  },
  hasPermissionChecked: function (permission, userId) {
    if (userId && Roles.userIsInRole(userId, permission, this.shopId || Roles.userIsInRole(userId, permission,
        Roles.GLOBAL_GROUP))) {
      return "checked";
    }
  },
  groupsForUser: function (groupUserId) {
    let userId = groupUserId || this.userId || Template.parentData(1).userId;
    return Roles.getGroupsForUser(userId);
  },
  shopLabel: function (thisShopId) {
    const shopId = thisShopId || Template.currentData();
    let shop = Shops.findOne({
      _id: shopId
    });
    if (shop && shop.name) {
      return shop.name;
    }
  },
  permissionGroups: function (thisShopId) {
    let permissionGroups = [];
    const shopId = thisShopId || Template.currentData();
    const packages = Packages.find({
      shopId: shopId
    });

    packages.forEach(function (pkg) {
      const permissions = [];
      if (pkg.registry && pkg.enabled) {
        for (let registryItem of pkg.registry) {
          // Skip entires with missing routes
          if (!registryItem.route) {
            continue;
          }

          // Get all permissions, add them to an array
          if (registryItem.permissions) {
            for (let permission of registryItem.permissions) {
              permission.shopId = shopId;
              permissions.push(permission);
            }
          }

          // Also create an object map of those same permissions as above
          let permissionMap = getPermissionMap(permissions);
          if (!permissionMap[registryItem.route]) {
            permissions.push({
              shopId: pkg.shopId,
              permission: registryItem.name || pkg.name + "/" + registryItem.template, // launchdock-connect/connectDashboard
              icon: registryItem.icon,
              label: registryItem.label || registryItem.provides || registryItem.route
            });
          }
        }
        // todo review this, hardcoded WIP
        const label = pkg.name.replace("reaction", "").replace(/(-.)/g, function (x) {
          return " " + x[1].toUpperCase();
        });

        return permissionGroups.push({
          shopId: pkg.shopId,
          icon: pkg.icon,
          name: pkg.name,
          label: label,
          permissions: _.uniq(permissions)
        });
      }
    });

    return permissionGroups;
  },

  hasManyPermissions: function (permissions) {
    return Boolean(permissions.length);
  },

  editRoles() {
  Doc = Session.get("updatedMethodObj") || Session.get("selectedMethodObj");
  if (Doc) {
    return Doc;
  }
  }
});
