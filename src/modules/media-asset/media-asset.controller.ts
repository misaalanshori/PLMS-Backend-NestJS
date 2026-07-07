import { Controller, Post } from '@nestjs/common';
import { MediaAssetService } from './media-asset.service';

@Controller('media-assets')
export class MediaAssetController {
  constructor(private readonly mediaAssetService: MediaAssetService) {}

  @Post('generate-signature')
  generateSignature() {
    return this.mediaAssetService.generateUploadSignature();
  }
}
