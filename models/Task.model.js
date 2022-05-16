const { Schema, model } = require("mongoose");

const taskSchema = new Schema(
  {
    content: String,
    pet: [{ type: Schema.Types.ObjectId, ref: "Pet" }]
  },
  {
    timestamps: true
  }
);

const Task = model("Task", taskSchema);

module.exports = Task;
