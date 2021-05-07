module.exports = (dbinfo, Sequelize) => {
    return dbinfo.define(
        // name of table
        "Client", {
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
                allowNull: true,
                // n'est pas obliger de remplir
            },
            email: {
                type: Sequelize.DataTypes.STRING(150),
                allowNull: false,
                // obliger de remplir
                unique: true
                    // unique
            },
            password: {
                type: Sequelize.DataTypes.STRING,
                allowNull: false
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
            tel: {
                type: Sequelize.DataTypes.STRING(10),
                allowNull: true
            },
            status: {
                type: Sequelize.DataTypes.BOOLEAN,
                allowNull: true
            },
            forget: {
                type: Sequelize.DataTypes.STRING(60),
                allowNull: true
            },
        }, {
            timestamps: true,
            underscored: true
        }
    );
};