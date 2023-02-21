import Users from '../database/models/User.js';
import { Op } from 'sequelize';

const getUser = async ({ name = null, email = null, refresh_token = '' }) => {
    const user = await Users.findOne({
        where: {
            [Op.or]: [{ name }, { email }, { refresh_token }]
        }
    });
    return user;
}

const getUsers = async () => {
    const users = await Users.findAll({
        attributes: ['id', 'name', 'email']
    });
    return users;
}

const registerUser = async (name, email, password) => {
    const user = await Users.create({ name, email, password });
    return user;
}

const updateRefreshToken = async (id, refresh_token) => {
    const user = await Users.update({ refresh_token }, { where: { id } });
    return user;
}

export default { getUser, getUsers, registerUser, updateRefreshToken }