const Sequelize = require("sequelize")

const sequelize = new Sequelize('24022021','root','',{
    host:'localhost',
    dialect:'mysql'
})

module.exports = {
    Sequelize:Sequelize,
    sequelize:sequelize
}