import {
    Injectable,
    NotFoundException,
    BadRequestException,
    UnauthorizedException,
  } from '@nestjs/common';
  import { InjectModel } from '@nestjs/mongoose';
  import mongoose, { Model } from 'mongoose';
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
  
    async createForum(courseId: string, payload: { title: string; content: string; tag: string; createdBy: string }): Promise<Forum> {
      const course = await this.courseModel.findById(courseId).exec();
      if (!course) {
        throw new NotFoundException(`Course with ID ${courseId} not found`);
      }
  
      const newForum = new this.forumModel({
        course: courseId,
        title: payload.title || `${course.title} Forum`, // Use provided title or default
        description: `Discussion forum for the course ${course.title}`,
        content: payload.content,
        tag: payload.tag,
        createdBy: payload.createdBy,
      });
  
      const createdForum = await newForum.save();
  
      // Link the forum to the course
      course.forums.push(createdForum._id as unknown as mongoose.ObjectId);
      await course.save();
  
      return createdForum;
    }
  
      // Delete a forum
  async deleteForum(courseId: string, forumId: string): Promise<void> {
    const course = await this.courseModel.findById(courseId).exec();
    if (!course) {
      throw new NotFoundException(`Course with ID ${courseId} not found`);
    }

    const forum = await this.forumModel.findById(forumId).exec();
    if (!forum) {
      throw new NotFoundException(`Forum with ID ${forumId} not found`);
    }

    // Recursively delete threads within the forum
    for (const threadId of forum.threads) {
      await this.deleteThreadRecursively(threadId.toString());
    }

    // Delete the forum
    await this.forumModel.findByIdAndDelete(forumId).exec();

    // Remove the forum reference from the course's forums array
    course.forums = course.forums.filter((id) => id.toString() !== forumId.toString());
    await course.save();
  }

  // Instructor deletes a student's forum
  async instructordeleteStudentForum(courseId: string, forumId: string, instructorId: string): Promise<void> {
    console.log('Instructor ID:', instructorId); // Log instructor ID
    console.log('Course ID:', courseId); // Log course ID
    console.log('Forum ID:', forumId); // Log forum ID
  
    const course = await this.courseModel.findById(courseId).exec();
    if (!course) {
      console.log('Course not found');
      throw new NotFoundException(`Course with ID ${courseId} not found`);
    }
    console.log('Course Found:', course); // Log course object
  
    // Verify that the logged-in user is the instructor of the course
    
    
  
    const forum = await this.forumModel.findById(forumId).exec();
    if (!forum) {
      console.log('Forum not found');
      throw new NotFoundException(`Forum with ID ${forumId} not found`);
    }
    console.log('Forum Found:', forum); // Log forum object
  
    // Ensure the forum is not created by the instructor
    if (forum.createdBy.toString() === instructorId) {
      console.log('Unauthorized: Instructors cannot delete their own forums'); // Log unauthorized
      throw new UnauthorizedException('Instructors cannot delete their own forums using this API');
    }
  
    // Proceed with forum deletion
    await this.forumModel.findByIdAndDelete(forumId).exec();
    course.forums = course.forums.filter((id) => id.toString() !== forumId);
    await course.save();
    console.log('Forum deleted successfully'); // Log success
  }
  
  
  

  // Recursively delete threads within a forum
  private async deleteThreadRecursively(threadId: string): Promise<void> {
    const thread = await this.threadModel.findById(threadId).exec();
    if (!thread) {
      throw new NotFoundException(`Thread with ID ${threadId} not found`);
    }

    // Recursively delete replies or other nested structures if applicable
    for (const replyId of thread.threads) {
      await this.deleteReply(replyId.toString());
    }

    // Delete the thread
    await this.threadModel.findByIdAndDelete(threadId).exec();
  }

  // Helper method: Delete a reply (if applicable)
  private async deleteReply(replyId: string): Promise<void> {
    const thread = await this.threadModel.findById(replyId).exec();
    if (!thread) {
      return; // Skip if the reply does not exist
    }

    // Recursively delete nested replies
    for (const nestedReplyId of thread.threads) {
      await this.deleteReply(nestedReplyId.toString());
    }

    // Delete the reply itself
    await this.threadModel.findByIdAndDelete(replyId).exec();
  }
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
    // async deleteThreadRecursively(threadId: string): Promise<void> {
    //   const t = await this.threadModel.findById(threadId).exec();
    //   if (!t) return; // already removed
  
    //   // delete sub-threads
    //   for (const subTId of t.threads) {
    //     await this.deleteThreadRecursively(subTId.toString());
    //   }
    //   // now remove self
    //   await this.threadModel.findByIdAndDelete(threadId).exec();
    // }
  
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