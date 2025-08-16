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
    <div className="flex items-center gap-3">
      <p className="font-mono break-all bg-gray-100 dark:bg-gray-800 p-3 rounded-md border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-gray-100 flex-1">
        {show ? text : "•".repeat(text.length)}
      </p>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShow((prev) => !prev)}
            className="p-2 rounded-full border border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200"
          >
            {show ? (
              <EyeOff className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            ) : (
              <Eye className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent className="bg-gray-800 text-white dark:bg-gray-100 dark:text-gray-900 p-2 rounded-md">
          {show ? "Hide private key" : "Show private key"}
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
