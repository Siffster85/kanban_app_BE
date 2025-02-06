import { InferSchemaType, Schema, model } from "mongoose";


const taskSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    projectId: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    completed: {
        type: Boolean,
        required: true,
        default: false,
    },
}, { timestamps: true });

type Task = InferSchemaType<typeof taskSchema>

export default model<Task>("Task", taskSchema);
