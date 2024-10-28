"use strict";

const mongoose = require("mongoose");
const {
  db: { host, port, name }
} = require("../configs");
const { countConnect } = require("../helpers/check.connect");

const connectionString = `mongodb://${host}:${port}/${name}`;

class Database {
  constructor() {
    this.connect();
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }

    return Database.instance;
  }

  connect(type = "mongodb") {
    if (1 === 1) {
      mongoose.set("debug", true);
      mongoose.set("debug", { color: true });
    }

    mongoose
      .connect(connectionString, {
        maxPoolSize: 50
      })
      .then((_) => {
        console.log(`Connect Database Success`);
        countConnect();
      })
      .catch((err) => console.log(`Connection Error`, err));
  }
}

const instanceDatabase = Database.getInstance();

module.exports = instanceDatabase;
