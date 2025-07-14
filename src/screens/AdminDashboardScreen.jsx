import { useState, useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { userInfoState } from '../state/userState';
import axios from 'axios';
import Loader from '../components/Loader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const AdminDashboardScreen = () => {
  const [summary, setSummary] = useState(null);
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userInfo = useRecoilValue(userInfoState);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };

        const { data: summaryData } = await axios.get('/api/admin/summary', config);
        setSummary(summaryData);

        const { data: salesOverTimeData } = await axios.get('/api/admin/sales-over-time', config);
        setSalesData(salesOverTimeData);

        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [userInfo]);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{summary.totalUsers}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Total Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{summary.totalOrders}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Total Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">₹{summary.totalSales.toFixed(2)}</p>
            </CardContent>
          </Card>
        </div>
      )}
      {salesData && salesData.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Sales Over Time</h2>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="_id.month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="totalSales" fill="#8884d8" name="Total Sales" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardScreen; 