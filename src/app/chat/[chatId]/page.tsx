import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { eq } from 'drizzle-orm';
import React from 'react';
import { db } from '@/lib/db';
import { chats } from '@/lib/db/schema';

type Props = {
  params: {
    chatId: string;
  };
};

const ChatPage = async ({ params: { chatId } }: Props) => {
  const { userId } = await auth();
  if (!userId) {
    return redirect('/sign-in');
  }
  const _chats = await db.select().from(chats).where(eq(chats.userId, userId));
  if (!_chats) {
    return redirect('/');
  }
  if (!_chats.find((chat) => chat.id === parseInt(chatId))) {
    return redirect('/');
  }
  <div className='flex max-h-screen overflow-scroll'>
    <div className='flex w-full max-h-screen overflow-scroll'>
      {/* chat sidebar */}
      <div></div>
      {/* pdf viewer */}
      <div></div>
      {/* chat component */}
      <div></div>
    </div>
  </div>;
};

export default ChatPage;
