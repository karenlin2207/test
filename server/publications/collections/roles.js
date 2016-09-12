import { Roles } from "/lib/collections";
import { Reaction } from "/server/api";

/**
 * shipping
 */

Meteor.publish("roles", function () {
  const shopId = Reaction.getShopId();
  if (!shopId) {
    return this.ready();
  }
  return Roles.find({
    shopId: shopId
  });
});
