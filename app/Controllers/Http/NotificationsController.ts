// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import { NotificationType } from "App/Enum/NotificationTypeEnum";
import NotificationService from "App/Services/NotificationService";
import NotificationValidator from "App/Validators/NotificationValidator";

export default class NotificationsController {
  public async createNotification({ request, response }) {
    let { user_uuid, type, notification } = request.all();

    await request.validate(NotificationValidator.createNotification);
    await NotificationService.createNotification(user_uuid, type, notification);

    return response.send({ success: true });
  }

  public async listNotifications({ request, response }) {
    let { user_uuid, type } = request.all();

    let notifications = await NotificationService.listNotifications(
      user_uuid,
      type
    );

    return response.send({ success: true, notifications: notifications.Data });
  }

  //   TODO: user validation
  public async deleteNotificaions({ request, response }) {
    let { notification_id } = request.all();

    let notification = await NotificationService.deleteNotificaions(
      notification_id
    );

    if (notification?.success === false) {
      return response
        .status(404)
        .send({ success: false, message: notification.message });
    }

    return response.send({ success: true });
  }
}
