import ChatPage from '@/features/chat/ChatPage';
import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/')({
  component: HomePage,
});

function HomePage() {
  return(
  <>
  <ChatPage />
  {/* <SocketTest /> */}
  </> 
  )
  }
