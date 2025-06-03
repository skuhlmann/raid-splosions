import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";
import { useState } from "react";

export function InfoModal() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className="h-10 px-4 text-muted-foreground hover:text-foreground"
        onClick={() => setOpen(true)}
      >
        <HelpCircle className="h-5 w-5" />
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-4xl font-bold text-raid-red">
              JOIN THE BOMB SQUAD 🧨
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-xl">
              When you mint your Splosion, you'll receive:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-xl">
              <li>A unique Splosion NFT with your sploded image</li>
              <li>
                Loot tokens/membership in the Moloch DAO dedicated to the
                Splosions movement
              </li>
            </ul>
          </div>
          <div className="border-t pt-4 mt-0">
            <div className="flex flex-col gap-1 text-xs text-muted-foreground">
              <a
                href="https://daohaus.club/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors"
              >
                A Moloch DAO?
              </a>
              <a
                href="https://admin.daohaus.fun/#/molochV3/0x2105/0x020ed3b58b1fe2e4cf88786c140cd6e1e6edb99f"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors"
              >
                Bomb Squad DAO
              </a>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
