import JSConfetti from "js-confetti";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { toast } from "sonner";
import { IconTinte } from "./ui/icons";

export function SubscriptionForm() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, firstName }),
      });
      const body = await response.json();

      if (response.ok) {
        setEmail("");
        setFirstName("");
        setOpen(false);
        const jsConfetti = new JSConfetti();
        jsConfetti.addConfetti();
        toast.success(
          "You're in! 🎉 Check your inbox for a colorful surprise!",
        );
      } else {
        toast.error(body.error);
      }
    } catch (error) {
      console.error("Subscription error:", error);
      toast.error("Oops! Something went wrong. Please try again.");
    }

    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="lg">
          <IconTinte className="w-5 h-5 mr-2" />
          Join the Tinte Community
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Join the Tinte Community</DialogTitle>
        <DialogDescription>
          <p className="text-sm text-foreground mb-4">
            Be the first to know about new themes, features, and exclusive
            offers. Let's add some color to your inbox!
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Your first name"
                required
              />
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? "Joining..." : "Join Now"}
            </Button>
          </form>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
}
