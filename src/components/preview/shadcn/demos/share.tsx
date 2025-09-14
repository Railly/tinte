"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

const people = [
  {
    name: "Midudev",
    email: "miduga@gmail.com",
    avatar: "/avatars/02.webp",
  },
  {
    name: "Anthony Cueva",
    email: "anthony@crafterstation.com",
    avatar: "/avatars/04.webp",
  },
  {
    name: "Cristian Correa",
    email: "cristian@crafterstation.com",
    avatar: "/avatars/05.webp",
  },
  {
    name: "Railly Hugo",
    email: "railly@crafterstation.com",
    avatar: "/avatars/01.webp",
  },
  {
    name: "Mateo Alvarez",
    email: "mateo@example.com",
    avatar: "/avatars/03.webp",
  },
];
export function CardsShare() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Share this document</CardTitle>
        <CardDescription>
          Anyone with the link can view this document.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2">
          <Label htmlFor="link" className="sr-only">
            Link
          </Label>
          <Input
            id="link"
            value="http://example.com/link/to/document"
            className="h-8"
            readOnly
          />
          <Button size="sm" variant="outline" className="shadow-none">
            Copy Link
          </Button>
        </div>
        <Separator className="my-4" />
        <div className="flex flex-col gap-4">
          <div className="text-sm font-medium">People with access</div>
          <div className="grid gap-6">
            {people.map((person) => (
              <div
                key={person.email}
                className="flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={person.avatar} alt="Image" />
                    <AvatarFallback>{person.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm leading-none font-medium">
                      {person.name}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      {person.email}
                    </p>
                  </div>
                </div>
                <Select defaultValue="edit">
                  <SelectTrigger
                    className="ml-auto pr-2"
                    aria-label="Edit"
                    size="sm"
                  >
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent align="end">
                    <SelectItem value="edit">Can edit</SelectItem>
                    <SelectItem value="view">Can view</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
