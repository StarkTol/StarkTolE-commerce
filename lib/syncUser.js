import connectDB from '@/config/db';
import User from '@/models/User';

export async function syncUserWithDB(clerkUser) {
  await connectDB();

  const { id, fullName, primaryEmailAddress, imageUrl } = clerkUser;

  await User.findByIdAndUpdate(
    id,
    {
      _id: id,
      name: fullName,
      email: primaryEmailAddress.emailAddress,
      imageUrl: imageUrl,
    },
    { upsert: true, new: true }
  );
}
