import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import {
  clearAccessToken,
  clearStoredSector,
  getErrorMessage,
  getStoredSector,
  setAccessToken,
  setStoredRole,
  setStoredUser,
  getStates,
  getDistricts,
  login as apiLogin,
  register as apiRegister,
  logout as apiLogout,
} from "../api/clientapi";
import type { RegisterPayload, StoredUser, StateOption, DistrictOption } from "../api/types";
import type { AuthMode, Role, User } from "../components/types";
import { showSuccess, showError, showInfo } from '../utils/toast';

function storedUserToUser(stored: StoredUser, role: Role): User {
  const name = stored.username;
  const email = stored.profile?.phone ?? "";
  const profile = stored.profile
    ? {
      state_name: stored.profile.state_name,
      district_name: stored.profile.district_name,
      designation: stored.profile.designation,
      phone: stored.profile.phone,
    }
    : undefined;
  return { name, email, role, profile };
}

function getRouteForStoredSector(): string {
  const sector = getStoredSector();
  if (sector === "petroleum") return "/petroleum/dashboard";
  if (sector === "agriculture") return "/dashboard";
  return "/choose-sector";
}

type AuthContextValue = {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  sessionRestored: boolean;
  setSessionRestored: React.Dispatch<React.SetStateAction<boolean>>;
  authMode: AuthMode;
  setAuthMode: React.Dispatch<React.SetStateAction<AuthMode>>;
  roleChoice: Role;
  setRoleChoice: React.Dispatch<React.SetStateAction<Role>>;
  username: string;
  setUsername: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  confirmPassword: string;
  setConfirmPassword: (value: string) => void;
  firstName: string;
  setFirstName: (value: string) => void;
  lastName: string;
  setLastName: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
  stateId: number | "";
  setStateId: (value: number | "") => void;
  districtId: number | "";
  setDistrictId: (value: number | "") => void;
  stateOptions: StateOption[];
  districtOptions: DistrictOption[];
  stateOptionsLoading: boolean;
  districtOptionsLoading: boolean;
  designation: string;
  setDesignation: (value: string) => void;
  authError: string | null;
  authLoading: boolean;
  submitAuth: (event: React.FormEvent<HTMLFormElement>) => Promise<void>;
  logout: () => void;
  switchMode: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const [user, setUser] = useState<User | null>(null);
  const [sessionRestored, setSessionRestored] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>("signin");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [roleChoice, setRoleChoice] = useState<Role>("state_officer");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [stateId, setStateId] = useState<number | "">("");
  const [districtId, setDistrictId] = useState<number | "">("");
  const [stateOptions, setStateOptions] = useState<StateOption[]>([]);
  const [districtOptions, setDistrictOptions] = useState<DistrictOption[]>([]);
  const [stateOptionsLoading, setStateOptionsLoading] = useState(false);
  const [districtOptionsLoading, setDistrictOptionsLoading] = useState(false);
  const [designation, setDesignation] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  const loadStateOptions = useCallback(async () => {
    setStateOptionsLoading(true);
    try {
      const list = await getStates();
      setStateOptions(list);
    } catch {
      setStateOptions([]);
    } finally {
      setStateOptionsLoading(false);
    }
  }, []);

  const loadDistrictOptions = useCallback(async (stateIdParam: number | "") => {
    if (stateIdParam === "") {
      setDistrictOptions([]);
      setDistrictId("");
      return;
    }
    setDistrictOptionsLoading(true);
    try {
      const list = await getDistricts(Number(stateIdParam));
      setDistrictOptions(list);
    } catch {
      setDistrictOptions([]);
    } finally {
      setDistrictOptionsLoading(false);
    }
    setDistrictId("");
  }, []);

  useEffect(() => {
    if (location.pathname !== "/auth") return;
    const mode = searchParams.get("mode");
    const role = searchParams.get("role");
    if (mode === "signin" || mode === "signup") setAuthMode(mode);
    if (role === "state_officer" || role === "central_admin") setRoleChoice(role);
  }, [location.pathname, location.search, searchParams]);

  useEffect(() => {
    if (location.pathname !== "/auth" || authMode !== "signup") return;
    loadStateOptions();
  }, [location.pathname, authMode, loadStateOptions]);

  useEffect(() => {
    if (stateId === "") {
      setDistrictOptions([]);
      setDistrictId("");
      return;
    }
    loadDistrictOptions(stateId);
  }, [stateId, loadDistrictOptions]);

  const submitAuth = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setAuthError(null);
      const trimmedUsername = username.trim();
      const trimmedPassword = password.trim();

      if (authMode === "signin") {
        setAuthLoading(true);
        try {
          const data = await apiLogin(trimmedUsername, trimmedPassword);
          setAccessToken(data.token);
          setStoredRole(roleChoice);
          setStoredUser({
            user_id: data.user_id,
            username: data.username,
            profile: data.profile,
          });
          setUser(storedUserToUser({ user_id: data.user_id, username: data.username, profile: data.profile }, roleChoice));
          showSuccess(`Welcome back, ${data.username}! 👋`);
          navigate(getRouteForStoredSector(), { replace: true });
        } catch (err) {
          const errorMsg = getErrorMessage(err);
          setAuthError(errorMsg);
          showError(errorMsg || 'Login failed. Please try again.');
        } finally {
          setAuthLoading(false);
        }
        return;
      }

      if (authMode === "signup") {
        if (trimmedPassword !== confirmPassword.trim()) {
          setAuthError("Passwords do not match.");
          return;
        }

        // Validate required fields
        const trimmedEmail = email.trim();
        if (!trimmedEmail) {
          setAuthError("Email is required.");
          return;
        }

        if (stateId === "") {
          setAuthError("Please select a state.");
          return;
        }

        if (districtId === "") {
          setAuthError("Please select a district.");
          return;
        }

        const payload: RegisterPayload = {
          username: trimmedUsername,
          password: trimmedPassword,
          email: trimmedEmail,
          first_name: firstName.trim() || undefined,
          last_name: lastName.trim() || undefined,
          state_id: Number(stateId),
          district_id: Number(districtId),
          designation: designation.trim() || undefined,
        };
        setAuthLoading(true);
        try {
          const data = await apiRegister(payload);
          setAccessToken(data.token);
          setStoredRole(roleChoice);

          // Construct profile data from registration payload
          const selectedState = stateOptions.find(s => s.id === Number(stateId));
          const selectedDistrict = districtOptions.find(d => d.id === Number(districtId));

          const profileData = {
            state: Number(stateId),
            state_name: selectedState?.name,
            district: Number(districtId),
            district_name: selectedDistrict?.name,
            designation: designation.trim() || undefined,
            phone: trimmedEmail, // Use email as phone for now
          };

          const storedUser = {
            user_id: data.user_id,
            username: data.username,
            profile: data.profile || profileData, // Use backend profile or constructed one
          };

          setStoredUser(storedUser);
          setUser(storedUserToUser(storedUser, roleChoice));
          showSuccess('Account created successfully! Welcome aboard! 🎉');
          clearStoredSector();
          navigate("/choose-sector", { replace: true });
        } catch (err) {
          const errorMsg = getErrorMessage(err);
          setAuthError(errorMsg);
          showError(errorMsg || 'Registration failed. Please try again.');
        } finally {
          setAuthLoading(false);
        }
      }
    },
    [
      authMode,
      username,
      password,
      confirmPassword,
      firstName,
      lastName,
      email,
      stateId,
      districtId,
      designation,
      roleChoice,
      navigate,
    ]
  );

  const logout = useCallback(() => {
    apiLogout().catch(() => { });
    clearAccessToken();
    setUser(null);
    setUsername("");
    setPassword("");
    setConfirmPassword("");
    setFirstName("");
    setLastName("");
    setEmail("");
    setStateId("");
    setDistrictId("");
    setStateOptions([]);
    setDistrictOptions([]);
    setDesignation("");
    showInfo('Logged out successfully');
    navigate("/");
  }, [navigate]);

  const switchMode = useCallback(() => {
    setAuthMode((m) => (m === "signin" ? "signup" : "signin"));
    setAuthError(null);
  }, []);

  const value: AuthContextValue = {
    user,
    setUser,
    sessionRestored,
    setSessionRestored,
    authMode,
    setAuthMode,
    roleChoice,
    setRoleChoice,
    username,
    setUsername,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    firstName,
    setFirstName,
    lastName,
    setLastName,
    email,
    setEmail,
    stateId,
    setStateId,
    districtId,
    setDistrictId,
    stateOptions,
    districtOptions,
    stateOptionsLoading,
    districtOptionsLoading,
    designation,
    setDesignation,
    authError,
    authLoading,
    submitAuth,
    logout,
    switchMode,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export { storedUserToUser };
