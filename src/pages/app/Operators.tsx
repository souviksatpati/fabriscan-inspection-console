import React, { useState, useEffect, useMemo } from 'react';
import { useRole } from '../../hooks/useRole';
import {
  userStore,
  OperatorUser,
  generateRandomPassword,
} from '../../services/userStore';
import { UserRole } from '../../types/user';
import { ROLE_LABELS } from '../../lib/roles';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import {
  UserPlus,
  Search,
  MoreHorizontal,
  CheckCircle2,
  Ban,
  KeyRound,
  Edit,
  Eye,
  EyeOff,
  Sparkles,
  AlertCircle,
  X,
  Filter,
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../../components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '../../components/ui/dropdown-menu';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '../../components/ui/select';

interface FormErrors {
  fullName?: string;
  userId?: string;
  email?: string;
  employeeId?: string;
  station?: string;
  assignedWork?: string;
  temporaryPassword?: string;
  general?: string;
}

export const Operators: React.FC = () => {
  useDocumentTitle('Operators | Maruti FabriScan');
  const { user: currentUser } = useRole();

  const [operators, setOperators] = useState<OperatorUser[]>(() => userStore.getUsers());
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');

  // Dialog states
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);

  // Active target for edit/reset
  const [selectedUser, setSelectedUser] = useState<OperatorUser | null>(null);

  // Add form fields
  const [addFullName, setAddFullName] = useState('');
  const [addUserId, setAddUserId] = useState('');
  const [addEmail, setAddEmail] = useState('');
  const [addEmployeeId, setAddEmployeeId] = useState('');
  const [addRole, setAddRole] = useState<UserRole>('QC_INSPECTOR');
  const [addStation, setAddStation] = useState('Stamping Press 04 · Bay B');
  const [addAssignedWork, setAddAssignedWork] = useState('Line 04 visual inspection, shift A');
  const [addPassword, setAddPassword] = useState('');
  const [showAddPassword, setShowAddPassword] = useState(false);
  const [addErrors, setAddErrors] = useState<FormErrors>({});

  // Edit form fields
  const [editFullName, setEditFullName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editEmployeeId, setEditEmployeeId] = useState('');
  const [editRole, setEditRole] = useState<UserRole>('QC_INSPECTOR');
  const [editStation, setEditStation] = useState('');
  const [editAssignedWork, setEditAssignedWork] = useState('');
  const [editErrors, setEditErrors] = useState<FormErrors>({});

  // Reset password form fields
  const [resetPasswordVal, setResetPasswordVal] = useState('');
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [resetErrors, setResetErrors] = useState<FormErrors>({});

  // Feedback Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Sync with userStore changes
  useEffect(() => {
    const unsub = userStore.subscribe(() => {
      setOperators(userStore.getUsers());
    });
    return unsub;
  }, []);

  // Filtered operators
  const filteredOperators = useMemo(() => {
    const term = search.trim().toLowerCase();
    return operators.filter((op) => {
      const matchesRole = roleFilter === 'ALL' || op.role === roleFilter;
      const matchesSearch =
        !term ||
        op.fullName.toLowerCase().includes(term) ||
        op.userId.toLowerCase().includes(term) ||
        op.email.toLowerCase().includes(term) ||
        op.employeeId.toLowerCase().includes(term) ||
        op.station.toLowerCase().includes(term) ||
        op.assignedWork.toLowerCase().includes(term);
      return matchesRole && matchesSearch;
    });
  }, [operators, search, roleFilter]);

  // Open Add Dialog with fresh defaults
  const handleOpenAdd = () => {
    setAddFullName('');
    setAddUserId('');
    setAddEmail('');
    setAddEmployeeId('');
    setAddRole('QC_INSPECTOR');
    setAddStation('Stamping Press 04 · Bay B');
    setAddAssignedWork('Line 04 visual inspection, shift A');
    setAddPassword(generateRandomPassword(10));
    setShowAddPassword(false);
    setAddErrors({});
    setAddOpen(true);
  };

  // Submit Add Operator
  const handleCreateOperator = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: FormErrors = {};

    if (!addFullName.trim()) errors.fullName = 'Full name is required.';
    if (!addUserId.trim()) {
      errors.userId = 'User ID is required.';
    } else if (!/^[a-zA-Z0-9-]{3,20}$/.test(addUserId.trim())) {
      errors.userId = 'Format: 3-20 letters, numbers or hyphens (e.g. usr-005).';
    }
    if (!addEmail.trim()) {
      errors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(addEmail.trim())) {
      errors.email = 'Valid email address required.';
    }
    if (!addEmployeeId.trim()) errors.employeeId = 'Employee ID is required.';
    if (!addPassword) {
      errors.temporaryPassword = 'Password is required.';
    } else if (addPassword.length < 8) {
      errors.temporaryPassword = 'Password must be at least 8 characters.';
    }

    if (Object.keys(errors).length > 0) {
      setAddErrors(errors);
      return;
    }

    try {
      const created = await userStore.createUser({
        fullName: addFullName,
        userId: addUserId,
        email: addEmail,
        employeeId: addEmployeeId,
        role: addRole,
        station: addStation,
        assignedWork: addAssignedWork,
        temporaryPassword: addPassword,
        createdBy: currentUser?.fullName || 'System Administrator',
      });
      setAddOpen(false);
      showToast(`Operator ${created.fullName} (${created.userId}) created successfully.`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to create operator.';
      setAddErrors({ general: msg });
    }
  };

  // Open Edit Dialog
  const handleOpenEdit = (op: OperatorUser) => {
    setSelectedUser(op);
    setEditFullName(op.fullName);
    setEditEmail(op.email);
    setEditEmployeeId(op.employeeId);
    setEditRole(op.role);
    setEditStation(op.station);
    setEditAssignedWork(op.assignedWork);
    setEditErrors({});
    setEditOpen(true);
  };

  // Submit Edit Operator
  const handleUpdateOperator = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    const errors: FormErrors = {};
    if (!editFullName.trim()) errors.fullName = 'Full name is required.';
    if (!editEmail.trim()) {
      errors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editEmail.trim())) {
      errors.email = 'Valid email address required.';
    }
    if (!editEmployeeId.trim()) errors.employeeId = 'Employee ID is required.';

    if (Object.keys(errors).length > 0) {
      setEditErrors(errors);
      return;
    }

    try {
      const currentAdminId = currentUser?.userId || currentUser?.id || 'usr-004';
      const updated = await userStore.updateUser(
        selectedUser.id,
        {
          fullName: editFullName,
          email: editEmail,
          employeeId: editEmployeeId,
          role: editRole,
          station: editStation,
          assignedWork: editAssignedWork,
        },
        currentAdminId
      );
      setEditOpen(false);
      showToast(`Operator ${updated.fullName} updated successfully.`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update operator.';
      setEditErrors({ general: msg });
    }
  };

  // Open Reset Password Dialog
  const handleOpenReset = (op: OperatorUser) => {
    setSelectedUser(op);
    setResetPasswordVal(generateRandomPassword(10));
    setShowResetPassword(false);
    setResetErrors({});
    setResetOpen(true);
  };

  // Submit Reset Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    if (!resetPasswordVal || resetPasswordVal.length < 8) {
      setResetErrors({ temporaryPassword: 'Password must be at least 8 characters long.' });
      return;
    }

    try {
      await userStore.resetPassword(selectedUser.id, resetPasswordVal);
      setResetOpen(false);
      showToast(`Password for ${selectedUser.fullName} (${selectedUser.userId}) reset successfully.`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to reset password.';
      setResetErrors({ general: msg });
    }
  };

  // Toggle status (Active / Disabled)
  const handleToggleStatus = async (op: OperatorUser) => {
    try {
      const currentAdminId = currentUser?.userId || currentUser?.id || 'usr-004';
      const updated = await userStore.toggleStatus(op.id, currentAdminId);
      const actionName = updated.status === 'ACTIVE' ? 'enabled' : 'disabled';
      showToast(`Operator ${updated.fullName} has been ${actionName}.`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Status update failed.';
      showToast(msg, 'error');
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto font-sans pb-12">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div
          role="status"
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-[4px] border shadow-lg text-xs font-medium animate-fadeIn ${
            toastType === 'success'
              ? 'bg-[#F0FDF4] border-[#BBF7D0] text-[#15803D]'
              : 'bg-[#FEF2F2] border-[#FECACA] text-[#B91C1C]'
          }`}
        >
          {toastType === 'success' ? (
            <CheckCircle2 size={16} className="shrink-0 text-[#15803D]" />
          ) : (
            <AlertCircle size={16} className="shrink-0 text-[#B91C1C]" />
          )}
          <span>{toastMessage}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="ml-2 text-[#64748B] hover:text-[#0F172A]"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="font-sans text-[10px] text-[#1D4ED8] uppercase tracking-wider font-bold mb-1">
            STATION ACCESS &amp; OPERATOR PROVISIONING
          </div>
          <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight">Operators</h1>
          <p className="text-xs text-[#475569] mt-1">
            Add and manage the people who can sign in to this station
          </p>
        </div>

        <Button
          onClick={handleOpenAdd}
          variant="default"
          size="sm"
          className="bg-[#1D4ED8] hover:bg-[#1E40AF] text-white gap-2 font-semibold text-xs shadow-xs shrink-0 self-start sm:self-auto"
        >
          <UserPlus size={15} />
          <span>Add operator</span>
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-[#D9DEE5] rounded-[4px] p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shadow-[0_1px_2px_rgba(15,23,42,0.02)]">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, User ID, email, station..."
            className="w-full pl-9 pr-3 py-1.5 text-xs font-sans rounded-[3px] border border-[#D9DEE5] bg-[#F8FAFC] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1D4ED8] text-[#0F172A] transition-all"
          />
        </div>

        {/* Role Filter & Count */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter size={13} className="text-[#64748B]" />
            <span className="text-xs text-[#64748B] font-medium hidden sm:inline">Role:</span>
          </div>

          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-[11rem] h-8 text-xs font-sans">
              <SelectValue placeholder="All Roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Roles</SelectItem>
              <SelectItem value="QC_INSPECTOR">QC Line Inspector</SelectItem>
              <SelectItem value="QA_SUPERVISOR">QA Supervisor</SelectItem>
              <SelectItem value="SUPPLIER_QA">Supplier QA Auditor</SelectItem>
              <SelectItem value="ADMIN">System Administrator</SelectItem>
            </SelectContent>
          </Select>

          <span className="text-[11px] font-mono text-[#64748B] ml-2">
            {filteredOperators.length} {filteredOperators.length === 1 ? 'user' : 'users'}
          </span>
        </div>
      </div>

      {/* Operators Table (sticky header) */}
      <div className="bg-white border border-[#D9DEE5] rounded-[4px] shadow-[0_1px_3px_rgba(15,23,42,0.04)] overflow-hidden">
        <div className="overflow-x-auto max-h-[calc(100vh-20rem)] overflow-y-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="sticky top-0 bg-[#F8FAFC] border-b border-[#D9DEE5] z-10 text-[11px] font-semibold text-[#475569] uppercase tracking-wider font-mono">
              <tr>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-3">User ID</th>
                <th className="py-3 px-3">Email</th>
                <th className="py-3 px-3">Employee ID</th>
                <th className="py-3 px-3">Role</th>
                <th className="py-3 px-3">Station</th>
                <th className="py-3 px-3">Assigned Work</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Created</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0] font-sans">
              {filteredOperators.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-[#64748B]">
                    <div className="max-w-xs mx-auto flex flex-col items-center">
                      <Search size={24} className="text-[#94A3B8] mb-2" />
                      <p className="font-semibold text-xs text-[#0F172A]">No operators found</p>
                      <p className="text-[11px] text-[#64748B] mt-0.5">
                        No accounts match your search or role filter.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredOperators.map((op) => {
                  const roleMeta = ROLE_LABELS[op.role];
                  const isCurrentUser =
                    currentUser?.userId === op.userId || currentUser?.id === op.id;

                  return (
                    <tr
                      key={op.id}
                      className={`hover:bg-[#F8FAFC] transition-colors ${
                        op.status === 'DISABLED' ? 'opacity-65 bg-[#FAFAFA]' : ''
                      }`}
                    >
                      {/* Name */}
                      <td className="py-3 px-4 font-semibold text-[#0F172A] whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] text-[#1D4ED8] text-[10px] font-bold flex items-center justify-center font-mono">
                            {op.fullName
                              .split(' ')
                              .map((p) => p[0])
                              .join('')
                              .slice(0, 2)
                              .toUpperCase()}
                          </span>
                          <span>{op.fullName}</span>
                          {isCurrentUser && (
                            <span className="text-[10px] font-mono font-medium text-[#1D4ED8] bg-[#EFF6FF] px-1.5 py-0.2 rounded-[2px] border border-[#BFDBFE]">
                              You
                            </span>
                          )}
                        </div>
                      </td>

                      {/* User ID */}
                      <td className="py-3 px-3 font-mono text-[11px] text-[#0F172A] font-semibold whitespace-nowrap">
                        {op.userId}
                      </td>

                      {/* Email */}
                      <td className="py-3 px-3 text-[#475569] whitespace-nowrap">
                        {op.email}
                      </td>

                      {/* Employee ID */}
                      <td className="py-3 px-3 font-mono text-[11px] text-[#475569] whitespace-nowrap">
                        {op.employeeId}
                      </td>

                      {/* Role */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span
                          className="inline-flex items-center px-2 py-0.5 rounded-[3px] text-[10px] font-bold font-mono uppercase"
                          style={{
                            backgroundColor:
                              op.role === 'ADMIN'
                                ? '#FEF3C7'
                                : op.role === 'SUPPLIER_QA'
                                ? '#ECFEFF'
                                : '#EFF6FF',
                            color:
                              op.role === 'ADMIN'
                                ? '#B45309'
                                : op.role === 'SUPPLIER_QA'
                                ? '#0E7490'
                                : '#1D4ED8',
                            border: `1px solid ${
                              op.role === 'ADMIN'
                                ? '#FDE68A'
                                : op.role === 'SUPPLIER_QA'
                                ? '#A5F3FC'
                                : '#BFDBFE'
                            }`,
                          }}
                        >
                          {roleMeta?.title || op.role}
                        </span>
                      </td>

                      {/* Station */}
                      <td className="py-3 px-3 text-[#334155] whitespace-nowrap">
                        {op.station}
                      </td>

                      {/* Assigned Work */}
                      <td className="py-3 px-3 text-[#475569] max-w-[14rem] truncate" title={op.assignedWork}>
                        {op.assignedWork}
                      </td>

                      {/* Status (text + icon, not color only) */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        {op.status === 'ACTIVE' ? (
                          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#F0FDF4] text-[#15803D] border border-[#BBF7D0]">
                            <CheckCircle2 size={12} className="text-[#15803D]" />
                            <span>Active</span>
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#FEF2F2] text-[#B91C1C] border border-[#FECACA]">
                            <Ban size={12} className="text-[#B91C1C]" />
                            <span>Disabled</span>
                          </div>
                        )}
                      </td>

                      {/* Created */}
                      <td className="py-3 px-3 font-mono text-[11px] text-[#64748B] whitespace-nowrap">
                        {new Date(op.createdAt).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button
                              type="button"
                              className="p-1 rounded-[2px] text-[#64748B] hover:text-[#0F172A] hover:bg-[#E2E8F0] transition-colors"
                              aria-label={`Actions for ${op.fullName}`}
                            >
                              <MoreHorizontal size={16} />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-44 text-xs font-sans">
                            <DropdownMenuItem
                              onClick={() => handleOpenEdit(op)}
                              className="gap-2 cursor-pointer"
                            >
                              <Edit size={13} className="text-[#1D4ED8]" />
                              <span>Edit Details</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleOpenReset(op)}
                              className="gap-2 cursor-pointer"
                            >
                              <KeyRound size={13} className="text-[#B45309]" />
                              <span>Reset Password</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleToggleStatus(op)}
                              disabled={isCurrentUser && op.role === 'ADMIN' && op.status === 'ACTIVE'}
                              className={`gap-2 cursor-pointer ${
                                op.status === 'ACTIVE'
                                  ? 'text-[#B91C1C] focus:text-[#B91C1C]'
                                  : 'text-[#15803D] focus:text-[#15803D]'
                              }`}
                            >
                              {op.status === 'ACTIVE' ? (
                                <>
                                  <Ban size={13} />
                                  <span>Disable Account</span>
                                </>
                              ) : (
                                <>
                                  <CheckCircle2 size={13} />
                                  <span>Enable Account</span>
                                </>
                              )}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================= */}
      {/* ADD OPERATOR DIALOG */}
      {/* ========================================================= */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-[#0F172A] flex items-center gap-2">
              <UserPlus size={18} className="text-[#1D4ED8]" />
              <span>Add Station Operator</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-[#64748B]">
              Provision credentials and role privileges for a new station inspector or administrator.
            </DialogDescription>
          </DialogHeader>

          {addErrors.general && (
            <div className="p-2.5 rounded-[3px] bg-[#FEF2F2] border border-[#FECACA] text-[#B91C1C] text-xs flex items-center gap-2">
              <AlertCircle size={14} className="shrink-0" />
              <span>{addErrors.general}</span>
            </div>
          )}

          <form onSubmit={handleCreateOperator} className="space-y-3.5 my-1 text-xs">
            {/* Full Name & User ID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-[#0F172A] mb-1">
                  Full Name <span className="text-[#B91C1C]">*</span>
                </label>
                <input
                  type="text"
                  value={addFullName}
                  onChange={(e) => setAddFullName(e.target.value)}
                  placeholder="e.g. Suresh Kumar"
                  className="w-full h-8 px-2.5 rounded-[3px] border border-[#D9DEE5] text-[#0F172A] bg-white focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]"
                />
                {addErrors.fullName && (
                  <p className="text-[10px] text-[#B91C1C] mt-0.5">{addErrors.fullName}</p>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#0F172A] mb-1">
                  User ID <span className="text-[#B91C1C]">*</span>
                </label>
                <input
                  type="text"
                  value={addUserId}
                  onChange={(e) => setAddUserId(e.target.value)}
                  placeholder="e.g. usr-005"
                  className="w-full h-8 px-2.5 font-mono rounded-[3px] border border-[#D9DEE5] text-[#0F172A] bg-white focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]"
                />
                {addErrors.userId && (
                  <p className="text-[10px] text-[#B91C1C] mt-0.5">{addErrors.userId}</p>
                )}
              </div>
            </div>

            {/* Email & Employee ID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-[#0F172A] mb-1">
                  Email Address <span className="text-[#B91C1C]">*</span>
                </label>
                <input
                  type="email"
                  value={addEmail}
                  onChange={(e) => setAddEmail(e.target.value)}
                  placeholder="suresh.kumar@maruti-fabriscan.internal"
                  className="w-full h-8 px-2.5 rounded-[3px] border border-[#D9DEE5] text-[#0F172A] bg-white focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]"
                />
                {addErrors.email && (
                  <p className="text-[10px] text-[#B91C1C] mt-0.5">{addErrors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#0F172A] mb-1">
                  Employee ID <span className="text-[#B91C1C]">*</span>
                </label>
                <input
                  type="text"
                  value={addEmployeeId}
                  onChange={(e) => setAddEmployeeId(e.target.value)}
                  placeholder="MS-QC-5120"
                  className="w-full h-8 px-2.5 font-mono rounded-[3px] border border-[#D9DEE5] text-[#0F172A] bg-white focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]"
                />
                {addErrors.employeeId && (
                  <p className="text-[10px] text-[#B91C1C] mt-0.5">{addErrors.employeeId}</p>
                )}
              </div>
            </div>

            {/* Role Select */}
            <div>
              <label className="block text-[11px] font-semibold text-[#0F172A] mb-1">
                Role <span className="text-[#B91C1C]">*</span>
              </label>
              <Select value={addRole} onValueChange={(val) => setAddRole(val as UserRole)}>
                <SelectTrigger className="w-full h-8 text-xs font-sans">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="QC_INSPECTOR">QC Line Inspector</SelectItem>
                  <SelectItem value="QA_SUPERVISOR">QA Supervisor</SelectItem>
                  <SelectItem value="SUPPLIER_QA">Supplier QA Auditor</SelectItem>
                  <SelectItem value="ADMIN">System Administrator</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Station */}
            <div>
              <label className="block text-[11px] font-semibold text-[#0F172A] mb-1">
                Station
              </label>
              <input
                type="text"
                value={addStation}
                onChange={(e) => setAddStation(e.target.value)}
                placeholder="Stamping Press 04 · Bay B"
                className="w-full h-8 px-2.5 rounded-[3px] border border-[#D9DEE5] text-[#0F172A] bg-white focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]"
              />
            </div>

            {/* Assigned Work */}
            <div>
              <label className="block text-[11px] font-semibold text-[#0F172A] mb-1">
                Assigned Work
              </label>
              <input
                type="text"
                value={addAssignedWork}
                onChange={(e) => setAddAssignedWork(e.target.value)}
                placeholder="Line 04 visual inspection, shift A"
                className="w-full h-8 px-2.5 rounded-[3px] border border-[#D9DEE5] text-[#0F172A] bg-white focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]"
              />
            </div>

            {/* Temporary Password */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-semibold text-[#0F172A]">
                  Temporary Password <span className="text-[#B91C1C]">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setAddPassword(generateRandomPassword(12))}
                  className="text-[11px] text-[#1D4ED8] hover:underline flex items-center gap-1 font-medium cursor-pointer"
                >
                  <Sparkles size={12} />
                  <span>Generate</span>
                </button>
              </div>

              <div className="relative">
                <input
                  type={showAddPassword ? 'text' : 'password'}
                  value={addPassword}
                  onChange={(e) => setAddPassword(e.target.value)}
                  placeholder="Min 8 characters"
                  className="w-full h-8 pl-2.5 pr-8 font-mono rounded-[3px] border border-[#D9DEE5] text-[#0F172A] bg-white focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]"
                />
                <button
                  type="button"
                  onClick={() => setShowAddPassword(!showAddPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#0F172A]"
                  aria-label={showAddPassword ? 'Hide password' : 'Show password'}
                >
                  {showAddPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              {addErrors.temporaryPassword && (
                <p className="text-[10px] text-[#B91C1C] mt-0.5">{addErrors.temporaryPassword}</p>
              )}
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setAddOpen(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="default"
                size="sm"
                className="bg-[#1D4ED8] hover:bg-[#1E40AF] text-white text-xs font-semibold"
              >
                Create operator
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ========================================================= */}
      {/* EDIT OPERATOR DIALOG */}
      {/* ========================================================= */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-[#0F172A] flex items-center gap-2">
              <Edit size={18} className="text-[#1D4ED8]" />
              <span>Edit Operator Details</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-[#64748B]">
              Update role assignment, station details, or employee contact information.
            </DialogDescription>
          </DialogHeader>

          {editErrors.general && (
            <div className="p-2.5 rounded-[3px] bg-[#FEF2F2] border border-[#FECACA] text-[#B91C1C] text-xs flex items-center gap-2">
              <AlertCircle size={14} className="shrink-0" />
              <span>{editErrors.general}</span>
            </div>
          )}

          <form onSubmit={handleUpdateOperator} className="space-y-3.5 my-1 text-xs">
            {/* User ID (read-only) */}
            <div>
              <label className="block text-[11px] font-semibold text-[#64748B] mb-1">
                User ID (Permanent Identifier)
              </label>
              <input
                type="text"
                disabled
                value={selectedUser?.userId || ''}
                className="w-full h-8 px-2.5 font-mono rounded-[3px] border border-[#E2E8F0] bg-[#F1F5F9] text-[#64748B] cursor-not-allowed text-xs"
              />
            </div>

            {/* Full Name & Employee ID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-[#0F172A] mb-1">
                  Full Name <span className="text-[#B91C1C]">*</span>
                </label>
                <input
                  type="text"
                  value={editFullName}
                  onChange={(e) => setEditFullName(e.target.value)}
                  className="w-full h-8 px-2.5 rounded-[3px] border border-[#D9DEE5] text-[#0F172A] bg-white focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]"
                />
                {editErrors.fullName && (
                  <p className="text-[10px] text-[#B91C1C] mt-0.5">{editErrors.fullName}</p>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#0F172A] mb-1">
                  Employee ID <span className="text-[#B91C1C]">*</span>
                </label>
                <input
                  type="text"
                  value={editEmployeeId}
                  onChange={(e) => setEditEmployeeId(e.target.value)}
                  className="w-full h-8 px-2.5 font-mono rounded-[3px] border border-[#D9DEE5] text-[#0F172A] bg-white focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]"
                />
                {editErrors.employeeId && (
                  <p className="text-[10px] text-[#B91C1C] mt-0.5">{editErrors.employeeId}</p>
                )}
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-[11px] font-semibold text-[#0F172A] mb-1">
                Email Address <span className="text-[#B91C1C]">*</span>
              </label>
              <input
                type="email"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                className="w-full h-8 px-2.5 rounded-[3px] border border-[#D9DEE5] text-[#0F172A] bg-white focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]"
              />
              {editErrors.email && (
                <p className="text-[10px] text-[#B91C1C] mt-0.5">{editErrors.email}</p>
              )}
            </div>

            {/* Role Select */}
            <div>
              <label className="block text-[11px] font-semibold text-[#0F172A] mb-1">
                Role Assignment <span className="text-[#B91C1C]">*</span>
              </label>
              <Select value={editRole} onValueChange={(val) => setEditRole(val as UserRole)}>
                <SelectTrigger className="w-full h-8 text-xs font-sans">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="QC_INSPECTOR">QC Line Inspector</SelectItem>
                  <SelectItem value="QA_SUPERVISOR">QA Supervisor</SelectItem>
                  <SelectItem value="SUPPLIER_QA">Supplier QA Auditor</SelectItem>
                  <SelectItem value="ADMIN">System Administrator</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Station */}
            <div>
              <label className="block text-[11px] font-semibold text-[#0F172A] mb-1">
                Station
              </label>
              <input
                type="text"
                value={editStation}
                onChange={(e) => setEditStation(e.target.value)}
                className="w-full h-8 px-2.5 rounded-[3px] border border-[#D9DEE5] text-[#0F172A] bg-white focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]"
              />
            </div>

            {/* Assigned Work */}
            <div>
              <label className="block text-[11px] font-semibold text-[#0F172A] mb-1">
                Assigned Work
              </label>
              <input
                type="text"
                value={editAssignedWork}
                onChange={(e) => setEditAssignedWork(e.target.value)}
                className="w-full h-8 px-2.5 rounded-[3px] border border-[#D9DEE5] text-[#0F172A] bg-white focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setEditOpen(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="default"
                size="sm"
                className="bg-[#1D4ED8] hover:bg-[#1E40AF] text-white text-xs font-semibold"
              >
                Save changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ========================================================= */}
      {/* RESET PASSWORD DIALOG */}
      {/* ========================================================= */}
      <Dialog open={resetOpen} onOpenChange={setResetOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-[#0F172A] flex items-center gap-2">
              <KeyRound size={18} className="text-[#B45309]" />
              <span>Reset Operator Password</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-[#64748B]">
              Set a temporary password for {selectedUser?.fullName} ({selectedUser?.userId}).
            </DialogDescription>
          </DialogHeader>

          {resetErrors.general && (
            <div className="p-2.5 rounded-[3px] bg-[#FEF2F2] border border-[#FECACA] text-[#B91C1C] text-xs flex items-center gap-2">
              <AlertCircle size={14} className="shrink-0" />
              <span>{resetErrors.general}</span>
            </div>
          )}

          <form onSubmit={handleResetPassword} className="space-y-3.5 my-1 text-xs">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-semibold text-[#0F172A]">
                  New Password <span className="text-[#B91C1C]">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setResetPasswordVal(generateRandomPassword(12))}
                  className="text-[11px] text-[#1D4ED8] hover:underline flex items-center gap-1 font-medium cursor-pointer"
                >
                  <Sparkles size={12} />
                  <span>Generate</span>
                </button>
              </div>

              <div className="relative">
                <input
                  type={showResetPassword ? 'text' : 'password'}
                  value={resetPasswordVal}
                  onChange={(e) => setResetPasswordVal(e.target.value)}
                  placeholder="Min 8 characters"
                  className="w-full h-8 pl-2.5 pr-8 font-mono rounded-[3px] border border-[#D9DEE5] text-[#0F172A] bg-white focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]"
                />
                <button
                  type="button"
                  onClick={() => setShowResetPassword(!showResetPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#0F172A]"
                  aria-label={showResetPassword ? 'Hide password' : 'Show password'}
                >
                  {showResetPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              {resetErrors.temporaryPassword && (
                <p className="text-[10px] text-[#B91C1C] mt-0.5">
                  {resetErrors.temporaryPassword}
                </p>
              )}
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setResetOpen(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="default"
                size="sm"
                className="bg-[#1D4ED8] hover:bg-[#1E40AF] text-white text-xs font-semibold"
              >
                Update password
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Operators;
