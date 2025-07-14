import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useRecoilValue, useRecoilValueLoadable, useRecoilCallback, useSetRecoilState } from 'recoil';
import {
  userInfoState,
  usersListQuery,
  userDeleteLoadingState,
  userDeleteErrorState,
  userDeleteSuccessState,
  usersRefetchState
} from '../state/userState';
import Loader from '../components/Loader';
import axios from 'axios';

const UserListScreen = () => {
  const navigate = useNavigate();
  const userInfo = useRecoilValue(userInfoState);

  const usersLoadable = useRecoilValueLoadable(usersListQuery);
  const { state, contents: users } = usersLoadable;
  const loading = state === 'loading';
  const error = state === 'hasError' ? users : null;
  
  const successDelete = useRecoilValue(userDeleteSuccessState);
  const setSuccessDelete = useSetRecoilState(userDeleteSuccessState);
  const setUsersRefetch = useSetRecoilState(usersRefetchState);

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      // The selector will fetch automatically.
    } else {
      navigate('/login');
    }
  }, [navigate, userInfo]);

  useEffect(() => {
    if (successDelete) {
      alert('User deleted successfully!');
      setSuccessDelete(false); // Reset state
    }
  }, [successDelete, setSuccessDelete]);

  const deleteHandler = useRecoilCallback(({ set, snapshot }) => async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      set(userDeleteLoadingState, true);
      set(userDeleteErrorState, null);
      set(userDeleteSuccessState, false);
      try {
        const currentUserInfo = await snapshot.getPromise(userInfoState);
        const config = {
          headers: {
            Authorization: `Bearer ${currentUserInfo.token}`,
          },
        };
        await axios.delete(`/api/users/${id}`, config);
        set(userDeleteLoadingState, false);
        set(userDeleteSuccessState, true);
        setUsersRefetch(v => v + 1); // Trigger refetch
      } catch (error) {
        const message = error.response && error.response.data.message ? error.response.data.message : error.message;
        set(userDeleteLoadingState, false);
        set(userDeleteErrorState, message);
      }
    }
  });

  return (
    <div className="text-gray-900 dark:text-gray-100">
      <h1 className="text-3xl font-bold mb-6">Users</h1>
      
      {loading ? (
        <Loader />
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error?.message || 'An error occurred'}
        </div>
      ) : state === 'hasValue' && (
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    NAME
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    EMAIL
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    ADMIN
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    ACTIONS
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {users.map((user) => (
                  <tr key={user._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user._id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <a
                        href={`mailto:${user.email}`}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        {user.email}
                      </a>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.isAdmin ? (
                        <i className="fas fa-check text-green-600"></i>
                      ) : (
                        <i className="fas fa-times text-red-600"></i>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link
                        to={`/admin/user/${user._id}/edit`}
                        className="bg-gray-800 text-white py-1 px-3 rounded hover:bg-gray-700 mr-2"
                      >
                        <i className="fas fa-edit"></i>
                      </Link>
                      <button
                        onClick={() => deleteHandler(user._id)}
                        className="bg-red-600 text-white py-1 px-3 rounded hover:bg-red-700"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserListScreen; 