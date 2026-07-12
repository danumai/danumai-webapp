import { fetchObject } from "@/lib/storage";

// Streams uploaded images back to the browser from the object store using the
// server's credentials, so display doesn't depend on the bucket being public.
export async function GET(
  _req: Request,
  ctx: RouteContext<"/api/media/[...key]">
) {
  const { key } = await ctx.params;
  const objectKey = key.map((seg) => decodeURIComponent(seg)).join("/");

  const object = await fetchObject(objectKey);
  if (!object) {
    return new Response("Not found", { status: 404 });
  }

  return new Response(Buffer.from(object.body), {
    status: 200,
    headers: {
      "Content-Type": object.contentType,
      // Uploaded assets are content-addressed by UUID, so they never change
      // once written — cache aggressively at the browser and any CDN.
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
