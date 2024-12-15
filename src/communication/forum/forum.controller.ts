import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { AuthenticationGuard } from "src/auth/guards/authentication.guard";
import { ForumServices } from "./forum.service";
import { Request } from "express";
import { Req, } from "@nestjs/common";
import { threadId } from "worker_threads";

@UseGuards(AuthenticationGuard)
@Controller('forum')
export class ForumController {
  constructor(
    private readonly forumService: ForumServices
  ) {}

@Post("create")
 createDiscussion(@Req() req: Request,courseId:string){
    this.forumService.createDiscussion(req,courseId);
 }

@Get("all") 
 findAll(){
    return this.forumService.findAll();
 }

 @Get(":id")
 findOne(@Param('id') id:string){
    return this.forumService.findOne(id);
 }
 @Post("thread/:id")
 createThread(@Req() req:Request,@Param('id')forumid:string){
  return this.forumService.addThread(req,forumid);   
 }

// @Get("allThreads")
//  findAllThreads(){
//     return this.forumService.findAllThreads();
//   }

 @Get("thread/:id")
 findThread(@Param('id') id:string){
    return this.forumService.findOneThread(id);
 }

 @Post("reply/:id")
 createReply(@Req() req:Request,@Param('id') threadId:string,@Body() reply){
  return this.forumService.reply(req,threadId,reply);
 }


}