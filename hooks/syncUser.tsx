"use client";

import { useUser } from '@clerk/nextjs';
import { useMutation } from 'convex/react';
import { useEffect } from 'react';
import { api } from '@/convex/_generated/api';

export default function SyncUser() {
  const { user } = useUser();
  const upsertUser = useMutation(api.users.upsertUser);

  useEffect(() => {
    if (user) {
      upsertUser({
        clerkId: user.id,
        email: user.emailAddresses[0].emailAddress,
        name: user.fullName ?? '',
        imageUrl: user.imageUrl,
      });
    }
  }, [user, upsertUser]);

  return null;
}
