import User from '../../model/user';
import Joi from '@hapi/joi';

// 회원가입
export const register = async (ctx) => {
  const schema = Joi.object().keys({
    username: Joi.string().alphanum().min(3).max(20).required(),
    password: Joi.string().required(),
  });

  const result = schema.validate(ctx.request.body);
  if (result.error) {
    ctx.status = 400;
    ctx.body = result.error;
    return;
  }
  const { username, password } = ctx.request.body;
  try {
    const exits = await User.findByUsername(username);
    if (exits) {
      ctx.status = 409; //conflict
      return;
    }
    const user = new User({
      username,
    });
    await user.setPassword(password);
    await user.save();

    // const data = user.toJSON();
    // delete data.hashedPassword();
    // ctx.body = data;
    ctx.body = user.serialize();
    const token = user.generateToken();
    ctx.cookies.set('access_token', token, {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true,
    });
  } catch (error) {
    ctx.throw(500, error);
  }
};
// 로그인
export const login = async (ctx) => {
  const { username, password } = ctx.request.body;

  if (!username || !password) {
    ctx.status = 401; //Unauthorized
    return;
  }
  try {
    const user = await User.findByUsername(username);
    if (!user) {
      ctx.status = 401;
      return;
    }
    const valid = await user.checkPassword(password);
    if (!valid) {
      ctx.status = 401;
      return;
    }
    ctx.body = user.serialize();
    const token = user.generateToken();
    ctx.cookies.set('access_token', token, {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true,
    });
  } catch (error) {
    ctx.throw(500, error);
  }
};
export const check = async (ctx) => {
  const { user } = ctx.state;
  if (!user) {
    ctx.status = 401;
    return;
  }
  ctx.body = user;
};
export const logout = async (ctx) => {
  ctx.cookies.set('access_token');
  ctx.status = 204;
};
