import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Routes
import { AppRouter } from "./routes";

// Global Components
import { GlobalAlertModal } from "./components/app/AlertModal";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <AppRouter />
      </QueryClientProvider>
      <GlobalAlertModal />
    </>
  );
}

export default App;
