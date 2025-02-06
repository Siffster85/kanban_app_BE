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
exports.deleteAllProjectTasks = exports.deleteTask = exports.updateTask = exports.createTask = exports.getTask = exports.getProjectTasks = exports.getTasks = void 0;
const taskModel_1 = __importDefault(require("../models/taskModel"));
const http_errors_1 = __importDefault(require("http-errors"));
const mongoose_1 = __importDefault(require("mongoose"));
const assertIsDefined_1 = require("../util/assertIsDefined");
const getTasks = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const projectId = req.params.projectId;
    const authenticatedUserId = req.session.userId;
    try {
        (0, assertIsDefined_1.assertIsDefined)(authenticatedUserId);
        const tasks = yield taskModel_1.default.find({ projectId: projectId }).exec();
        res.status(200).json(tasks);
    }
    catch (error) {
        next(error);
    }
});
exports.getTasks = getTasks;
const getProjectTasks = (projectId) => __awaiter(void 0, void 0, void 0, function* () {
    // eslint-disable-next-line no-useless-catch
    try {
        const tasks = yield taskModel_1.default.find({ projectId: projectId }).exec();
        return tasks;
    }
    catch (error) {
        throw error;
    }
});
exports.getProjectTasks = getProjectTasks;
const getTask = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const taskId = req.params.taskId;
    const authenticatedUserId = req.session.userId;
    try {
        (0, assertIsDefined_1.assertIsDefined)(authenticatedUserId);
        if (!mongoose_1.default.isValidObjectId(taskId)) {
            throw (0, http_errors_1.default)(400, "Invalid Task ID");
        }
        const task = yield taskModel_1.default.findById(taskId).exec();
        if (!task) {
            throw (0, http_errors_1.default)(404, "Task not found.");
        }
        if (!task.userId.equals(authenticatedUserId)) {
            throw (0, http_errors_1.default)(401, "You are not authorised to access this note.");
        }
        res.status(200).json(task);
    }
    catch (error) {
        next(error);
    }
});
exports.getTask = getTask;
const createTask = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const projectId = req.body.projectId;
    const title = req.body.title;
    const text = req.body.text;
    const completed = req.body.completed;
    const authenticatedUserId = req.session.userId;
    try {
        (0, assertIsDefined_1.assertIsDefined)(authenticatedUserId);
        if (!title || !text) {
            throw (0, http_errors_1.default)(400, "Task needs a title and details");
        }
        const newTask = yield taskModel_1.default.create({
            projectId: projectId,
            userId: authenticatedUserId,
            title: title,
            text: text,
            completed: completed,
        });
        res.status(201).json(newTask);
    }
    catch (error) {
        next(error);
    }
});
exports.createTask = createTask;
const updateTask = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const taskId = req.params.taskId;
    const newTitle = req.body.title;
    const newText = req.body.text;
    const newCompleted = req.body.completed;
    const authenticatedUserId = req.session.userId;
    try {
        (0, assertIsDefined_1.assertIsDefined)(authenticatedUserId);
        if (!mongoose_1.default.isValidObjectId(taskId)) {
            throw (0, http_errors_1.default)(400, "Invalid Task ID");
        }
        if (!newTitle || !newText) {
            throw (0, http_errors_1.default)(400, "Task needs a title and details");
        }
        const task = yield taskModel_1.default.findById(taskId).exec();
        if (!task) {
            throw (0, http_errors_1.default)(404, "Task not found.");
        }
        if (!task.userId.equals(authenticatedUserId)) {
            throw (0, http_errors_1.default)(401, "You are not authorised to access this note.");
        }
        task.title = newTitle;
        task.text = newText;
        task.completed = newCompleted;
        const updatedTask = yield task.save();
        res.status(200).json(updatedTask);
    }
    catch (error) {
        next(error);
    }
});
exports.updateTask = updateTask;
const deleteTask = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const taskId = req.params.taskId;
    const authenticatedUserId = req.session.userId;
    try {
        (0, assertIsDefined_1.assertIsDefined)(authenticatedUserId);
        if (!mongoose_1.default.isValidObjectId(taskId)) {
            throw (0, http_errors_1.default)(400, "Invalid Task ID");
        }
        const task = yield taskModel_1.default.findById(taskId).exec();
        if (!task) {
            throw (0, http_errors_1.default)(404, "Task not found.");
        }
        if (!task.userId.equals(authenticatedUserId)) {
            throw (0, http_errors_1.default)(401, "You are not authorised to access this note.");
        }
        yield task.deleteOne();
        res.sendStatus(204);
    }
    catch (error) {
        next(error);
    }
});
exports.deleteTask = deleteTask;
const deleteAllProjectTasks = (projectId) => __awaiter(void 0, void 0, void 0, function* () {
    // eslint-disable-next-line no-useless-catch
    try {
        // Validate projectId
        if (!mongoose_1.default.isValidObjectId(projectId)) {
            throw new Error("Invalid Project ID");
        }
        // Delete all tasks with the given projectId
        yield taskModel_1.default.deleteMany({ projectId });
    }
    catch (error) {
        throw error;
    }
});
exports.deleteAllProjectTasks = deleteAllProjectTasks;
