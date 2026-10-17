import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";

@Injectable()
export class CryptoService {
  private readonly algorithm = "aes-256-gcm";
  private readonly encryptionKey: Buffer;

  constructor(private readonly configService: ConfigService) {
    const secret = this.configService.get<string>("ENCRYPTION_KEY");

    if (!secret) {
      throw new InternalServerErrorException(
        "ENCRYPTION_KEY is not configured"
      );
    }

    this.encryptionKey = Buffer.from(secret, "base64");

    if (this.encryptionKey.length !== 32) {
      throw new InternalServerErrorException(
        "ENCRYPTION_KEY must decode to 32 bytes"
      );
    }
  }

  encrypt(value: string): string {
    const iv = randomBytes(12);

    const cipher = createCipheriv(this.algorithm, this.encryptionKey, iv);

    const encrypted = Buffer.concat([
      cipher.update(value, "utf8"),
      cipher.final()
    ]);

    const authTag = cipher.getAuthTag();

    return [
      iv.toString("base64"),
      authTag.toString("base64"),
      encrypted.toString("base64")
    ].join(":");
  }

  decrypt(value: string): string {
    const [iv, authTag, encrypted] = value.split(":");

    if (!iv || !authTag || !encrypted) {
      throw new InternalServerErrorException("Invalid encrypted key format");
    }

    try {
      const decipher = createDecipheriv(
        this.algorithm,
        this.encryptionKey,
        Buffer.from(iv, "base64")
      );

      decipher.setAuthTag(Buffer.from(authTag, "base64"));

      return Buffer.concat([
        decipher.update(Buffer.from(encrypted, "base64")),
        decipher.final()
      ]).toString("utf8");
    } catch {
      throw new InternalServerErrorException("Unable to decrypt API key");
    }
  }
}
