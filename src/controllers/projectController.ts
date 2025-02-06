import { RequestHandler } from "express";
import ProjectModel from "../models/projectModel";
import createHttpError from "http-errors";
import mongoose from "mongoose";
import { assertIsDefined } from "../util/assertIsDefined";
import { deleteAllProjectTasks, getProjectTasks } from "./tasksController";


export const getProjects: RequestHandler = async (req, res, next) => {

    const authenticatedUserId = req.session.userId;
    try {
        assertIsDefined(authenticatedUserId);
        const projects = await ProjectModel.find({ userId: authenticatedUserId }).exec();
        res.status(200).json(projects);
    } catch(error) {
        next(error);
    }
};

export const getProject: RequestHandler = async (req, res, next) => {
    const projectId = req.params.projectId;
    const authenticatedUserId = req.session.userId;
    try {
        assertIsDefined(authenticatedUserId);
        if(!mongoose.isValidObjectId(projectId)) {
            throw createHttpError(400, "Invalid Project ID");
        }
        const project = await ProjectModel.findById(projectId).exec();
        if(!project) {
            throw createHttpError(404, "Project not found.");
        }
        if(!project.userId.equals(authenticatedUserId)) {
            throw createHttpError(401, "You are not authorised to access this note.");
        }
        const projectTasks = await getProjectTasks(projectId);
        res.status(200).json({ project, projectTasks });
    } catch(error) {
        next(error);
    }
};

interface CreateProjectBody {
    title?: string,
    text?: string,
    requiredBy?: string,
    completed?: boolean,
}

export const createProject: RequestHandler<unknown, unknown, CreateProjectBody, unknown> = async (req, res, next) => {
    const title = req.body.title;
    const text = req.body.text;
    const requiredBy = req.body.requiredBy;
    const completed = req.body.completed;
    const authenticatedUserId = req.session.userId;
    try {
        assertIsDefined(authenticatedUserId);
        if(!title || !text || !requiredBy) {
            throw createHttpError(400, "Project needs a title and details");
        }
        const newProject = await ProjectModel.create({
            userId: authenticatedUserId,
            title: title,
            text: text,
            requiredBy: requiredBy,
            completed: completed,
        });

        res.status(201).json(newProject);
    } catch(error) {
        next(error);
    }
};

interface UpdateProjectParams {
    projectId: string,
}

interface UpdateProjectBody {
    title?: string,
    text?: string,
    requiredBy?: string,
    completed?: boolean,
}

export const updateProject: RequestHandler<UpdateProjectParams, unknown, UpdateProjectBody, unknown> = async (req, res, next) => {
    const projectId = req.params.projectId;
    const newTitle = req.body.title;
    const newText = req.body.text;
    const newRequiredBy = req.body.requiredBy;
    const newCompleted = req.body.completed;
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId);
        if(!mongoose.isValidObjectId(projectId)) {
            throw createHttpError(400, "Invalid Project ID");
        }
        if(newTitle === undefined || newText === undefined || newRequiredBy === undefined || newCompleted === undefined) {
            throw createHttpError(400, "Project needs a title and details");
        }
        const project = await ProjectModel.findById(projectId).exec();
        if(!project) {
            throw createHttpError(404, "Project not found.");
        }
        if(!project.userId.equals(authenticatedUserId)) {
            throw createHttpError(401, "You are not authorised to access this note.");
        }

        project.title = newTitle;
        project.text = newText;
        project.requiredBy = newRequiredBy;
        project.completed = newCompleted;

        const updatedProject = await project.save();

        res.status(200).json(updatedProject);
    } catch(error) {
        next(error);
    }
};

export const deleteProject: RequestHandler = async (req, res, next) => {
    const projectId = req.params.projectId;
    const authenticatedUserId = req.session.userId;
    try {
        assertIsDefined(authenticatedUserId);
        if(!mongoose.isValidObjectId(projectId)) {
            throw createHttpError(400, "Invalid Project ID");
        }
        const project = await ProjectModel.findById(projectId).exec();
        if(!project) {
            throw createHttpError(404, "Project not found.");
        }
        if(!project.userId.equals(authenticatedUserId)) {
            throw createHttpError(401, "You are not authorised to access this note.");
        }
        await deleteAllProjectTasks(projectId);
        await project.deleteOne();
        res.sendStatus(204);
    } catch(error) {
        next(error);
    }
};
