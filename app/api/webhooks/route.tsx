import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import {
  NumberDictionary,
  adjectives,
  animals,
  uniqueNamesGenerator,
} from "unique-names-generator";
import prisma from "@/prisma/client";
 
export async function POST(req: Request) {
 
  // You can find this in the Clerk Dashboard -> Webhooks -> choose the webhook
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET
 
  if (!WEBHOOK_SECRET) {
    throw new Error('Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local')
  }
 
  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");
 
  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400
    })
  }
 
  // Get the body
  const payload = await req.json()
  const body = JSON.stringify(payload);
 
  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);
 
  let evt: WebhookEvent
 
  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occured', {
      status: 400
    })
  }
 
  // Get the ID and type
  const { id } = evt.data;
  const eventType = evt.type;
 
  console.log(`Webhook with and ID of ${id} and type of ${eventType}`)
  console.log('Webhook body:', body)

  switch (eventType) {
    case "user.created":
      const emails = evt.data.email_addresses;
      let email= "fsf"//: string | null = null;
      let emailVerified: boolean | null = null;

      if (emails.length > 0) {
        email = emails[0].email_address;
        emailVerified = emails[0].verification?.status == "verified";
      }

      const numberDictionary = NumberDictionary.generate({
        min: 100,
        max: 9999,
      });
      const username = uniqueNamesGenerator({
        dictionaries: [adjectives, animals, numberDictionary],
        separator: "-",
      });

      const data = {
        clerkId: evt.data.id,
        firstName: evt.data.first_name,
        lastName: evt.data.last_name,
        email,
        emailVerified: emailVerified,
        username: username,
        profileImageUrl: evt.data.profile_image_url || evt.data.image_url,
        privateMetadata: { ...(evt.data.private_metadata as any) },
        publicMetadata: { ...(evt.data.public_metadata as any) },
        avatarImage: `https://api.dicebear.com/7.x/fun-emoji/svg/?seed=${username}`,
      };

      await prisma.user.create({ data });

      break;
    default:
      // Unhandled
      break;
  }
 
  return new Response('', { status: 200 })
}
 