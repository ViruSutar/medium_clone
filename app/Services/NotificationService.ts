import Database from "@ioc:Adonis/Lucid/Database";
import Notification from "App/Models/Notification";

export default class NotificationService {
  static async createNotification(user_uuid, type, notification) {
    Notification.create({
      user_uuid,
      type,
      notification,
    });

    return { success: true };
  }

  static async listNotifications(user_uuid, type) {
    let notificationTypeQuery = "";
    if (type) {
      notificationTypeQuery = " AND type = :type ";
    }
    let notifications = await Notification.query()
      .select("notification")
      .whereRaw(
        Database.rawQuery(
          "where user_uuid = :user_uuid " + notificationTypeQuery,
          { user_uuid, type }
        )
      );

    return {
      success: true,
      Data:
        notifications.length === 0
          ? "No notifications found "
          : notifications[0],
    };
  }

  static async deleteNotificaions(notification_id) {
    let notification = await Notification.find(notification_id);

    if (!notification) {
      return { success: false, message: "Notification not found" };
    }

    notification.delete();
    notification.save();
  }
}
