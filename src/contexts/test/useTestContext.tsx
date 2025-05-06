
import { useContext } from "react";
import { TestContext } from "./TestProvider";

// Custom hook to use the test context
export const useTestContext = () => {
  const context = useContext(TestContext);
  if (context === undefined) {
    throw new Error("useTestContext must be used within a TestProvider");
  }
  return context;
};
