import { Controller, Post, UseGuards, Param } from '@nestjs/common';
import { BackupService } from '../service/backup.service';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '../../auth/decorators/roles.decorator';
import * as path from 'path';

@Controller('backup')
@Roles(Role.Admin) // Only admins can access backup operations
export class BackupController {
    constructor(private readonly backupService: BackupService) {}

    @Post('manual')
    async triggerManualBackup() {
        const backupPath = await this.backupService.triggerManualBackup();
        return { message: 'Manual backup completed', path: backupPath };
    }

    @Post('restore/:timestamp')
    async restoreBackup(@Param('timestamp') timestamp: string) {
        const backupPath = path.join(process.cwd(), 'backups', `backup-${timestamp}`);
        await this.backupService.restoreFromBackup(backupPath);
        return { message: 'Restore completed successfully' };
    }
} 