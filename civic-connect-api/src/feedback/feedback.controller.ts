import { Controller, Post, Body, Param, Req, UseGuards } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('complaints')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Post(':id/feedback')
  async submitFeedback(@Req() req: any, @Param('id') id: string, @Body() data: any) {
    return this.feedbackService.submitFeedback(req.user.id, id, data.rating, data.comments);
  }
}
