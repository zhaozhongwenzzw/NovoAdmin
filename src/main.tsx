import ReactDOM from "react-dom/client";
import { ConfigProvider } from "@/configs/configProvider/configProvider";
import RouterMain from "@/router/index";
import "./styles/global.css";
import "./styles/index.less";
import "@/configs/theme/hooks/theme.css";
import Toast from "@/components/toast";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

ReactDOM.createRoot(rootElement).render(
  <ConfigProvider>
    <Toast />
    <RouterMain />
  </ConfigProvider>
);
