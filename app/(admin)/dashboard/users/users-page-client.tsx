'use client';

import { useMutation, usePaginatedQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  MoreHorizontal,
  Loader2,
  Shield,
  UserX,
  UserCheck,
  Trash2,
  UserPlus,
  UserRoundCog,
} from 'lucide-react';
import { toast } from 'sonner';
import { normalizeRole, type StoredRole } from '@/lib/roles';

type AssignableRole = 'admin' | 'member' | 'user';

export default function UsersPageClient() {
  const { results, status, loadMore } = usePaginatedQuery(
    api.users.listUsers,
    {},
    { initialNumItems: 20 }
  );

  const updateRole = useMutation(api.users.setRole);
  const updateStatus = useMutation(api.users.updateStatus);
  const deleteUser = useMutation(api.users.deleteUser);

  const handleRoleChange = async (userId: Id<'users'>, newRole: AssignableRole) => {
    try {
      await updateRole({ userId, role: newRole });
      toast.success(`User role updated to ${newRole}`);
    } catch {
      toast.error('Failed to update role');
    }
  };

  const handleStatusChange = async (
    userId: Id<'users'>,
    newStatus: 'active' | 'suspended'
  ) => {
    try {
      await updateStatus({ userId, status: newStatus });
      toast.success(`User status updated to ${newStatus}`);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Failed to update status');
      }
    }
  };

  const handleDeleteUser = async (userId: Id<'users'>) => {
    if (
      !confirm(
        'Are you sure you want to delete this user? This action cannot be undone.'
      )
    ) {
      return;
    }

    try {
      await deleteUser({ userId });
      toast.success('User deleted successfully');
    } catch {
      toast.error('Failed to delete user');
    }
  };

  const renderRoleActions = (userId: Id<'users'>, role: StoredRole) => {
    const normalizedRole = normalizeRole(role);

    if (normalizedRole === 'admin') {
      return (
        <DropdownMenuItem onClick={() => handleRoleChange(userId, 'member')}>
          <UserRoundCog className="mr-2 h-4 w-4" />
          Demote to Member
        </DropdownMenuItem>
      );
    }

    if (normalizedRole === 'member') {
      return (
        <>
          <DropdownMenuItem onClick={() => handleRoleChange(userId, 'admin')}>
            <Shield className="mr-2 h-4 w-4 text-green-600" />
            Promote to Admin
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleRoleChange(userId, 'user')}>
            <UserX className="mr-2 h-4 w-4" />
            Demote to User
          </DropdownMenuItem>
        </>
      );
    }

    return (
      <>
        <DropdownMenuItem onClick={() => handleRoleChange(userId, 'member')}>
          <UserPlus className="mr-2 h-4 w-4 text-blue-600" />
          Promote to Member
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleRoleChange(userId, 'admin')}>
          <Shield className="mr-2 h-4 w-4 text-green-600" />
          Promote to Admin
        </DropdownMenuItem>
      </>
    );
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Users</h2>
      </div>
      <div className="rounded-md border bg-card text-card-foreground shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {results.map((user) => {
              const normalizedRole = normalizeRole(user.role);

              return (
                <TableRow key={user._id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={user.imageUrl} alt={user.name} />
                        <AvatarFallback>
                          {user.name?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span>{user.name}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge
                      variant={normalizedRole === 'admin' ? 'default' : 'secondary'}
                      className="capitalize"
                    >
                      {normalizedRole}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        user.status === 'suspended' ? 'destructive' : 'outline'
                      }
                      className="capitalize"
                    >
                      {user.status || 'active'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        {renderRoleActions(user._id, user.role)}

                        {user.status === 'suspended' ? (
                          <DropdownMenuItem
                            onClick={() => handleStatusChange(user._id, 'active')}
                          >
                            <UserCheck className="mr-2 h-4 w-4 text-green-600" />
                            Activate User
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem
                            onClick={() =>
                              handleStatusChange(user._id, 'suspended')
                            }
                          >
                            <UserX className="mr-2 h-4 w-4 text-destructive" />
                            Suspend Access
                          </DropdownMenuItem>
                        )}

                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive focus:bg-destructive focus:text-destructive-foreground"
                          onClick={() => handleDeleteUser(user._id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}

            {status === 'LoadingFirstPage' && (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin inline-block" />
                  Loading...
                </TableCell>
              </TableRow>
            )}

            {status === 'Exhausted' && results.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {(status === 'CanLoadMore' || status === 'LoadingMore') && (
        <div className="flex justify-center mt-4">
          <Button
            variant="outline"
            onClick={() => loadMore(20)}
            disabled={status === 'LoadingMore'}
          >
            {status === 'LoadingMore' ? 'Loading...' : 'Load More'}
          </Button>
        </div>
      )}
    </div>
  );
}
