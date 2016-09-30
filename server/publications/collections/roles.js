import { setRoles } from "/lib/collections";
import { Reaction } from "/server/api";

/**
 * shipping
 */

Meteor.publish("setroles", function () {
  const shopId = Reaction.getShopId();
  if (!shopId) {
    return this.ready();
  }
  return setRoles.find({
    shopId: shopId
  });
});
