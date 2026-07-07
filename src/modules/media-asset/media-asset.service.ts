import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { v2 as cloudinary } from 'cloudinary';
import { MediaAssetStatus, MediaAssetType } from 'src/generated/prisma/enums';
import { Prisma } from 'src/generated/prisma/client';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class MediaAssetService {
  #apiKey: string;
  #apiSecret: string;
  #cloudName: string;

  constructor(private readonly prisma: PrismaService) {
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    if (!apiKey || !apiSecret || !cloudName) {
      throw new Error('Cloudinary is not defined in environment variables');
    }
    this.#apiKey = apiKey;
    this.#apiSecret = apiSecret;
    this.#cloudName = cloudName;
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
      secure: true,
    });
  }

  async generateUploadSignature() {
    const filename = 'image_' + crypto.randomUUID();
    const folder = 'plms_uploads/images';
    const publicId = `${folder}/${filename}`;

    const paramsToSign = {
      public_id: filename,
      timestamp: Math.round(new Date().getTime() / 1000),
      allowed_formats: ['jpg', 'png', 'webp'], // Enforce file extensions
      folder: folder, // Force it into a specific folder
    };
    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      this.#apiSecret,
    );

    await this.prisma.mediaAsset.create({
      data: {
        publicId,
        resourceType: MediaAssetType.IMAGE,
      },
    });

    return {
      params: paramsToSign,
      signature,
      cloudName: this.#cloudName,
      apiKey: this.#apiKey,
    };
  }

  async fetchResourcesById(publicIds: string[]) {
    if (!publicIds || publicIds.length == 0) return [];
    const resources = await cloudinary.api.resources_by_ids(publicIds);
    const updatePromises = resources.resources.map((v) =>
      this.prisma.mediaAsset.update({
        where: { publicId: v.public_id },
        data: { version: `${v.version}`, format: v.format },
      }),
    );

    return await this.prisma.$transaction(updatePromises);
  }

  async updateResourceStatus(
    publicIds: string[],
    tx: Prisma.TransactionClient,
  ) {
    return await tx.mediaAsset.updateMany({
      where: { publicId: { in: publicIds } },
      data: { uploadStatus: MediaAssetStatus.ACTIVE },
    });
  }

  createPublicUrl(publicId: string) {
    return cloudinary.url(publicId);
  }

  @Cron('*/15 * * * *')
  async cleanOrphanResource() {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const orphanedAssets = await this.prisma.mediaAsset.findMany({
      where: {
        createdAt: {
          lt: twentyFourHoursAgo,
        },
        bookMediaAssets: {
          none: {},
        },
      },
    });
    const chunkSize = 100;
    for (let i = 0; i < orphanedAssets.length; i += chunkSize) {
      const chunk = orphanedAssets.slice(i, i + chunkSize);
      const publicIds = chunk.map((v) => v.publicId);
      try {
        await cloudinary.api.delete_resources(publicIds);
        await this.prisma.mediaAsset.deleteMany({
          where: { publicId: { in: publicIds } },
        });
      } catch (e) {
        console.log('Failure to clean orphans', e);
      }
    }
  }
}
