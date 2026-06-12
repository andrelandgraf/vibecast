'use client';

import { useState } from 'react';
import { ChevronsUpDown, Plus, Check, Building2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { authClient } from '@/lib/auth/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

type Org = { id: string; name: string };

function slugify(name: string): string {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return `${base || 'org'}-${Math.random().toString(36).slice(2, 8)}`;
}

export function OrgSwitcher() {
  const { data: orgs } = authClient.useListOrganizations();
  const { data: activeOrg } = authClient.useActiveOrganization();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [busy, setBusy] = useState(false);

  const list: Org[] = Array.isArray(orgs) ? orgs : [];

  async function handleSelect(id: string) {
    if (id === activeOrg?.id) return;
    await authClient.organization.setActive({ organizationId: id });
  }

  async function handleCreate() {
    if (!name.trim()) return;
    setBusy(true);
    try {
      const { data, error } = await authClient.organization.create({
        name: name.trim(),
        slug: slugify(name),
      });
      if (error) {
        const msg =
          error.code === 'YOU_HAVE_REACHED_THE_MAXIMUM_NUMBER_OF_ORGANIZATIONS'
            ? 'You\u2019ve reached the free-plan limit of 4 workspaces.'
            : (error.message ?? 'Could not create organization');
        toast.error(msg);
        return;
      }
      if (data?.id) {
        await authClient.organization.setActive({ organizationId: data.id });
      }
      toast.success(`Created ${name.trim()}`);
      setOpen(false);
      setName('');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not create organization');
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={<Button variant="outline" size="sm" className="gap-2 font-display" />}
        >
          <Building2 className="size-4 text-primary" />
          <span className="max-w-32 truncate">{activeOrg?.name ?? 'Select workspace'}</span>
          <ChevronsUpDown className="text-muted-foreground size-3.5" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-60">
          <div className="text-muted-foreground px-2 py-1.5 text-xs font-medium">Workspaces</div>
          {list.length === 0 && (
            <p className="text-muted-foreground px-2 py-1.5 text-xs">No workspaces yet</p>
          )}
          {list.map((org) => (
            <DropdownMenuItem key={org.id} onClick={() => handleSelect(org.id)}>
              <Building2 className="size-4" />
              <span className="flex-1 truncate">{org.name}</span>
              {org.id === activeOrg?.id && <Check className="size-4 text-primary" />}
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Plus className="size-4" /> Create workspace
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create a workspace</DialogTitle>
            <DialogDescription>
              Workspaces let you collaborate with teammates on a shared gallery and people.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="org-name">Name</Label>
            <Input
              id="org-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Design Team"
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
            />
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpen(false)} disabled={busy}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={busy || !name.trim()}>
              {busy && <Loader2 className="size-4 animate-spin" />} Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
