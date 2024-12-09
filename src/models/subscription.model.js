import mongoose, { Schema } from "mongoose";
import { User } from "./user.model";

const subscriptonSchema = new Schema(
  {
    subscriber :{
        type: Schema.Types.ObjectId,//one who is subscribing
        ref: User
    },
    channel : {
        type: Schema.Types.ObjectId,//one whoes channel is being subscribed
        ref: User

    }

  },
  {
    timestamps: true,
  }
);
const aggeration = () => {
  
}


export const Subscription = mongoose.model("Subscription", subscriptonSchema);
