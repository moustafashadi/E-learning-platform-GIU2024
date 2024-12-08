import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as fs from 'fs-extra';
import * as path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as dotenv from 'dotenv';

dotenv.config();
const execAsync = promisify(exec);

@Injectable()
export class BackupService {
    private readonly logger = new Logger(BackupService.name);
    private readonly backupDir = path.join(process.cwd(), 'backups');

    constructor() {
        // Ensure backup directory exists
        fs.ensureDirSync(this.backupDir);
    }

    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    async handleDailyBackup() {
        try {
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const backupPath = path.join(this.backupDir, `backup-${timestamp}`);

            // Create backup using mongodump
            await this.createMongoBackup(backupPath);

            // Cleanup old backups (keep last 7 days)
            await this.cleanupOldBackups();

            this.logger.log(`Backup completed successfully at ${backupPath}`);
        } catch (error) {
            this.logger.error('Backup failed:', error);
        }
    }

    private async createMongoBackup(backupPath: string): Promise<void> {
        const { MONGO_URI } = process.env;
        
        if (!MONGO_URI) {
            throw new Error('MongoDB URI not found in environment variables');
        }

        const command = `mongodump --uri="${MONGO_URI}" --out="${backupPath}"`;
        
        try {
            await execAsync(command);
            
            // Create a metadata file with backup information
            const metadata = {
                timestamp: new Date().toISOString(),
                databaseUri: MONGO_URI.split('@')[1], // Don't log credentials
                collections: ['users', 'courses', 'progress'] // Add your critical collections
            };

            await fs.writeJSON(path.join(backupPath, 'backup-metadata.json'), metadata);
            
            this.logger.log(`MongoDB backup created at ${backupPath}`);
        } catch (error) {
            throw new Error(`MongoDB backup failed: ${error.message}`);
        }
    }

    private async cleanupOldBackups(): Promise<void> {
        const MAX_BACKUP_AGE_DAYS = 7;
        const files = await fs.readdir(this.backupDir);
        
        const now = new Date();
        for (const file of files) {
            const filePath = path.join(this.backupDir, file);
            const stats = await fs.stat(filePath);
            
            const ageInDays = (now.getTime() - stats.mtime.getTime()) / (1000 * 60 * 60 * 24);
            
            if (ageInDays > MAX_BACKUP_AGE_DAYS) {
                await fs.remove(filePath);
                this.logger.log(`Removed old backup: ${file}`);
            }
        }
    }

    // Method for manual backup trigger (admin only)
    async triggerManualBackup(): Promise<string> {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupPath = path.join(this.backupDir, `manual-backup-${timestamp}`);
        
        await this.createMongoBackup(backupPath);
        return backupPath;
    }

    // Method to restore from a backup (admin only)
    async restoreFromBackup(backupPath: string): Promise<void> {
        const { MONGO_URI } = process.env;
        
        if (!MONGO_URI) {
            throw new Error('MongoDB URI not found in environment variables');
        }

        const command = `mongorestore --uri="${MONGO_URI}" "${backupPath}"`;
        
        try {
            await execAsync(command);
            this.logger.log(`Restored from backup: ${backupPath}`);
        } catch (error) {
            throw new Error(`Restore failed: ${error.message}`);
        }
    }
} 