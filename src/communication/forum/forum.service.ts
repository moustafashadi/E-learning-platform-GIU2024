import { Body, Inject, NotFoundException, Req } from "@nestjs/common";
import {request, Request} from 'express';
import { InjectModel } from "@nestjs/mongoose";
import { Forum, ForumDocument} from "./forum.schema";
import { Model } from "mongoose";
import { UserService } from "src/user/services/user.service";
import { CourseService } from "src/course/services/course.service";
import { Instructor } from "src/user/models/user.schema";
import { create } from "domain";
import { Thread, ThreadDocument } from "./Thread.schema";

export class ForumServices{
    constructor(
        @InjectModel(Forum.name) private forumModel:Model<ForumDocument>,
        @InjectModel(Thread.name) private threadModel:Model<ThreadDocument>,

        //@InjectModel(Instructor.name) private instructorModel: Model<Instructor>,
        //@InjectModel(Reply.name) private replyModel:Model<ReplyDocument>,        
        private readonly userServices:UserService,
        private readonly courseServices:CourseService,
        ){}
    
    async createDiscussion(@Req() req:Request,courseID:string):Promise<Forum>{
        const userId = req.user['sub'];
        //const user= await this.userServices.getCurrentUser(userId);
        if (!await this.userServices.hasRole(userId, 'instructor')){ //3amlt add ll method de mn user service
            throw new NotFoundException (`You must be an instructor to create discussions`);
        
        }
        const createdDiscussion = new this.forumModel({
            courses: [this.courseServices.findOne(courseID)],
            Threads: [],
            title: req.body.title,
            description: req.body.description,
            createdBy: userId,
            tags:[]
        })
        console.log(createdDiscussion);
        return createdDiscussion.save();
        }
    
        async findOne(id:string):Promise<Forum>{
            const forum = await this.forumModel.findById(id).exec();
            if(!forum)
                throw new NotFoundException("there is no forum with this id");
            return forum;
        }
        async findAll():Promise<Forum[]>{
            return this.forumModel.find().exec();
        }
        async addThread(@Req() req:Request,forumid:string):Promise<Forum>{   
            const userId = req.user['sub'];
            const newThread = new this.threadModel({
                forum: this.findOne(forumid),
                message:[],
                createdBy:userId
            })
            const forum = await this.findOne(forumid);
            const savedThread = await newThread.save();
            forum.Threads.push(savedThread.id);
            return (forum as ForumDocument).save();
        }
        async findAllThreads():Promise<Thread[]>{
            return this.threadModel.find().exec();
        }
        async findOneThread(id:string):Promise<Thread>{
            const thread = await this.threadModel.findById(id).exec();
            if(!thread)
                throw new NotFoundException("there is no thread with this id");
            return thread;
        }
        async reply(@Req() req:Request , threadId:string,@Body()reply):Promise<Thread> { 
            const thread= await this.threadModel.findById(threadId);
            thread.replies.push(reply);
            return (thread as ThreadDocument).save(); 
        } 
        
    }