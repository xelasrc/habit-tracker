import { Suspense } from "react";
import { RoutineDetail } from "./RoutineDetail";

export default function RoutinePage() {
  return (
    <Suspense fallback={null}>
      <RoutineDetail />
    </Suspense>
  );
}
