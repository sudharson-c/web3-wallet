import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function ShowContent({ text }: { text: string }) {
  const [show, setShow] = useState(false);

  return (
    <div className="flex items-center gap-2">
      <p className="font-mono break-all bg-gray-50 p-2 rounded-md border text-sm w-full">
        {show ? text : "•".repeat(text.length)}
      </p>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShow((prev) => !prev)}
          >
            {show ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {show ? "Hide private key" : "Show private key"}
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
