LastUpdates = new Mongo.Collection("lastupdates");
AllUpdates = new Mongo.Collection("allupdates");

if (Meteor.isClient) {
  // This code only runs on the client
  Meteor.subscribe("lastupdates");
  Meteor.subscribe("userData");

  Template.body.helpers({
    lastupdates: function () {
      return LastUpdates.find();
    },
    hideCompleted: function () {
      return Session.get("hideCompleted");
    },
    incompleteCount: function () {
      return LastUpdates.find({checked: {$ne: true}}).count();
    },
  });

  Template.body.events({
    "submit .new-task": function (event) {
      // This function is called when the new task form is submitted
      var text = event.target.text.value;

      Meteor.call("addTask", text);

      // Clear form
      event.target.text.value = "";

      // Prevent default form submit
      return false;
    },
  });

  Template.task.events({
    "click .toggle-private": function () {
      Meteor.call("setPrivate", this._id, ! this.private);
    }
  });

  Template.task.helpers({
    isOwner: function () {
      return this.owner === Meteor.userId();
    },
  });

  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });
}

Meteor.methods({
  addTask: function (text) {
    // Make sure the user is logged in before inserting a task
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    LastUpdates.upsert({
      owner: Meteor.userId()
    },
    {
      text: text,
      createdAt: new Date(),
      owner: Meteor.userId(),
      username: Meteor.user().profile.name,
      image: Meteor.user().services.recursecenter.image 
    });

    AllUpdates.insert({
      text: text,
      createdAt: new Date(),
      owner: Meteor.userId(),
      username: Meteor.user().profile.name,
      image: Meteor.user().services.recursecenter.image 
    });
  },
  setPrivate: function (taskId, setToPrivate) {
    var task = LastUpdates.findOne(taskId);

    // Make sure only the task owner can make a task private
    if (task.owner !== Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    LastUpdates.update(taskId, { $set: { private: setToPrivate } });
  }
});

if (Meteor.isServer) {
  // Only publish lastupdates that are public or belong to the current user
  Meteor.publish("lastupdates", function () {
    return LastUpdates.find({})
  });
  Meteor.publish("userData", function () {
    return Meteor.users.find({_id: this.userId},
                             {fields: {'services': 1}});
});
}
