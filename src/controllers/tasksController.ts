import { RequestHandler } from "express";
import TaskModel from "../models/taskModel";
import createHttpError from "http-errors";
import mongoose from "mongoose";
import { assertIsDefined } from "../util/assertIsDefined";


export const getTasks: RequestHandler = async (req, res, next) => {
    const projectId = req.params.projectId;
    const authenticatedUserId = req.session.userId;
    try {
        assertIsDefined(authenticatedUserId);
        const tasks = await TaskModel.find({ projectId: projectId }).exec();
        res.status(200).json(tasks);
    } catch(error) {
        next(error);
    }
};

export const getProjectTasks = async (projectId: string) => {
    // eslint-disable-next-line no-useless-catch
    try {
        const tasks = await TaskModel.find({ projectId: projectId }).exec();
        return tasks;
    } catch(error) {
        throw error;
    }
};

export const getTask: RequestHandler = async (req, res, next) => {
    const taskId = req.params.taskId;
    const authenticatedUserId = req.session.userId;
    try {
        assertIsDefined(authenticatedUserId);
        if(!mongoose.isValidObjectId(taskId)) {
            throw createHttpError(400, "Invalid Task ID");
        }
        const task = await TaskModel.findById(taskId).exec();
        if(!task) {
            throw createHttpError(404, "Task not found.");
        }
        if(!task.userId.equals(authenticatedUserId)) {
            throw createHttpError(401, "You are not authorised to access this note.");
        }
        res.status(200).json(task);
    } catch(error) {
        next(error);
    }
};

interface CreateTaskBody {
    projectId: string
    title?: string,
    text?: string,
    completed?: boolean,
}

export const createTask: RequestHandler<unknown, unknown, CreateTaskBody, unknown> = async (req, res, next) => {
    const projectId = req.body.projectId;
    const title = req.body.title;
    const text = req.body.text;
    const completed = req.body.completed;
    const authenticatedUserId = req.session.userId;
    try {
        assertIsDefined(authenticatedUserId);
        if(!title || !text) {
            throw createHttpError(400, "Task needs a title and details");
        }
        const newTask = await TaskModel.create({
            projectId: projectId,
            userId: authenticatedUserId,
            title: title,
            text: text,
            completed: completed,
        });

        res.status(201).json(newTask);
    } catch(error) {
        next(error);
    }
};

interface UpdateTaskParams {
    taskId: string,
}

interface UpdateTaskBody {
    title?: string,
    text?: string,
    completed: boolean,
}

export const updateTask: RequestHandler<UpdateTaskParams, unknown, UpdateTaskBody, unknown> = async (req, res, next) => {
    const taskId = req.params.taskId;
    const newTitle = req.body.title;
    const newText = req.body.text;
    const newCompleted = req.body.completed;
    const authenticatedUserId = req.session.userId;
    try {
        assertIsDefined(authenticatedUserId);
        if(!mongoose.isValidObjectId(taskId)) {
            throw createHttpError(400, "Invalid Task ID");
        }
        if(!newTitle || !newText) {
            throw createHttpError(400, "Task needs a title and details");
        }
        const task = await TaskModel.findById(taskId).exec();
        if(!task) {
            throw createHttpError(404, "Task not found.");
        }
        if(!task.userId.equals(authenticatedUserId)) {
            throw createHttpError(401, "You are not authorised to access this note.");
        }
        task.title = newTitle;
        task.text = newText;
        task.completed = newCompleted;

        const updatedTask = await task.save();

        res.status(200).json(updatedTask);
    } catch(error) {
        next(error);
    }
};

export const deleteTask: RequestHandler = async (req, res, next) => {
    const taskId = req.params.taskId;
    const authenticatedUserId = req.session.userId;
    try {
        assertIsDefined(authenticatedUserId);
        if(!mongoose.isValidObjectId(taskId)) {
            throw createHttpError(400, "Invalid Task ID");
        }
        const task = await TaskModel.findById(taskId).exec();
        if(!task) {
            throw createHttpError(404, "Task not found.");
        }
        if(!task.userId.equals(authenticatedUserId)) {
            throw createHttpError(401, "You are not authorised to access this note.");
        }
        await task.deleteOne();
        res.sendStatus(204);
    } catch(error) {
        next(error);
    }
};

export const deleteAllProjectTasks = async (projectId: string) => {
    // eslint-disable-next-line no-useless-catch
    try {
    // Validate projectId
    if (!mongoose.isValidObjectId(projectId)) {
        throw new Error("Invalid Project ID");
    }
  // Delete all tasks with the given projectId
    await TaskModel.deleteMany({ projectId });
    } catch (error) {
        throw error;
    }
};
