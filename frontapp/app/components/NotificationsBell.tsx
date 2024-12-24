import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import websocketService from '../_utils/websocket.service';
import { AiOutlineBell } from 'react-icons/ai';
import NotificationsModal from './NotificationModal';

export default function NotificationBell() {
  const dispatch = useDispatch();
  const { notifications, unreadCount } = useSelector(
    (state: RootState) => state.notifications
  );
  const { user } = useSelector((state: RootState) => state.auth);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (user && user.sub) {
      const socket = websocketService.connect(user.sub);
      socket.on('notification', (notification: any) => {
        dispatch({ type: 'notifications/add', payload: notification });
      });
      return () => {
        websocketService.disconnect();
        console.log('disconnected');
      };
    }
  }, [user]);

  const handleClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="relative">
      <AiOutlineBell className="h-6 w-6 cursor-pointer" onClick={handleClick} />
      {unreadCount > 0 && (
        <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
          {unreadCount}
        </div>
      )}
      <NotificationsModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
}