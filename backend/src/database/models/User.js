import { Sequelize } from 'sequelize';
import db from '../config/config.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const { DataTypes } = Sequelize;

const alias = 'Users';
const cols = {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    refresh_token: {
        type: DataTypes.TEXT
    }
};
const config = {
    tableName: 'users',
    timestamps: true,
    hooks: {
        beforeSave: user => {
            const salt = bcrypt.genSaltSync(10);
            user.password = bcrypt.hashSync(user.password, salt);
        }
    }
};

const User = db.define(alias, cols, config);

User.prototype.validatePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

User.prototype.getJWTToken = function () {
    return {
        accessToken: jwt.sign({ userId: this.id, name: this.name, email: this.email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15s' }),
        refreshToken: jwt.sign({ userId: this.id, name: this.name, email: this.email }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1d' })
    }
}

export default User;