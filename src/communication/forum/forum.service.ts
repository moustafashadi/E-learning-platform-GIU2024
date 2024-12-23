import {
    Injectable,
    NotFoundException,
    BadRequestException,
  } from '@nestjs/common';
  import { InjectModel } from '@nestjs/mongoose';
  import { Model } from 'mongoose';
  import { Forum , ForumDocument } from './forum.schema';
  import { Thread, ThreadDocument } from './Thread.schema';
  
  // We assume you have a Course schema in 'course.schema' 
  // with a forums array of Forum refs
  import { Course, CourseDocument } from 'src/course/models/course.schema';
  
  @Injectable()
  export class ForumService {
    constructor(
      @InjectModel(Forum.name) private readonly forumModel: Model<ForumDocument>,
      @InjectModel(Thread.name) private readonly threadModel: Model<ThreadDocument>,
      @InjectModel(Course.name) private readonly courseModel: Model<CourseDocument>,
    ) {}
  
    /**
     * CREATE Forum => 
     *   1) create new Forum doc,
     *   2) push the forum._id into the Course.forums array
     */

  
    /**
     * GET all forums for a *particular course* 
     * by looking at the course's `forums` array.
     */
    async getForumsForCourse(courseId: string): Promise<Forum[]> {
      const course = await this.courseModel
        .findById(courseId)
        .populate({
          path: 'forums',
          // optionally populate Forum => threads => ...
          populate: {
            path: 'threads',
            model: 'Thread',
            populate: {
              path: 'threads',
              model: 'Thread',
            },
          },
        })
        .exec();
      if (!course) {
        throw new NotFoundException(`Course with id=${courseId} not found`);
      }
  
      // The course.forums is an array of Forum docs if populated
      return course.forums as unknown as Forum[]; // cast because you used populate
    }
  
    /**
     * ADD THREAD TO A FORUM
     * 1) create new Thread doc
     * 2) push to Forum.threads
     */
    async addThreadToForum(
      forumId: string,
      content: string,
      createdBy: string, // user ID
    ): Promise<Forum> {
      // 1) find the forum
      const forum = await this.forumModel.findById(forumId).exec();
      if (!forum) {
        throw new NotFoundException(`Forum with id=${forumId} not found`);
      }
  
      // 2) create a new Thread
      const newThread = await this.threadModel.create({
        content,
        threads: [],
        createdBy,  // The user who created this thread
      });
  
      // 3) push into forum.threads
      forum.threads.push(newThread._id as any);
      await forum.save();
  
      // optionally return the updated Forum 
      return forum;
    }
  
    /**
     * ADD THREAD TO A THREAD (sub-thread)
     * 1) find the parent thread
     * 2) create new sub-thread doc
     * 3) push sub-thread into parentThread.threads
     */
    async addThreadToThread(
      parentThreadId: string,
      content: string,
      createdBy: string,
    ): Promise<Thread> {
      // 1) find parent thread
      const parentThread = await this.threadModel.findById(parentThreadId).exec();
      if (!parentThread) {
        throw new NotFoundException(`Parent thread ${parentThreadId} not found`);
      }
  
      // 2) create sub-thread
      const newSubThread = await this.threadModel.create({
        content,
        threads: [],
        createdBy,
      });
  
      // 3) push subThread._id into parentThread.threads
      parentThread.threads.push(newSubThread._id as any);
      await parentThread.save();
  
      return parentThread;
    }
  
    /**
     * UPDATE FORUM => only allow update of `title` and `content`
     */
    async updateForum(
      forumId: string,
      title?: string,
      content?: string,
    ): Promise<Forum> {
      const forum = await this.forumModel.findById(forumId).exec();
      if (!forum) {
        throw new NotFoundException(`Forum ${forumId} not found`);
      }
      // only update if provided
      if (title) forum.title = title;
      if (content) forum.content = content;
  
      return forum.save();
    }
  
    /**
     * UPDATE THREAD => only allow update of `content`
     */
    async updateThread(threadId: string, content?: string): Promise<Thread> {
      const thread = await this.threadModel.findById(threadId).exec();
      if (!thread) {
        throw new NotFoundException(`Thread ${threadId} not found`);
      }
  
      if (content) {
        thread.content = content;
      }
  
      return thread.save();
    }
  
    // optional: get a single Forum
    async getForumById(forumId: string): Promise<Forum> {
      const forum = await this.forumModel
        .findById(forumId)
        .populate({
          path: 'threads',
          populate: {
            path: 'threads',
            model: 'Thread',
            populate: {
              path: 'threads',
              model: 'Thread',
            },
          },
        })
        .exec();
      if (!forum) {
        throw new NotFoundException(`Forum ${forumId} not found`);
      }
      return forum;
    }
  
    // optional: get a single Thread
    async getThreadById(threadId: string): Promise<Thread> {
      const t = await this.threadModel
        .findById(threadId)
        .populate({
          path: 'threads',
          model: 'Thread',
        })
        .exec();
      if (!t) {
        throw new NotFoundException(`Thread ${threadId} not found`);
      }
      return t;
    }
  
    /**
     * Delete a Forum => remove from `course.forums[]`, 
     * and optionally recursively delete its threads. 
     * (Implementation depends on your choice.)
     */

  
    /**
     * Recursively delete a Thread and sub-threads
     */
    async deleteThreadRecursively(threadId: string): Promise<void> {
      const t = await this.threadModel.findById(threadId).exec();
      if (!t) return; // already removed
  
      // delete sub-threads
      for (const subTId of t.threads) {
        await this.deleteThreadRecursively(subTId.toString());
      }
      // now remove self
      await this.threadModel.findByIdAndDelete(threadId).exec();
    }
  
    /**
     * Delete a single thread 
     * => also remove from parent's array 
     * => recursively delete sub-threads
     */
    async deleteThread(threadId: string): Promise<void> {
      // We might also remove references from forum.threads if it’s top-level
      // or from parent's thread array if it’s sub-thread 
      // But you have to track the parent if you want to do that.
  
      await this.deleteThreadRecursively(threadId);
    }

    
  }
  
  export default ForumService;