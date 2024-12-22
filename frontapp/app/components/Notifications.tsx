import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { markAsRead, markAllAsRead } from '../store/slices/notificationSlice';

const Notifications = () => {
  const dispatch = useDispatch();
  const notifications = useSelector((state: RootState) => state.notifications.notifications);
  const unreadCount = useSelector((state: RootState) => state.notifications.unreadCount);

  const handleMarkAsRead = (id: string) => {
    dispatch(markAsRead(id));
  };

  const handleMarkAllAsRead = () => {
    dispatch(markAllAsRead());
  };

  return (
    <div className="notifications">
      <h3>Notifications ({unreadCount})</h3>
      <button onClick={handleMarkAllAsRead}>Mark all as read</button>
      <ul>
        {notifications.map(notification => (
          <li key={notification.id} className={notification.read ? 'read' : 'unread'}>
            {notification.message}
            {!notification.read && (
              <button onClick={() => handleMarkAsRead(notification.id)}>Mark as read</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Notifications;