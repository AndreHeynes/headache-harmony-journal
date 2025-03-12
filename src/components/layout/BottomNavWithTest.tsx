
import { useTestContext } from "@/contexts/TestContext";
import BottomNav from "./BottomNav";
import TestBottomNav from "./TestBottomNav";

export default function BottomNavWithTest() {
  const { isTestMode } = useTestContext();
  
  return isTestMode ? <TestBottomNav /> : <BottomNav />;
}
