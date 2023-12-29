"use client";

import { changeTeamAction } from "@/actions/change-team-action";
import { Avatar, AvatarFallback, AvatarImage } from "@midday/ui/avatar";
import { Button } from "@midday/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@midday/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@midday/ui/dropdown-menu";
import { Icons } from "@midday/ui/icons";
import { Input } from "@midday/ui/input";
import { useAction } from "next-safe-action/hook";

export function TeamDropdown({ selectedTeam, teams }) {
  const changeTeam = useAction(changeTeamAction);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="rounded-sm w-9 h-9">
          <AvatarImage src={selectedTeam?.logo_url} />
          <AvatarFallback className="rounded-sm w-9 h-9">
            <span className="text-xs">
              {selectedTeam?.name?.charAt(0)?.toUpperCase()}
              {selectedTeam?.name?.charAt(1)?.toUpperCase()}
            </span>
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[240px]"
        sideOffset={15}
        align="start"
        side="top"
      >
        <Dialog>
          <DropdownMenuItem asDialogTrigger className="border-b-[1px]">
            <DialogTrigger className="w-full p-1 flex items-center space-x-2">
              <Icons.Add />
              <span className="font-medium text-sm">Create team</span>
            </DialogTrigger>
          </DropdownMenuItem>
          <DialogContent className="max-w-[455px]">
            <div className="p-4">
              <DialogHeader>
                <DialogTitle>Create team</DialogTitle>
                <DialogDescription>
                  For example, you can use the name of your company or
                  department.
                </DialogDescription>
              </DialogHeader>

              <div className="mt-6 mb-6">
                <Input placeholder="Team Name" />
              </div>

              <DialogFooter>
                <div className="space-x-4">
                  <Button variant="outline">Cancel</Button>
                  <Button>Continue</Button>
                </div>
              </DialogFooter>
            </div>
          </DialogContent>
          {teams.map(({ team }) => {
            return (
              <DropdownMenuItem
                key={team.id}
                onClick={() => changeTeam.execute({ teamId: team.id })}
              >
                <div className="flex justify-between w-full p-1">
                  <div className="flex space-x-2 items-center">
                    <Avatar className="rounded-sm w-[24px] h-[24px]">
                      <AvatarImage src={team.logo_url} />
                      <AvatarFallback className="rounded-sm w-[24px] h-[24px]">
                        <span className="text-xs">
                          {team.name?.charAt(0)?.toUpperCase()}
                          {team.name?.charAt(1)?.toUpperCase()}
                        </span>
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{team.name}</span>
                  </div>
                  {team.id === selectedTeam.id && <Icons.Check />}
                </div>
              </DropdownMenuItem>
            );
          })}
        </Dialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
