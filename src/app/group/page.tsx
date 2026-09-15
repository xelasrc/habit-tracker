import { Suspense } from "react";
import { GroupDetail } from "./GroupDetail";

export default function GroupPage() {
  return (
    <Suspense fallback={null}>
      <GroupDetail />
    </Suspense>
  );
}
