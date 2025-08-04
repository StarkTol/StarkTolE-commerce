import { NextRequest, NextResponse } from 'next/server';
import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { inngest } from '@/config/inngest';

type WebhookEvent = {
  data: {
    id: string;
    email_addresses: { email_address: string }[];
    image_url: string;
    username?: string;
  };
  type: string;
};

export async function POST(req: NextRequest) {
  console.log('🔗 Received webhook request from Clerk');
  
  // Get the headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  console.log('Webhook headers:', {
    svix_id: svix_id ? 'present' : 'missing',
    svix_timestamp: svix_timestamp ? 'present' : 'missing', 
    svix_signature: svix_signature ? 'present' : 'missing'
  });

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.error('❌ Missing required svix headers');
    return new Response('Error occurred -- no svix headers', {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET || '');

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occurred', {
      status: 400,
    });
  }

  // Handle the webhook
  const eventType = evt.type;
  console.log(`📨 Processing webhook event: ${eventType}`);
  console.log('Event data:', {
    userId: evt.data.id,
    email: evt.data.email_addresses?.[0]?.email_address,
    username: evt.data.username
  });

  if (eventType === 'user.created' || eventType === 'user.updated') {
    try {
      console.log('🚀 Sending user.created/updated event to Inngest...');
      
      // Send event to Inngest for processing
      const inngestResult = await inngest.send({
        name: "clerk/user.created",
        data: evt.data,
      });
      
      console.log(`✅ Successfully sent ${eventType} event to Inngest:`, {
        userId: evt.data.id,
        eventId: inngestResult.ids?.[0]
      });
      
      return NextResponse.json({ 
        received: true, 
        processed: true,
        eventType,
        userId: evt.data.id,
        inngestEventId: inngestResult.ids?.[0]
      });
      
    } catch (error) {
      console.error('❌ Error sending event to Inngest:', error);
      // Don't fail the webhook if Inngest fails, but log it
      return NextResponse.json({ 
        received: true, 
        processed: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        eventType,
        userId: evt.data.id
      });
    }
  } else if (eventType === 'user.deleted') {
    try {
      console.log('🗑️ Sending user.deleted event to Inngest...');
      
      // Send deletion event to Inngest for processing
      const inngestResult = await inngest.send({
        name: "clerk/user.deleted",
        data: evt.data,
      });
      
      console.log(`✅ Successfully sent ${eventType} event to Inngest:`, {
        userId: evt.data.id,
        eventId: inngestResult.ids?.[0]
      });
      
      return NextResponse.json({ 
        received: true, 
        processed: true,
        eventType,
        userId: evt.data.id,
        inngestEventId: inngestResult.ids?.[0]
      });
      
    } catch (error) {
      console.error('❌ Error sending deletion event to Inngest:', error);
      return NextResponse.json({ 
        received: true, 
        processed: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        eventType,
        userId: evt.data.id
      });
    }
  } else {
    console.log(`⚠️ Ignoring event type: ${eventType}`);
  }

  return NextResponse.json({ 
    received: true, 
    processed: false,
    reason: `Event type '${eventType}' not handled`,
    supportedEvents: ['user.created', 'user.updated', 'user.deleted']
  });
}

export async function GET() {
  // This endpoint is useful for webhook verification and testing
  console.log('GET request to Clerk webhook endpoint');
  
  return NextResponse.json({
    message: "Clerk Webhook Endpoint",
    status: "active",
    methods: ["POST"],
    description: "This endpoint receives Clerk webhook events for user.created, user.updated, and user.deleted",
    configuration: {
      webhookSecret: process.env.CLERK_WEBHOOK_SECRET ? "configured" : "missing",
      inngestClient: "configured",
      supportedEvents: ["user.created", "user.updated", "user.deleted"]
    },
    testEndpoint: "Use POST /api/test-user-registration to test the full flow",
    timestamp: new Date().toISOString()
  });
}
