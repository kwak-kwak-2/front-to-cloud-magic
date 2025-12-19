import { Label } from "@/components/ui/label";
import { Upload as UploadIcon, FileSpreadsheet, CheckCircle2, X } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-4">
        <FileSpreadsheet className={`h-6 w-6 ${iconColor}`} />
        <h3 className="text-xl font-semibold">{title}</h3>
      </div>
      
      {file ? (
        // 업로드 완료 상태
        <div className="border-2 border-success/50 bg-success/5 rounded-lg p-6 transition-all animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-success/20 rounded-full flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="font-semibold text-foreground">{file.name}</p>
                <p className="text-sm text-muted-foreground">
                  {formatFileSize(file.size)} • 업로드 준비 완료
                </p>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
              onClick={() => onFileChange(null)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        // 업로드 전 상태
        <div className={`border-2 border-dashed border-border rounded-lg p-8 ${borderHoverColor} transition-colors`}>
          <Label htmlFor={id} className="cursor-pointer">
            <div className="flex flex-col items-center justify-center gap-3">
              <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center">
                <UploadIcon className="h-8 w-8 text-muted-foreground" />
              </div>
              <div className="text-center">
                <p className="font-medium text-foreground">
                  클릭하여 파일 선택
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {description}
                </p>
              </div>
            </div>
          </Label>
          <input
            id={id}
            type="file"
            accept={accept}
            onChange={(e) => onFileChange(e.target.files?.[0] || null)}
            className="hidden"
          />
        </div>
      )}
    </div>
  );
};

export default FileUploadCard;
