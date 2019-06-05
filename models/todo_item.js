'use strict';
module.exports = (sequelize, DataTypes) => {
    const todo_item = sequelize.define('todo_item', {
        taskText: DataTypes.STRING,
        datetime: DataTypes.DATE,
        isActive: DataTypes.BOOLEAN,
    }, {});
    todo_item.associate = function(models) {
        // associations can be defined here
    };
    return todo_item;
};