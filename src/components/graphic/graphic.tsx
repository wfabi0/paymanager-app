import { Cell, Legend, Pie, PieChart, Tooltip } from "recharts";
import { z } from "zod";
import { formSchema } from "../create-payment-button";
import { Payment } from "../data-table/data-table";

interface DataItem {
  name: z.infer<typeof formSchema.shape.status>;
  value: number;
}

const COLORS = [
  "rgb(251 146 60)",
  "rgb(220 38 38)",
  "rgb(96 165 250)",
  "rgb(74 222 128)",
];

interface CustomizedLabelProps {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
  index: number;
}

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index,
}: CustomizedLabelProps) => {
  const RADIAN = Math.PI / 180;
  const radius = 25 + innerRadius + (outerRadius - innerRadius);
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="black"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const { name, value } = payload[0].payload;
    return (
      <div className="custom-tooltip rounded-lg shadow-lg bg-white p-2.5 border border-gray-400">
        <p
          className="label capitalize"
          style={{ margin: 0 }}
        >{`${name}: ${value}`}</p>
      </div>
    );
  }
  return null;
};

interface GraphicProps {
  payments: Payment[];
}

export default function Graphic({ payments }: GraphicProps) {
  const data: DataItem[] = [
    {
      name: "pending",
      value: payments.filter((p) => p.status === "pending").length || 0,
    },
    {
      name: "late",
      value: payments.filter((p) => p.status === "late").length || 0,
    },
    {
      name: "future",
      value: payments.filter((p) => p.status === "future").length || 0,
    },
    {
      name: "paid",
      value: payments.filter((p) => p.status === "paid").length || 0,
    },
  ];

  return (
    <PieChart width={400} height={400}>
      <Pie
        data={data}
        cx={200}
        cy={200}
        innerRadius={60}
        outerRadius={80}
        labelLine={false}
        label={renderCustomizedLabel}
        dataKey="value"
        paddingAngle={5}
      >
        {data.map((_entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip content={CustomTooltip} />
      <Legend
        align="center"
        verticalAlign="bottom"
        iconSize={12}
        iconType="circle"
        formatter={(prop) => {
          return <span className="capitalize">{prop}</span>;
        }}
        wrapperStyle={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      />
    </PieChart>
  );
}
