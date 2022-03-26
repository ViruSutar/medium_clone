import { Request } from "@adonisjs/core/build/standalone";
import Database from "@ioc:Adonis/Lucid/Database";
import { NotificationType } from "App/Enum/NotificationTypeEnum";
import Notification from "App/Models/Notification";
import NotificationValidator from "App/Validators/NotificationValidator";

export default class NotificationService {
  static async createNotification(user_uuid, type, notification) {
    // TODO: this is not working caught FATAL errors and send response on the front end
    await NotificationValidator.createNotification;

    let typeEnum: any = NotificationType[type];

    Notification.create({
      user_uuid,
      type: typeEnum,
      notification,
    });

    return { success: true };
  }

  static async listNotifications(user_uuid, type) {
    let notificationTypeQuery = "";
    if (type) {
      notificationTypeQuery = " AND type = :type ";
    }
    let notifications = await Database.query()
      .select(
        Database.rawQuery(
          "notification,id,DATE_FORMAT(notifications.created_at,'%d/%m/%Y') as Date, \
                          (CASE when notifications.type = 10 THEN 'mentions' \
                               when notifications.type = 20 THEN 'likes' \
                               when notifications.type = 50 THEN 'follwers' \
                               when notifications.type = 30 THEN 'comments' END) as type "
        )
      )
      .from("notifications")
      .whereRaw(
        Database.rawQuery(" user_uuid = :user_uuid " + notificationTypeQuery, {
          user_uuid,
          type,
        })
      );

    return {
      success: true,
      Data:
        notifications.length === 0
          ? "No notifications found "
          : notifications,
    };
  }

  static async deleteNotificaions(notification_id, user_uuid) {
    let notification = await Notification.find(notification_id);

    if (notification?.user_uuid !== user_uuid) {
      return { success: false, message: "you do not have this permission" };
    }

    if (!notification) {
      return { success: false, message: "Notification not found" };
    }

    notification.delete();
    notification.save();
  }
}
