const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const petSchema = new Schema(
  {
    name: {
      type: String,
      unique: true,
      required: [true, 'Please input a name'],
    },
    humans: [{ type: Schema.Types.ObjectId, ref: "User" }],
    tasks: [{ type: Schema.Types.ObjectId, ref: "Task" }],
    imageUrl: {
        type: String,
        default:
          "https://pro2-bar-s3-cdn-cf.myportfolio.com/c728a553-9706-473c-adca-fa2ea3652db5/12e68d7c-545d-4718-a8ea-fa18b078ca94_rw_1200.jpg?h=c457494d606f389562232d85f277cdfd",
      },
    
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const Pet = model("Pet", petSchema);

module.exports = Pet;
