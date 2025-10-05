"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function SalesAreaChart() {
    const data=[
        
  { "month": "Jan", "sales": 400 },
  { "month": "Feb", "sales": 300},
  { "month": "Mar", "sales": 200},
  { "month": "Apr", "sales": 278},
   { "month": "May", "sales": 250},
    { "month": "Jun", "sales": 450},
     { "month": "Jul", "sales": 500},
      { "month": "Aug", "sales": 480},
       { "month": "Sep", "sales": 520},
        { "month": "Oct", "sales": 600},
         { "month": "Nov", "sales": 650},
          { "month": "Dec", "sales": 540},
]
    


  return (
    <div className="w-full h-[400px] p-4 bg-black  rounded-2xl mb-[15px]">
      <h2 className="text-xl font-bold mb-4 text-white">Monthly Sales</h2>

      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0.0} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />

          <Area
            type="monotone"
            dataKey="sales"
            stroke="#8884d8"
            fillOpacity={1}
            fill="url(#colorSales)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
