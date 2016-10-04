import { Reaction, i18next } from "/client/api";
import { Packages} from "/lib/collections";
import { setRoles } from "/lib/collections";
import * as Collections from "/lib/collections";
import { Meteor } from "meteor/meteor";
import { Session } from "meteor/session";
import { Template } from "meteor/templating";
import { Blaze } from "meteor/blaze";

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


Template.rolesTable.helpers({
  roles() {
    var rolesData = Collections.setRoles.find();
    console.log("[rolesData]", rolesData.count());
    return rolesData.fetch();
  },
  selectedRoles() {
    let session = Session.get("selectedRoles");
    if (_.isEqual(this, session)) {
      return this;
    }
  },
  "click [data-event-action=editRoles]"(event) {
  event.preventDefault();
  Reaction.showActionView({
    label: i18next.t("Roles.editRoles"),
    data: this,
    template: "editRoles"
  });

  Session.set("updatedMethodObj", "");
  Session.set("selectedMethodObj", this);
  }
});

Template.editRoles.helpers({
  editRoles() {
  Doc = Session.get("updatedMethodObj") || Session.get("selectedMethodObj");
  if (Doc) {
    return Doc;
  }
  }
});

Blaze.TemplateInstance.prototype.parentTemplate = function (levels = 1) {
  let view = Blaze.currentView;
  let numLevel = levels;
  while (view) {
    if (view.name.substring(0, 9) === "Template." && !numLevel--) {
      return view.templateInstance();
    }
    view = view.parentView;
  }
};
