import { Card, CardBody, Chip } from "@heroui/react";

const StatsCard = ({
  icon: Icon,
  label,
  value,
  subValue,
  trend,
  colorClass,
}: any) => (
  <Card
    shadow="none"
    className="border border-black/5 dark:border-white/5 bg-white/60 dark:bg-white/5 backdrop-blur-lg rounded-2xl h-full"
  >
    <CardBody className="p-5 flex flex-col justify-between h-full">
      <div className="flex justify-between items-start">
        <div
          className={`p-3 rounded-md ${colorClass} bg-opacity-10 text-opacity-100`}
        >
          <Icon size={24} className={colorClass.replace("bg-", "text-")} />
        </div>
        {trend && (
          <Chip
            size="sm"
            variant="flat"
            color="success"
            className="text-xs font-bold rounded-2xl"
          >
            +{trend}%
          </Chip>
        )}
      </div>
      <div className="mt-4">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
          {label}
        </p>
        <h4 className="text-3xl font-black text-black dark:text-white mt-1">
          {value}
        </h4>
        {subValue && (
          <p className="text-xs font-medium text-gray-500 mt-1">{subValue}</p>
        )}
      </div>
    </CardBody>
  </Card>
);

export default StatsCard;