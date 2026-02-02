import { Card, CardBody } from "@heroui/react";

const StatsCard = ({
  title,
  value,
  icon: Icon,
  color,
}: {
  title: string;
  value: number | string;
  icon: any;
  color: string;
}) => (
  <Card
    shadow="none"
    className="border border-black/5 dark:border-white/5 bg-white dark:bg-white/5 rounded-lg"
  >
    <CardBody className="flex flex-row items-center gap-4 p-4">
      <div className={`p-3 rounded-xl ${color} bg-opacity-10 text-opacity-100`}>
        <Icon size={20} />
      </div>
      <div className="flex-1">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
          {title}
        </p>
        <div className="flex items-center gap-2">
          <h4 className="text-2xl font-black text-gray-900 dark:text-white">
            {value}
          </h4>
        </div>
      </div>
    </CardBody>
  </Card>
);

export default StatsCard;
