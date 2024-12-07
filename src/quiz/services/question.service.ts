import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Question } from 'src/quiz/models/question.schema';
import { CreateQuestionDto } from 'src/quiz/dto/create-question.dto';
import { UpdateQuestionDto } from 'src/quiz/dto/update-question.dto';


@Injectable()
export class QuestionService {
  getQuestionsByDifficulty(difficulty: string) {
      throw new Error('Method not implemented.');
  }
  constructor(@InjectModel(Question.name) private questionModel: Model<Question>) {}

  async create(createQuestionDto: CreateQuestionDto): Promise<Question> {
    const createdQuestion = new this.questionModel(createQuestionDto);
    return createdQuestion.save();
  }

  async update(id: string, updateQuestionDto: UpdateQuestionDto): Promise<Question> {
    return this.questionModel.findByIdAndUpdate(id, updateQuestionDto, { new: true });
  }
}
