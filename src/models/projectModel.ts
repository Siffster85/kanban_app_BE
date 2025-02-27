import { InferSchemaType, Schema, model } from "mongoose";


const projectSchema = new Schema({
    userId: {
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
    requiredBy: {
        type: String,
        required: true,
    },
}, { timestamps: true });

type Project = InferSchemaType<typeof projectSchema>

export default model<Project>("Project", projectSchema);
