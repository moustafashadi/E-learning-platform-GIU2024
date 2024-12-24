import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PerformanceMatrix, PerformanceMatrixDocument } from '../models/performanceMatrix.schema';

interface QuizResult {
  score: number; // 1 for correct, 0 for incorrect
  weight: number; // e.g., easy = 1, medium = 2, hard = 3
}

@Injectable()
export class PerformanceMatrixService {
  constructor(
    @InjectModel(PerformanceMatrix.name) private performanceMatrixModel: Model<PerformanceMatrixDocument>
  ) {}

  async calculateNewPerformanceMatrix(
    studentId: string,
    moduleId: string,
    quizResults: QuizResult[],
    adjustmentFactor: number
  ): Promise<number> {
    const performanceMatrix = await this.performanceMatrixModel.findOne({ studentId, moduleId });

    if (!performanceMatrix) {
      throw new Error('Performance matrix not found');
    }

    const currentPM = performanceMatrix.performanceScore;

    // Calculate the total weighted score and total weight
    let totalWeightedScore = 0;
    let totalWeight = 0;

    quizResults.forEach(result => {
      totalWeightedScore += result.score * result.weight;
      totalWeight += result.weight;
    });

    // Calculate the average weighted score
    const averageWeightedScore = totalWeightedScore / totalWeight;

    // Calculate the new performance matrix
    const newPM = currentPM + (averageWeightedScore * adjustmentFactor);

    // Update the performance matrix in the database
    performanceMatrix.performanceScore = newPM;
    await performanceMatrix.save();

    return newPM;
  }
}