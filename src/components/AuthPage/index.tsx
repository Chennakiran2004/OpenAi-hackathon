import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import SearchableSelect from '../ui/SearchableSelect';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { RiSeedlingFill } from 'react-icons/ri';
import { HiExclamationCircle } from 'react-icons/hi';

function AuthPage() {
  const {
    authMode,
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
    switchMode,
  } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-light via-white to-primary-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-primary rounded-2xl shadow-lg mb-4">
            <RiSeedlingFill className="text-white text-3xl" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Bharat Krishi Setu</h1>
          <p className="text-gray-600">Agricultural Supply Chain Platform</p>
        </div>

        <Card variant="elevated" className="shadow-xl">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {authMode === 'signin' ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-gray-600">
              {authMode === 'signin'
                ? 'Sign in to access your dashboard'
                : 'Register to start optimizing your supply chain'}
            </p>
          </div>

          <form onSubmit={submitAuth} className="space-y-4">
            <Input
              label="Username"
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
            />

            <Input
              label="Password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />

            {authMode === 'signup' && (
              <>
                <Input
                  label="Confirm Password"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                />

                <Input
                  label="Email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                />

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="First Name"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="First name"
                  />

                  <Input
                    label="Last Name"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Last name"
                  />
                </div>

                <SearchableSelect
                  label="State"
                  required
                  value={stateId === '' ? '' : stateId}
                  onChange={(value) => setStateId(value === '' ? '' : Number(value))}
                  options={stateOptions.map(s => ({ value: s.id, label: s.name }))}
                  placeholder={stateOptionsLoading ? 'Loading states...' : 'Select your state'}
                  disabled={stateOptionsLoading}
                />

                <SearchableSelect
                  label="District"
                  required
                  value={districtId === '' ? '' : districtId}
                  onChange={(value) => setDistrictId(value === '' ? '' : Number(value))}
                  options={districtOptions.map(d => ({ value: d.id, label: d.name }))}
                  placeholder={districtOptionsLoading ? 'Loading districts...' : 'Select your district'}
                  disabled={stateId === '' || districtOptionsLoading}
                />

                <Input
                  label="Designation"
                  type="text"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  placeholder="e.g. District Agriculture Officer"
                  helperText="Optional"
                />
              </>
            )}

            {authError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                <HiExclamationCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-red-800">{authError}</p>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              fullWidth
              size="lg"
              loading={authLoading}
              disabled={authLoading}
            >
              {authLoading
                ? (authMode === 'signin' ? 'Signing In...' : 'Creating Account...')
                : (authMode === 'signin' ? 'Sign In' : 'Create Account')
              }
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              {authMode === 'signin' ? "Don't have an account?" : 'Already have an account?'}{' '}
              <button
                type="button"
                onClick={switchMode}
                className="text-brand-primary font-medium hover:text-primary-700 transition-colors"
              >
                {authMode === 'signin' ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>
        </Card>

        <p className="text-center text-sm text-gray-500 mt-6">
          © 2024 Bharat Krishi Setu. All rights reserved.
        </p>
      </div>
    </div>
  );
}

export default AuthPage;
