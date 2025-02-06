"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProject = exports.updateProject = exports.createProject = exports.getProject = exports.getProjects = void 0;
const projectModel_1 = __importDefault(require("../models/projectModel"));
const http_errors_1 = __importDefault(require("http-errors"));
const mongoose_1 = __importDefault(require("mongoose"));
const assertIsDefined_1 = require("../util/assertIsDefined");
const tasksController_1 = require("./tasksController");
const getProjects = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authenticatedUserId = req.session.userId;
    try {
        (0, assertIsDefined_1.assertIsDefined)(authenticatedUserId);
        const projects = yield projectModel_1.default.find({ userId: authenticatedUserId }).exec();
        res.status(200).json(projects);
    }
    catch (error) {
        next(error);
    }
});
exports.getProjects = getProjects;
const getProject = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const projectId = req.params.projectId;
    const authenticatedUserId = req.session.userId;
    try {
        (0, assertIsDefined_1.assertIsDefined)(authenticatedUserId);
        if (!mongoose_1.default.isValidObjectId(projectId)) {
            throw (0, http_errors_1.default)(400, "Invalid Project ID");
        }
        const project = yield projectModel_1.default.findById(projectId).exec();
        if (!project) {
            throw (0, http_errors_1.default)(404, "Project not found.");
        }
        if (!project.userId.equals(authenticatedUserId)) {
            throw (0, http_errors_1.default)(401, "You are not authorised to access this note.");
        }
        const projectTasks = yield (0, tasksController_1.getProjectTasks)(projectId);
        res.status(200).json({ project, projectTasks });
    }
    catch (error) {
        next(error);
    }
});
exports.getProject = getProject;
const createProject = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const title = req.body.title;
    const text = req.body.text;
    const requiredBy = req.body.requiredBy;
    const completed = req.body.completed;
    const authenticatedUserId = req.session.userId;
    try {
        (0, assertIsDefined_1.assertIsDefined)(authenticatedUserId);
        if (!title || !text || !requiredBy) {
            throw (0, http_errors_1.default)(400, "Project needs a title and details");
        }
        const newProject = yield projectModel_1.default.create({
            userId: authenticatedUserId,
            title: title,
            text: text,
            requiredBy: requiredBy,
            completed: completed,
        });
        res.status(201).json(newProject);
    }
    catch (error) {
        next(error);
    }
});
exports.createProject = createProject;
const updateProject = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const projectId = req.params.projectId;
    const newTitle = req.body.title;
    const newText = req.body.text;
    const newRequiredBy = req.body.requiredBy;
    const newCompleted = req.body.completed;
    const authenticatedUserId = req.session.userId;
    try {
        (0, assertIsDefined_1.assertIsDefined)(authenticatedUserId);
        if (!mongoose_1.default.isValidObjectId(projectId)) {
            throw (0, http_errors_1.default)(400, "Invalid Project ID");
        }
        if (newTitle === undefined || newText === undefined || newRequiredBy === undefined || newCompleted === undefined) {
            throw (0, http_errors_1.default)(400, "Project needs a title and details");
        }
        const project = yield projectModel_1.default.findById(projectId).exec();
        if (!project) {
            throw (0, http_errors_1.default)(404, "Project not found.");
        }
        if (!project.userId.equals(authenticatedUserId)) {
            throw (0, http_errors_1.default)(401, "You are not authorised to access this note.");
        }
        project.title = newTitle;
        project.text = newText;
        project.requiredBy = newRequiredBy;
        project.completed = newCompleted;
        const updatedProject = yield project.save();
        res.status(200).json(updatedProject);
    }
    catch (error) {
        next(error);
    }
});
exports.updateProject = updateProject;
const deleteProject = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const projectId = req.params.projectId;
    const authenticatedUserId = req.session.userId;
    try {
        (0, assertIsDefined_1.assertIsDefined)(authenticatedUserId);
        if (!mongoose_1.default.isValidObjectId(projectId)) {
            throw (0, http_errors_1.default)(400, "Invalid Project ID");
        }
        const project = yield projectModel_1.default.findById(projectId).exec();
        if (!project) {
            throw (0, http_errors_1.default)(404, "Project not found.");
        }
        if (!project.userId.equals(authenticatedUserId)) {
            throw (0, http_errors_1.default)(401, "You are not authorised to access this note.");
        }
        yield (0, tasksController_1.deleteAllProjectTasks)(projectId);
        yield project.deleteOne();
        res.sendStatus(204);
    }
    catch (error) {
        next(error);
    }
});
exports.deleteProject = deleteProject;
