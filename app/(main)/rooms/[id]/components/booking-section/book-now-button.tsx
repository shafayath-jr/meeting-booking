import { Button } from "@/components/ui/button";

export default function BookNowButton() {
  return (
    <div className="relative flex items-center justify-center">
      <div className="absolute h-30 w-30 animate-ping rounded-full bg-secondary animation-duration-[1.5s]" />
      <Button
        className="relative flex h-48 w-48 cursor-pointer items-center justify-center rounded-full p-0 text-2xl font-bold text-brand-blue"
        variant="secondary"
        type="button"
      >
        BOOK NOW
      </Button>
    </div>
  );
}
