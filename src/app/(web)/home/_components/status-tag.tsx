import { Badge } from "@/components/ui/badge";

export type Status = "submitted" | "in_progress";

interface StatusTagProps {
  status: Status;
}

export function StatusTag({ status }: StatusTagProps) {
  const getStatusStyles = (status: Status) => {
    switch (status) {
      case "submitted":
        return "bg-green-50 text-green-700 border-green-200";
      case "in_progress":
        return "bg-orange-50 text-orange-700 border-orange-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getStatusLabel = (status: Status) => {
    switch (status) {
      case "submitted":
        return "Submitted";
      case "in_progress":
        return "In Progress";
      default:
        return "Unknown";
    }
  };

  return (
    <Badge variant="outline" className={getStatusStyles(status)}>
      {getStatusLabel(status)}
    </Badge>
  );
}
