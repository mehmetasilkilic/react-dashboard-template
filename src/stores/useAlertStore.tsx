import { ReactNode } from "react";
import { create } from "zustand";

type AlertType = "success" | "error" | "info" | "warning";

interface AlertAction {
    text: string;
    onHandle?: () => void;
}

interface AlertState {
  isOpen: boolean;
  title: string;
  message: string;
  type: AlertType;
  action?: {
    confirm: AlertAction;
    cancel?: AlertAction;
  };
  content?: ReactNode;
  showAlert: (params: ShowAlertParams) => void;
  closeAlert: () => void;
}

interface ShowAlertParams {
  title: string;
  message: string;
  type: AlertType;
  action?: {
    confirm: AlertAction;
    cancel?: AlertAction;
  };
  content?: ReactNode;
}

export const useAlertStore = create<AlertState>((set) => ({
  isOpen: false,
  title: "",
  message: "",
  type: "info",
  showAlert: (params: ShowAlertParams) =>
    set({
      isOpen: true,
      ...params,
    }),
  closeAlert: () =>
    set({
      isOpen: false,
      title: "",
      message: "",
      type: "info",
      action: undefined,
      content: undefined,
    }),
}));
