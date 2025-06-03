import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getUsers, deleteUser, resetDeleteUser } from '../slices/userSlice';
import Loader from '../components/Loader';

const UserListScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { loading, error, users, successDelete } = useSelector(
    (state) => state.user
  );
  
  const { userInfo } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(resetDeleteUser());

    if (userInfo && userInfo.isAdmin) {
      dispatch(getUsers());
    } else {
      navigate('/login');
    }
  }, [dispatch, navigate, userInfo]);

  useEffect(() => {
    if (successDelete) {
      alert('User deleted successfully!');
      dispatch(getUsers());
    }
  }, [successDelete, dispatch]);

  const deleteHandler = (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      dispatch(deleteUser(id));
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Users</h1>
      
      {loading ? (
        <Loader />
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    NAME
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    EMAIL
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ADMIN
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ACTIONS
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
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
                        className="text-blue-600 hover:text-blue-800"
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