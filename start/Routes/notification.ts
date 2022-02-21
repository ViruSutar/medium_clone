import Route from '@ioc:Adonis/Core/Route'


Route.post('notification/add','NotificationsController.createNotification')
Route.get('notification/list','NotificationsController.listNotifications').middleware('checkAccess')
Route.delete('notification/delete','NotificationsController.deleteNotificaions').middleware('checkAccess')

