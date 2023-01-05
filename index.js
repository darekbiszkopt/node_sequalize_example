const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const Sequelize = require("sequelize");
const { DataTypes } = require("sequelize");
const port = 3308;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const sequelize = new Sequelize("bank", "root", "Uzi2115", {
    host: 'localhost',
    dialect: "mysql",
    port: 3308
});

const users_table = sequelize.define(
    "user",
    {
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        role: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }
);

users_table.sync();

sequelize
    .authenticate()
    .then(() => {
        console.log("connection made successfully");
    })
    .catch((err) => console.log(err, "this has a error"));

app.post("/", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;
    const role = req.body.role;
    const saveUser = users_table.build({
        username,
        password,
        email,
        role
    });
    await saveUser.save();
    res.send("data posted");
});

app.get("/", async (req, res) => {
    const allData = await users_table.findAll();
    res.json(allData);
});

app.put("/:id", (req, res) => {
    const password = req.body.data;
    users_table.update({ password }, { where: { id: req.params.id} });
    res.redirect("/");
});

app.delete("/:id", (req, res) => {
    users_table.destroy({ where: {  id: req.params.id } });
    res.redirect("/");
});

app.listen(port, () => {
    console.log(`server starts at http://localhost:${port}`);
});
