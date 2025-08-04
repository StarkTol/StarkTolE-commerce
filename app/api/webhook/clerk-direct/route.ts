import { NextRequest, NextResponse } from 'next/server';
import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { connectDB } from '@/lib/mongo';
import User from '@/models/User';

type WebhookEvent = {
  data: {
    id: string;
    email_addresses: { email_address: string }[];
    image_url: string;
    username?: string;
    first_name?: string;
    last_name?: string;
  };
  type: string;
};

export async function POST(req: NextRequest) {
  console.log('🔗 Direct Clerk webhook (bypassing Inngest)');
  
  // Get the headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

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

  // Handle the webhook directly
  const eventType = evt.type;
  console.log(`📨 Processing webhook event directly: ${eventType}`);

  try {
    await connectDB();

    if (eventType === 'user.created' || eventType === 'user.updated') {
      const { id, email_addresses, image_url, username, first_name, last_name } = evt.data;
      
      const userName = username || `${first_name || ''} ${last_name || ''}`.trim() || 'User';
      const userEmail = email_addresses?.[0]?.email_address;
      
      if (!userEmail) {
        throw new Error('No email found in user data');
      }
      
      console.log('💾 Saving user directly to database:', {
        id,
        email: userEmail,
        name: userName,
        imageUrl: image_url
      });
      
      const updateResult = await User.updateOne(
        { _id: id },
        {
          $set: {
            _id: id,
            email: userEmail,
            name: userName,
            imageUrl: image_url || '',
            cartItems: {},
          },
        },
        { upsert: true }
      );
      
      console.log('✅ Database update result:', updateResult);
      
      return NextResponse.json({ 
        received: true, 
        processed: true,
        eventType,
        userId: id,
        method: 'direct-database'
      });
      
    } else if (eventType === 'user.deleted') {
      const { id } = evt.data;
      
      console.log('🗑️ Deleting user directly from database:', { id });
      
      const deleteResult = await User.deleteOne({ _id: id });
      
      console.log('✅ Database deletion result:', deleteResult);
      
      return NextResponse.json({ 
        received: true, 
        processed: true,
        eventType,
        userId: id,
        deletedCount: deleteResult.deletedCount,
        method: 'direct-database'
      });
    }
    
  } catch (error) {
    console.error('❌ Direct processing error:', error);
    return NextResponse.json({ 
      received: true, 
      processed: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      eventType,
      method: 'direct-database'
    }, { status: 500 });
  }

  return NextResponse.json({ 
    received: true, 
    processed: false,
    reason: `Event type '${eventType}' not handled`,
    method: 'direct-database'
  });
}
