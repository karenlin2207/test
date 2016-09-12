import { Reaction, i18next } from "/client/api";
import { Meteor } from "meteor/meteor";
import { Template } from "meteor/templating";

/**
 * memberForm events
 *
 */
Template.memberForm.events({
  "submit form": function (event, template) {
    event.preventDefault();

    let newMemberEmail = template.$('input[name="email"]').val();
    let newMemberPassword = template.$('input[name="password"]').val();
    let newMemberRoles = template.$('input[name="Roles"]:checked').val();
    return Meteor.call("accounts/inviteShopMember",Reaction.getShopId(),Meteor.user(),
      newMemberEmail, newMemberPassword, newMemberRoles, function (error, result) {
        if (error) {
          let message;
          if (error.reason === "Unable to send invitation email.") {
            message = i18next.t("accountsUI.error.unableToSendInvitationEmail");
          } else if (error.reason === "This email is already created!"){
            message = i18next.t("accountsUI.error.alreadyCreated");
          } else if (error.reason !== "") {
            message = error;
          } else {
            message = `${i18next.t("accountsUI.error.errorSendingEmail")} ${error}`;
          }
          Alerts.toast(message, "error", {
            html: true,
            timeout: 10000
          });
          return false;
        }
        if (result) {
          Alerts.toast(i18next.t("accountsUI.info.invitationSent",
            "Invitation sent."), "success");

          template.$("input[type=text], input[type=email]").val("");
          $(".settings-account-list").show();

          return true;
        }
      }
    );
  }
});
