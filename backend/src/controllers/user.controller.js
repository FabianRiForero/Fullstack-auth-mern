import catchAsyncErrors from '../middlewares/catchAsyncErrors.js';
import userService from '../services/user.service.js';

export const getUsers = catchAsyncErrors(async (req, res) => {
    const users = await userService.getUsers();
    res.json(users);
});

export const registerUser = catchAsyncErrors(async ({ body }, res) => {
    const { name, email, password, confPassword } = body;
    if (password !== confPassword) return res.status(400).json({ msg: 'Password and Confirm Password do not match!' });
    const user = await userService.registerUser(name, email, password);
    (Object.keys(user).length > 0 ? res.json({ msg: 'Registration SuccessFul', user }) : res.status(400).json({ msg: 'Error' }))
});

export const login = catchAsyncErrors(async ({ body }, res) => {
    const { email = '', password = '' } = body
    const user = await userService.getUser({ email });
    if(!user) return res.status(404).json({msg: 'Email not fount'});
    if (await user.validatePassword(password) === false) return res.status(400).json('Wrong Password');
    const { accessToken, refreshToken } = user.getJWTToken();
    await userService.updateRefreshToken(user.id, refreshToken);
    res.cookie('refreshToken', refreshToken, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * parseFloat(process.env.COOKIE_EXPIRE || 1) }).json({ accessToken });
});

export const logout = catchAsyncErrors(async (req,res) => {
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken) return res.sendStatus(204);
    const user = await userService.getUser({refresh_token: refreshToken});
    if(!user) return res.sendStatus(204);
    await userService.updateRefreshToken(user.id,null);
    res.clearCookie('refreshToken').sendStatus(200);
});