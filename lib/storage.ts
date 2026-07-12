import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";

function s3Client() {
  const endpoint = process.env.S3_ENDPOINT;
  const accessKeyId = process.env.S3_ACCESS_KEY_ID;
  const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY;
  if (!endpoint || !accessKeyId || !secretAccessKey) {
    throw new Error(
      "S3 storage is not configured (S3_ENDPOINT / S3_ACCESS_KEY_ID / S3_SECRET_ACCESS_KEY)"
    );
  }
  return new S3Client({
    endpoint,
    region: process.env.S3_REGION || "auto",
    credentials: { accessKeyId, secretAccessKey },
    forcePathStyle: process.env.S3_FORCE_PATH_STYLE !== "false",
  });
}

function bucketName() {
  const bucket = process.env.S3_BUCKET;
  if (!bucket) throw new Error("S3 storage is not configured (S3_BUCKET)");
  return bucket;
}

const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
  "image/svg+xml",
]);

// Images are stored in the object store but served back through this app at
// /api/media/<key>. That way display never depends on the bucket being public
// (many S3-compatible providers don't support per-object ACLs or the
// bucket-policy API), and we don't need a correct S3_PUBLIC_URL. The value
// returned here is what gets saved to the database and used as an <img src>.
const MEDIA_PREFIX = "/api/media/";

export async function uploadImage(file: File, prefix = "projects"): Promise<string> {
  if (!ALLOWED_TYPES.has(file.type)) {
    throw new Error("Unsupported image type. Use PNG, JPEG, WebP, GIF, or SVG.");
  }
  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error("Image is too large (max 8MB).");
  }

  const ext = file.name.includes(".")
    ? file.name.split(".").pop()
    : file.type.split("/")[1];
  const key = `${prefix}/${randomUUID()}.${ext}`;
  const body = Buffer.from(await file.arrayBuffer());

  await s3Client().send(
    new PutObjectCommand({
      Bucket: bucketName(),
      Key: key,
      Body: body,
      ContentType: file.type,
      // Only send an ACL when explicitly opted in — most S3-compatible
      // providers reject it. Not required for display since we proxy reads.
      ...(process.env.S3_SET_ACL === "true"
        ? { ACL: "public-read" as const }
        : {}),
    })
  );

  return `${MEDIA_PREFIX}${key}`;
}

/** Extract the object key from a stored media path (or a legacy full URL). */
export function keyFromMediaPath(pathOrUrl: string): string | null {
  const idx = pathOrUrl.indexOf(MEDIA_PREFIX);
  if (idx === -1) return null;
  return pathOrUrl.slice(idx + MEDIA_PREFIX.length) || null;
}

export async function deleteImage(pathOrUrl: string) {
  const key = keyFromMediaPath(pathOrUrl);
  if (!key) return;
  try {
    await s3Client().send(
      new DeleteObjectCommand({ Bucket: bucketName(), Key: key })
    );
  } catch (err) {
    console.error("deleteImage failed", err);
  }
}

export type FetchedObject = {
  body: Uint8Array;
  contentType: string;
};

/** Fetch an object's bytes from the store (used by the /api/media route). */
export async function fetchObject(key: string): Promise<FetchedObject | null> {
  try {
    const res = await s3Client().send(
      new GetObjectCommand({ Bucket: bucketName(), Key: key })
    );
    if (!res.Body) return null;
    const body = await res.Body.transformToByteArray();
    return {
      body,
      contentType: res.ContentType || "application/octet-stream",
    };
  } catch (err) {
    console.error("fetchObject failed", err);
    return null;
  }
}
