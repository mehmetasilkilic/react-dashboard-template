import { useAlertStore } from "@/stores/useAlertStore";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  CheckCircledIcon,
  CrossCircledIcon,
  ExclamationTriangleIcon,
  InfoCircledIcon,
} from "@radix-ui/react-icons";

export const GlobalAlertModal = () => {
  const { isOpen, title, message, type, action, content, closeAlert } =
    useAlertStore();

  const icons = {
    success: <CheckCircledIcon className="h-6 w-6 text-green-500" />,
    error: <CrossCircledIcon className="h-6 w-6 text-red-500" />,
    info: <InfoCircledIcon className="h-6 w-6 text-blue-500" />,
    warning: <ExclamationTriangleIcon className="h-6 w-6 text-yellow-500" />,
  };

  const handleConfirm = () => {
    if (action?.confirm.onHandle) {
      action.confirm.onHandle();
    }
    closeAlert();
  };

  const handleCancel = () => {
    if (action?.cancel?.onHandle) {
      action.cancel.onHandle();
    }
    closeAlert();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && closeAlert()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            {icons[type]}
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription>{message}</AlertDialogDescription>
        </AlertDialogHeader>
        {content && <div className="py-4">{content}</div>}
        <AlertDialogFooter>
          {action?.cancel && (
            <AlertDialogCancel onClick={handleCancel}>
              {action.cancel.text}
            </AlertDialogCancel>
          )}
          <AlertDialogAction onClick={handleConfirm}>
            {action?.confirm.text}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
