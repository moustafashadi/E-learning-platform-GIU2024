import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/index';
import { markAsRead, markAllAsRead } from '../../store/slices/notificationSlice';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationsModal: React.FC<NotificationsModalProps> = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const notifications = useSelector((state: RootState) => state.notifications.notifications);

  const handleMarkAsRead = (id: string) => {
    dispatch(markAsRead(id));
  };

  const handleMarkAllAsRead = () => {
    dispatch(markAllAsRead());
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-96">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">Notifications</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">&times;</button>
        </div>
        <button onClick={handleMarkAllAsRead} className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Mark all as read
        </button>
        <ul className="space-y-2">
          {notifications.map(notification => (
            <li key={notification.id} className={`p-2 rounded ${notification.read ? 'bg-gray-100' : 'bg-blue-100'}`}>
              <div className="flex justify-between items-center">
                <span>{notification.message}</span>
                {!notification.read && (
                  <button onClick={() => handleMarkAsRead(notification.id)} className="text-sm text-blue-600 hover:underline">
                    Mark as read
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default NotificationsModal;