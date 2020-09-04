const Sequelize = require('sequelize');

module.exports = (sequelize) => {

    class User extends Sequelize.Model {}
    User.init({

        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        firstName: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "First name is required"
                },
                notNull: {
                    msg: "First name is required"
                }
            }
        },
        lastName: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "Last name is required"
                },
                notNull: {
                    msg: "Last name is required"
                }
            }
        },
        emailAddress: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
            is: /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/,
            validate: {
                notEmpty: {
                    msg: "Email address is required"
                },
                notNull: {
                    msg: "Email address is required"
                },
                is: {
                    msg: "The email address entered is missing or is not valid"
                }                 
            }
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "Password is required"
                },
                notNull: {
                    msg: "Password is required"
                }
            }
        },
    }, {sequelize});

    User.associate = (models) => {
        User.hasMany(models.Course);
    };


    return User;
}