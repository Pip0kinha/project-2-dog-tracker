const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: [true, 'Please input username'],
    },
    passwordHash: { 
      type: String,
      required: [true, 'Please input a password'],
    },

    pets: [{ type: Schema.Types.ObjectId, ref: "Pet" }],
    imageUrl: {
      type: String,
      default:
        "/public/images/user-profile-default.png",
    },
    
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
