db.createUser({
  user: "database_owner",
  pwd: "password123",
  roles: [
    {
      role: "dbOwner",
      db: "url_monitor_database",
    },
  ],
});

db.createCollection("users");

db.users.insert({ name: "shehab" });
db.users.insert({ name: "ahmed" });
