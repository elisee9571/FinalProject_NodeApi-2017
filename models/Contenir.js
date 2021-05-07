module.exports = (dbinfo, Sequelize) => {
    return dbinfo.define(
        "Contenir", {
            prix: {
                //set data type with max length
                type: Sequelize.DataTypes.DECIMAL(7, 2),
                // setting allowNull to false will add NOT NULL to the column, which means an error will be if you add info in this column
                allowNull: true
            },
            qtn: {
                type: Sequelize.DataTypes.INTEGER(3)
            }
        });
};