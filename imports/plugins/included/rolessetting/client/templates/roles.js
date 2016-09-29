import { Reaction, i18next } from "/client/api";
import { Packages, Roles } from "/lib/collections";
import { Meteor } from "meteor/meteor";
import { Session } from "meteor/session";
import { Template } from "meteor/templating";
import { Blaze } from "meteor/blaze";

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
    console.log("test");
    Roles.insert({'rolesName':"test"});
    //Meteor.call("addRoles","test");
  }
});


Template.rolesTable.helpers({
  roles() {
    return Roles.find();
  },
  selectedRoles() {
    let session = Session.get("selectedRoles");
    if (_.isEqual(this, session)) {
      return this;
    }
  }
});


AutoForm.hooks({
  "roles-add-form": {
    onSuccess() {
      Reaction.toggleSession("selectedRoles");
      return Alerts.inline(i18next.t("roles.RolesSaved"), "success", {
        autoHide: true,
        placement: "rolesPackage"
      });
    }
  }
});