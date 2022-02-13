// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import AuthService from "App/Services/AuthService";
import UserService from "App/Services/UserService";
import AuthValidator from "App/Validators/AuthValidator";
import UserValidator from "App/Validators/UserValidator";

export default class AuthController {
  public async RegisterUser({ request, response }) {
    let { name, email, password } = request.all();

    await request.validate(AuthValidator.RegisterUser);

    let user = await AuthService.RegisterUser(name, email, password);

    return response.send({
      success: true,
      UserId: user.UserId,
      token: user.token,
    });
  }

  public async login({ request, response }) {
    let { email, password } = request.all();

    await request.validate(AuthValidator.login);

    let user = await AuthService.login(email, password);

    if (user.success === false) {
      return response
        .status(user.status_code)
        .send({ success: false, message: user.message });
    }

    return response.status(200).send({ success: true, token: user.token });
  }
}
