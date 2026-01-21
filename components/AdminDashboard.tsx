
import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { OrderRecord } from '../types';

interface AdminDashboardProps {
  onClose: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onClose }) => {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'asdasd@1237530') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Incorrect Pin');
    }
  };

  const salesData: OrderRecord[] = useMemo(() => {
    const raw = localStorage.getItem('ovenx_orders');
    return raw ? JSON.parse(raw) : [];
  }, []);

  const stats = useMemo(() => {
    const totalSales = salesData.reduce((sum, o) => sum + o.total, 0);
    const totalOrders = salesData.length;
    const foodRevenue = salesData.reduce((sum, o) => sum + o.subtotal, 0);
    const serviceCharges = salesData.reduce((sum, o) => sum + o.serviceCharge, 0);
    const deliveryCharges = salesData.reduce((sum, o) => sum + o.deliveryCharge, 0);
    
    const deliveryOrdersRevenue = salesData
      .filter(o => o.orderType === 'Delivery')
      .reduce((sum, o) => sum + o.total, 0);

    const typeDistribution = salesData.reduce((acc: any, o) => {
      acc[o.orderType] = (acc[o.orderType] || 0) + 1;
      return acc;
    }, {});

    const chartData = Object.keys(typeDistribution).map(key => ({
      name: key,
      value: typeDistribution[key]
    }));

    const dailyMap = salesData.reduce((acc: any, o) => {
      const date = new Date(o.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
      acc[date] = (acc[date] || 0) + o.total;
      return acc;
    }, {});

    const dailyChartData = Object.keys(dailyMap).map(date => ({
      date,
      revenue: dailyMap[date]
    })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return {
      totalSales,
      totalOrders,
      foodRevenue,
      serviceCharges,
      deliveryCharges,
      deliveryOrdersRevenue,
      chartData,
      dailyChartData
    };
  }, [salesData]);

  const PIE_COLORS = ['#8b0000', '#f37021', '#4ade80'];

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-[4000] bg-black bg-opacity-95 flex items-center justify-center p-6 backdrop-blur-md animate-fadeIn">
        <div className="bg-white w-full max-w-sm p-10 rounded-[40px] text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-900 via-orange-500 to-red-900"></div>
          <div className="text-5xl font-black text-red-900 mb-2 mt-4 uppercase tracking-tighter">OVEN <span className="text-orange-500">X</span></div>
          <p className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.2em] mb-10 w-full">Business Management</p>
          <form onSubmit={handleLogin} className="space-y-6 text-left">
            <div className="relative group">
              <label className="text-[10px] font-black text-gray-400 uppercase ml-2 mb-2 block tracking-widest group-focus-within:text-orange-500 transition-colors">Access Pin</label>
              <div className="relative h-[72px]">
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 overflow-hidden px-6 gap-0.5">
                  {Array.from({ length: password.length }).map((_, i) => <span key={i} className="text-2xl animate-[bounce_0.5s_ease-in-out_1] origin-bottom">🍕</span>)}
                  {password.length === 0 && <span className="text-gray-300 font-medium text-sm">••••••••••</span>}
                </div>
                <input type="text" autoFocus value={password} onChange={(e) => setPassword(e.target.value)} className="absolute inset-0 w-full px-6 py-5 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-orange-500 focus:bg-white outline-none transition-all font-black text-center text-transparent caret-orange-500" />
              </div>
            </div>
            {error && <p className="text-red-600 text-[10px] font-black uppercase text-center animate-pulse">{error}</p>}
            <button className="w-full bg-red-900 text-white font-black py-6 rounded-2xl hover:bg-red-800 transition-all shadow-xl active:scale-95 text-xs uppercase tracking-[0.2em]">Open BI Dashboard</button>
            <button type="button" onClick={onClose} className="w-full text-gray-400 text-[10px] font-black uppercase pt-4 tracking-widest">Return Home</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[4000] bg-[#fdfdfd] overflow-y-auto pb-20 animate-fadeIn">
      <div className="max-w-7xl mx-auto p-4 md:p-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
          <div>
            <h1 className="text-5xl font-black text-gray-900 tracking-tighter uppercase">OVENX <span className="text-orange-500">BI</span></h1>
            <p className="text-gray-400 font-bold uppercase text-xs mt-1 tracking-widest">Business Intelligence Suite</p>
          </div>
          <button onClick={onClose} className="bg-white border-2 border-gray-100 px-6 py-3 rounded-2xl hover:text-red-500 transition-all shadow-sm font-black uppercase text-xs">Logout</button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-[#8b0000] p-8 rounded-[40px] text-white shadow-2xl">
            <div className="text-[10px] font-black uppercase opacity-60 mb-2 tracking-widest">Total Sales</div>
            <div className="text-4xl font-black">Rs {stats.totalSales.toLocaleString()}</div>
            <div className="mt-4 text-[10px] font-black uppercase bg-white/10 inline-block px-3 py-1 rounded-full">{stats.totalOrders} Orders Total</div>
          </div>
          <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
             <div className="text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">Net Food Sales</div>
             <div className="text-3xl font-black text-gray-900">Rs {stats.foodRevenue.toLocaleString()}</div>
             <p className="text-[10px] text-gray-400 mt-2 font-bold italic">Base Revenue</p>
          </div>
          <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
             <div className="text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">Delivery Orders</div>
             <div className="text-3xl font-black text-orange-600">Rs {stats.deliveryOrdersRevenue.toLocaleString()}</div>
             <p className="text-[10px] text-orange-400 mt-2 font-bold uppercase">Volume from Delivery</p>
          </div>
          <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
             <div className="text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">Charges (S.C + Dlv)</div>
             <div className="text-3xl font-black text-green-600">Rs {(stats.serviceCharges + stats.deliveryCharges).toLocaleString()}</div>
             <p className="text-[10px] text-green-500 mt-2 font-bold uppercase">Svc: {stats.serviceCharges} | Dlv: {stats.deliveryCharges}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2 bg-white p-10 rounded-[50px] shadow-sm border border-gray-100">
            <h3 className="text-xs font-black uppercase text-gray-400 mb-10 tracking-widest">Revenue Growth</h3>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.dailyChartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f5" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 900, fill: '#ccc'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 900, fill: '#ccc'}} />
                  <Tooltip contentStyle={{ borderRadius: '25px', border: 'none', boxShadow: '0 25px 30px -5px rgb(0 0 0 / 0.15)', padding: '20px' }} />
                  <Bar dataKey="revenue" fill="#8b0000" radius={[15, 15, 15, 15]} barSize={45} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="bg-white p-10 rounded-[50px] shadow-sm border border-gray-100">
            <h3 className="text-xs font-black uppercase text-gray-400 mb-10 tracking-widest">Order Methods</h3>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={stats.chartData} cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={10} dataKey="value">
                    {stats.chartData.map((_, index) => <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[50px] shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-10 py-10 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
            <h3 className="text-2xl font-black text-gray-900 tracking-tight uppercase">Ledger</h3>
            <div className="bg-white border-2 border-gray-100 px-5 py-2 rounded-full text-[10px] font-black uppercase text-gray-400 shadow-sm">Recent Transactions</div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Order ID</th>
                  <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Service</th>
                  <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Items</th>
                  <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {salesData.slice(-100).reverse().map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-10 py-8"><div className="font-black text-gray-900">#{order.id.slice(-4).toUpperCase()}</div><div className="text-[10px] text-gray-400 font-bold uppercase">{new Date(order.timestamp).toLocaleTimeString()}</div></td>
                    <td className="px-10 py-8"><span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider ${order.orderType === 'Dine-In' ? 'bg-blue-100 text-blue-700' : order.orderType === 'Delivery' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-600'}`}>{order.orderType}</span></td>
                    <td className="px-10 py-8"><div className="text-xs font-bold text-gray-600">{order.items.length} Unique Items</div></td>
                    <td className="px-10 py-8"><div className="font-black text-red-900 text-lg">Rs {order.total}</div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

