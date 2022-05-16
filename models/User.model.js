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
        "https://st.depositphotos.com/1779253/5140/v/380/depositphotos_51405259-stock-illustration-male-avatar-profile-picture-use.jpg?forcejpeg=true",
    },
    
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;

