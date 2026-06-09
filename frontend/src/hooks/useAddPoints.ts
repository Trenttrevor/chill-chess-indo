import { useMutation } from "@tanstack/react-query";
import { addPoints } from "@/lib/api";

export const useAddPoints = () => {
  return useMutation({
    mutationFn: addPoints,
  });
};
