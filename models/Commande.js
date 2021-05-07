module.exports = (dbinfo, Sequelize) => {
    return dbinfo.define(
        "Commande", {
            id: {
                type: Sequelize.DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            status: {
                type: Sequelize.DataTypes.BOOLEAN,
                allowNull: true
            },

        }, {
            timestamps: true,
            underscored: true
        }
    );
};