import { useAddPoints } from "@/hooks/useAddPoints";

function AddPointsButton() {
  const { mutate, isPending } = useAddPoints();

  return (
    <button disabled={isPending} onClick={() => mutate(10)}>
      Add 10 Points
    </button>
  );
}

export default AddPointsButton;
