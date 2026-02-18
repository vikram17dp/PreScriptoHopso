import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: function() {
        return this.authMethod === 'local';
      },
    },
    image: {
      type: String,
      default:
       "https://ui-avatars.com/api/?name=User&background=e0e7ff&color=4f46e5&size=128",
    },
    speciality: {
      type: String,
      
    },
    address: {
      type: Object,
      default: { 
        line1: "",
        line2: ""
      },
    },
    gender: {
      type: String,
      default: "Not Selected",
    },
    dob: {
      type: String,
      default: "Not Selected",
    },
    phone: {
      type: String,
      default: "00000000000",
    },
  },
  { timestamps: true }
);

const userModel = mongoose.model.user || mongoose.model("user", userSchema);
export default userModel;
