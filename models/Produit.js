module.exports = (dbinfo, Sequelize) => {
    return dbinfo.define(
        "Produit", {
            id: {
                type: Sequelize.DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            nom: {
                type: Sequelize.DataTypes.STRING(60),
            },
            description: {
                type: Sequelize.DataTypes.TEXT,
            },
            prix: {
                type: Sequelize.DataTypes.INTEGER(6),
                allowNull: true
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