import Route from '@ioc:Adonis/Core/Route'


Route.post('notification/add','NotificationsController.createNotification')
Route.get('notification/list','NotificationsController.listNotifications')
Route.delete('notification/delete','NotificationsController.deleteNotificaions')

