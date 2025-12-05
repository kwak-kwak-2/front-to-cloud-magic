import { Label } from "@/components/ui/label";
import { Upload as UploadIcon, FileSpreadsheet } from "lucide-react";

interface FileUploadCardProps {
  id: string;
  title: string;
  file: File | null;
  onFileChange: (file: File | null) => void;
  accept: string;
  description: string;
  iconColor?: string;
  borderHoverColor?: string;
}

const FileUploadCard = ({
  id,
  title,
  file,
  onFileChange,
  accept,
  description,
  iconColor = "text-primary",
  borderHoverColor = "hover:border-primary/50",
}: FileUploadCardProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-4">
        <FileSpreadsheet className={`h-6 w-6 ${iconColor}`} />
        <h3 className="text-xl font-semibold">{title}</h3>
      </div>
      
      <div className={`border-2 border-dashed border-border rounded-lg p-8 ${borderHoverColor} transition-colors`}>
        <Label htmlFor={id} className="cursor-pointer">
          <div className="flex flex-col items-center justify-center gap-3">
            <UploadIcon className="h-12 w-12 text-muted-foreground" />
            <div className="text-center">
              <p className="font-medium">
                {file ? file.name : "파일을 선택하세요"}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {description}
              </p>
            </div>
          </div>
          <input
            id={id}
            type="file"
            accept={accept}
            onChange={(e) => onFileChange(e.target.files?.[0] || null)}
            className="hidden"
            required
          />
        </Label>
      </div>
    </div>
  );
};

export default FileUploadCard;
