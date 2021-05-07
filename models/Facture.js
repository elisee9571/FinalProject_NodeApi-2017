module.exports = (dbinfo, Sequelize) => {
    return dbinfo.define(
        // name of table
        "Facture", {
            // field name
            id: {
                //set data type with out max length
                type: Sequelize.DataTypes.INTEGER,
                // set primaryKey = true
                primaryKey: true,
                // set autoIncrement = true
                autoIncrement: true
            },
            nom: {
                type: Sequelize.DataTypes.STRING(60),
                allowNull: true
            },
            adresse: {
                type: Sequelize.DataTypes.STRING(150),
                allowNull: true
            },
            ville: {
                type: Sequelize.DataTypes.STRING(150),
                allowNull: true
            },
            cp: {
                type: Sequelize.DataTypes.INTEGER(5),
                allowNull: true
            },
            pays: {
                type: Sequelize.DataTypes.STRING(60),
                allowNull: true
            },
            montant: {
                type: Sequelize.DataTypes.INTEGER,
                allowNull: true
            },
        }, {
            timestamps: true,
            underscored: true
        }
    );
};