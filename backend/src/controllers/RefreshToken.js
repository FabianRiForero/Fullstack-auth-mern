import jwt from 'jsonwebtoken';
import catchAsyncErrors from '../middlewares/catchAsyncErrors.js';
import userService from '../services/user.service.js';

export const refreshToken = catchAsyncErrors(async ({ cookies }, res) => {
    const { refreshToken } = cookies;
    if (!refreshToken) return res.sendStatus(401);
    const user = await userService.getUser({ refresh_token: refreshToken });
    if (!user) return res.sendStatus(403);
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
        if (err) return res.sendStatus(403);
        const accessToken = jwt.sign({ userId: user.id, name: user.name, email: user.email }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '15s'
        });
        res.json({ accessToken });
    });
});